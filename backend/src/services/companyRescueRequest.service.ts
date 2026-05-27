import { isValidObjectId, Types } from 'mongoose';
import companyRepository from '../repositories/company.repository';
import serviceRepository from '../repositories/service.repository';
import serviceCategoryRepository from '../repositories/serviceCategory.repository';
import { RescueRequest } from '../models/RescueRequest.model';
import type { IPayment, PaymentMethod } from '../models/RescueRequest.model';
import { Vehicle } from '../models/Vehicle.model';

export interface SearchParams {
  lat: number;
  lng: number;
  incident_type?: string;
  max_distance_km?: number;
}

export interface CompanyResult {
  _id: string;
  company_name: string;
  director_name: string;
  email: string;
  phone: string;
  address: {
    province?: string;
    district?: string;
    ward?: string;
    detail?: string;
  };
  location: {
    type: 'Point';
    coordinates: number[];
  };
  distance_km: number;
  rating_avg: number;
  rating_count: number;
  status: string;
  service_names: string[];
  min_price: number | null;
  max_price: number | null;
  eta_minutes: number | null;
}

export interface PendingRescueRequestResult {
  _id: string;
  title: string;
  description: string;
  distance_km: number | null;
  eta_minutes?: number | null;
  created_at?: Date;
  address?: Record<string, unknown>;
  status?: string;
}

export interface PendingRescueRequestDetailResult extends PendingRescueRequestResult {
  customer: {
    full_name: string;
    phone: string;
  };
  incident_photos: string[];
  location?: {
    type: 'Point';
    coordinates: number[];
  };
}

export interface ActiveRescueRequestResult extends PendingRescueRequestResult {
  vehicle: {
    vehicle_type: string;
    plate_number: string;
  };
  accepted_at?: Date;
}

export interface CompletedRescueRequestResult extends ActiveRescueRequestResult {
  completed_at?: Date;
  payment?: IPayment;
}

export interface CompletedRescueRequestDetailResult extends CompletedRescueRequestResult {
  customer: {
    full_name: string;
    phone: string;
  };
}

export interface CanceledRescueRequestResult extends ActiveRescueRequestResult {
  cancelled_at?: Date;
  cancellation?: Record<string, unknown>;
}

export interface CanceledRescueRequestDetailResult extends CanceledRescueRequestResult {
  customer: {
    full_name: string;
    phone: string;
  };
}

export interface ActiveRescueRequestDetailResult extends ActiveRescueRequestResult {
  customer: {
    full_name: string;
    phone: string;
  };
}

export interface AcceptRescueRequestData {
  vehicle_id: string;
  eta_minutes: number;
  note?: string | null;
}

export interface CompleteRescueRequestData {
  amount: number;
  method?: PaymentMethod;
  note?: string | null;
}

export interface RouteEstimateResult {
  distance_km: number | null;
  eta_minutes: number | null;
  origin: {
    lat: number;
    lng: number;
  } | null;
}

class CompanyRescueRequestService {
  async getPendingRequestsForCompany(companyId: string): Promise<PendingRescueRequestResult[]> {
    const company = await companyRepository.findById(companyId);
    const companyCoords = company?.location?.coordinates;

    const requests = await RescueRequest.find({
      'company.company_id': companyId,
      status: 'pending',
    })
      .populate('service_types', 'name slug')
      .sort({ created_at: -1 })
      .lean()
      .exec();

    return requests.map((request: any) => {
      const distanceKm = this.getDistanceFromCoordinates(companyCoords, request.location?.coordinates);
      const serviceName = request.service_types?.[0]?.name;

      return {
        _id: request._id.toString(),
        title: serviceName || this.getTitleFromDescription(request.description),
        description: request.description,
        distance_km: distanceKm,
        eta_minutes: request.eta_minutes ?? null,
        created_at: request.created_at,
        address: request.address,
        status: request.status,
      };
    });
  }

  async getPendingRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<PendingRescueRequestDetailResult | null> {
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const company = await companyRepository.findById(companyId);
    const request = (await RescueRequest.findOne({
      _id: requestId,
      'company.company_id': companyId,
      status: 'pending',
    })
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec()) as any;

    if (!request) {
      return null;
    }

    const serviceName = request.service_types?.[0]?.name;

    return {
      _id: request._id.toString(),
      title: serviceName || this.getTitleFromDescription(request.description),
      description: request.description,
      distance_km: this.getDistanceFromCoordinates(company?.location?.coordinates, request.location?.coordinates),
      eta_minutes: request.eta_minutes ?? null,
      created_at: request.created_at,
      address: request.address,
      status: request.status,
      customer: {
        full_name: request.user_id?.full_name || 'Khach hang',
        phone: request.user_id?.phone || '',
      },
      incident_photos: request.incident_photos || [],
      location: request.location,
    };
  }

  async getActiveRequestsForCompany(companyId: string): Promise<ActiveRescueRequestResult[]> {
    const requests = await RescueRequest.find({
      'company.company_id': companyId,
      status: { $in: ['accepted', 'in_progress'] },
    })
      .populate('service_types', 'name slug')
      .sort({ started_at: -1, accepted_at: -1, created_at: -1 })
      .lean()
      .exec();

    return Promise.all(requests.map((request: any) => this.mapRequestWithVehicle(request)));
  }

  async getActiveRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<ActiveRescueRequestDetailResult | null> {
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const request = (await RescueRequest.findOne({
      _id: requestId,
      'company.company_id': companyId,
      status: { $in: ['accepted', 'in_progress'] },
    })
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec()) as any;

    if (!request) {
      return null;
    }

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: {
        full_name: request.user_id?.full_name || 'Khach hang',
        phone: request.user_id?.phone || '',
      },
    };
  }

  async acceptPendingRequestForCompany(
    companyId: string,
    requestId: string,
    data: AcceptRescueRequestData
  ): Promise<ActiveRescueRequestDetailResult | null> {
    if (!isValidObjectId(requestId) || !isValidObjectId(data.vehicle_id)) {
      return null;
    }

    const vehicle = await Vehicle.findOne({
      _id: data.vehicle_id,
      company_id: companyId,
    })
      .select('vehicle_type plate_number status')
      .lean()
      .exec();

    if (!vehicle) {
      throw new Error('Xe cuu ho khong ton tai hoac khong thuoc cong ty');
    }

    if (vehicle.status === 'unavailable') {
      throw new Error('Xe cuu ho dang khong kha dung');
    }

    const acceptedAt = new Date();
    const request = (await RescueRequest.findOneAndUpdate(
      {
        _id: requestId,
        'company.company_id': companyId,
        status: 'pending',
      },
      {
        $set: {
          status: 'accepted',
          vehicle: {
            vehicle_id: new Types.ObjectId(data.vehicle_id),
            plate_number: vehicle.plate_number,
          },
          eta_minutes: data.eta_minutes,
          accepted_at: acceptedAt,
        },
        $push: {
          status_history: {
            status: 'accepted',
            changed_by: 'company',
            changed_at: acceptedAt,
            note: data.note || `Du kien den trong ${data.eta_minutes} phut`,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec()) as any;

    if (!request) {
      return null;
    }

    await Vehicle.findByIdAndUpdate(data.vehicle_id, { status: 'unavailable' }).exec();

    return {
      ...(await this.mapRequestWithVehicle(request, vehicle)),
      customer: {
        full_name: request.user_id?.full_name || 'Khach hang',
        phone: request.user_id?.phone || '',
      },
    };
  }

  async getCompletedRequestsForCompany(companyId: string): Promise<CompletedRescueRequestResult[]> {
    const requests = await RescueRequest.find({
      'company.company_id': companyId,
      status: 'completed',
    })
      .populate('service_types', 'name slug')
      .sort({ completed_at: -1, updated_at: -1, created_at: -1 })
      .lean()
      .exec();

    return Promise.all(requests.map((request: any) => this.mapRequestWithVehicle(request)));
  }

  async getCompletedRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<CompletedRescueRequestDetailResult | null> {
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const request = (await RescueRequest.findOne({
      _id: requestId,
      'company.company_id': companyId,
      status: 'completed',
    })
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec()) as any;

    if (!request) {
      return null;
    }

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: {
        full_name: request.user_id?.full_name || 'Khach hang',
        phone: request.user_id?.phone || '',
      },
    };
  }

  async completeActiveRequestForCompany(
    companyId: string,
    requestId: string,
    data: CompleteRescueRequestData
  ): Promise<CompletedRescueRequestDetailResult | null> {
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const completedAt = new Date();
    const request = (await RescueRequest.findOneAndUpdate(
      {
        _id: requestId,
        'company.company_id': companyId,
        status: { $in: ['accepted', 'in_progress'] },
      },
      {
        $set: {
          status: 'completed',
          completed_at: completedAt,
          payment: {
            amount: data.amount,
            method: data.method || 'cash',
            paid_at: completedAt,
          },
        },
        $push: {
          status_history: {
            status: 'completed',
            changed_by: 'company',
            changed_at: completedAt,
            note: data.note || `Thanh toán thực tế: ${data.amount}`,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec()) as any;

    if (!request) {
      return null;
    }

    if (request.vehicle?.vehicle_id) {
      await Vehicle.findOneAndUpdate(
        {
          _id: request.vehicle.vehicle_id,
          company_id: companyId,
        },
        { status: 'available' }
      ).exec();
    }

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: {
        full_name: request.user_id?.full_name || 'Khách hàng',
        phone: request.user_id?.phone || '',
      },
    };
  }

  async getCanceledRequestsForCompany(companyId: string): Promise<CanceledRescueRequestResult[]> {
    const requests = await RescueRequest.find({
      'company.company_id': companyId,
      status: 'cancelled',
    })
      .populate('service_types', 'name slug')
      .sort({ cancelled_at: -1, updated_at: -1, created_at: -1 })
      .lean()
      .exec();

    return Promise.all(requests.map((request: any) => this.mapRequestWithVehicle(request)));
  }

  async getCanceledRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<CanceledRescueRequestDetailResult | null> {
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const request = (await RescueRequest.findOne({
      _id: requestId,
      'company.company_id': companyId,
      status: 'cancelled',
    })
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec()) as any;

    if (!request) {
      return null;
    }

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: {
        full_name: request.user_id?.full_name || 'Khách hàng',
        phone: request.user_id?.phone || '',
      },
    };
  }

  async estimateRequestRouteForCompany(
    companyId: string,
    requestId: string,
    origin?: { lat: number; lng: number }
  ): Promise<RouteEstimateResult | null> {
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const [company, request] = await Promise.all([
      companyRepository.findById(companyId),
      RescueRequest.findOne({
        _id: requestId,
        'company.company_id': companyId,
      })
        .select('location')
        .lean()
        .exec(),
    ]);

    if (!request) {
      return null;
    }

    const companyCoords = company?.location?.coordinates;
    const originCoords = origin ? [origin.lng, origin.lat] : companyCoords;
    const distanceKm = this.getDistanceFromCoordinates(originCoords, (request as any).location?.coordinates);

    return {
      distance_km: distanceKm,
      eta_minutes: distanceKm === null ? null : this.estimateEtaMinutes(distanceKm),
      origin: originCoords
        ? {
            lng: originCoords[0],
            lat: originCoords[1],
          }
        : null,
    };
  }

  async searchNearbyCompanies(params: SearchParams): Promise<CompanyResult[]> {
    const { lat, lng, incident_type, max_distance_km = 50 } = params;

    let categoryId: string | undefined = undefined;
    if (incident_type) {
      const category = await serviceCategoryRepository.findBySlug(incident_type);
      if (category) {
        categoryId = category._id.toString();
      }
    }

    let companies = await companyRepository.findNearby(lng, lat, max_distance_km);
    if (companies.length === 0) {
      companies = await companyRepository.findSearchable();
    }

    if (companies.length === 0) {
      return [];
    }

    const companyIds = companies.map((company) => (company._id as any).toString());
    const [displayServices, matchingServices] = await Promise.all([
      serviceRepository.findByCompanyIdsAndCategory(companyIds),
      categoryId ? serviceRepository.findByCompanyIdsAndCategory(companyIds, categoryId) : Promise.resolve([]),
    ]);
    const servicesByCompany = new Map<string, string[]>();
    const pricesByCompany = new Map<string, number[]>();
    const matchingCompanyIds = new Set(matchingServices.map((service) => service.company_id.toString()));

    for (const service of displayServices) {
      const companyId = service.company_id.toString();
      if (!servicesByCompany.has(companyId)) {
        servicesByCompany.set(companyId, []);
      }
      if (!pricesByCompany.has(companyId)) {
        pricesByCompany.set(companyId, []);
      }
      servicesByCompany.get(companyId)!.push(service.name);
      pricesByCompany.get(companyId)!.push(service.price);
    }

    const resultCompanies = categoryId
      ? [...companies].sort((a, b) => {
          const aMatches = matchingCompanyIds.has((a._id as any).toString());
          const bMatches = matchingCompanyIds.has((b._id as any).toString());
          if (aMatches === bMatches) return 0;
          return aMatches ? -1 : 1;
        })
      : companies;

    return resultCompanies.map((company) => {
      const companyId = (company._id as any).toString();
      const coords = company.location?.coordinates ?? [0, 0];
      const distanceKm = this.calcDistanceKm(lat, lng, coords[1], coords[0]);
      const roundedDistanceKm = Math.round(distanceKm * 10) / 10;
      const prices = pricesByCompany.get(companyId) ?? [];

      return {
        _id: companyId,
        company_name: company.company_name,
        director_name: company.director_name,
        email: company.email,
        phone: company.phone,
        address: company.address ?? {},
        location: company.location,
        distance_km: roundedDistanceKm,
        rating_avg: company.rating_avg ?? 0,
        rating_count: company.rating_count ?? 0,
        status: company.status ?? 'active',
        service_names: servicesByCompany.get(companyId) ?? [],
        min_price: prices.length > 0 ? Math.min(...prices) : null,
        max_price: prices.length > 0 ? Math.max(...prices) : null,
        eta_minutes: this.estimateEtaMinutes(roundedDistanceKm),
      };
    });
  }

  private async mapRequestWithVehicle(request: any, providedVehicle?: any): Promise<ActiveRescueRequestResult> {
    const serviceName = request.service_types?.[0]?.name;
    const vehicle =
      providedVehicle ||
      (request.vehicle?.vehicle_id
        ? await Vehicle.findById(request.vehicle.vehicle_id).select('vehicle_type plate_number').lean().exec()
        : null);

    return {
      _id: request._id.toString(),
      title: serviceName || this.getTitleFromDescription(request.description),
      description: request.description,
      distance_km: null,
      eta_minutes: request.eta_minutes ?? null,
      created_at: request.created_at,
      accepted_at: request.accepted_at,
      completed_at: request.completed_at,
      cancelled_at: request.cancelled_at,
      cancellation: request.cancellation,
      address: request.address,
      status: request.status,
      payment: request.payment,
      vehicle: {
        vehicle_type: vehicle?.vehicle_type || 'Xe cứu hộ',
        plate_number: request.vehicle?.plate_number || vehicle?.plate_number || 'Chưa có biển số',
      },
    } as ActiveRescueRequestResult;
  }

  private getDistanceFromCoordinates(originCoords?: number[], destinationCoords?: number[]): number | null {
    if (!originCoords || !destinationCoords) {
      return null;
    }

    const distanceKm = this.calcDistanceKm(
      originCoords[1],
      originCoords[0],
      destinationCoords[1],
      destinationCoords[0]
    );
    return Math.round(distanceKm * 10) / 10;
  }

  private calcDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const radiusKm = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 + Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private estimateEtaMinutes(distanceKm: number): number {
    const averageUrbanSpeedKmH = 30;
    const dispatchBufferMinutes = 5;
    return Math.max(5, Math.ceil((distanceKm / averageUrbanSpeedKmH) * 60 + dispatchBufferMinutes));
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private getTitleFromDescription(description?: string): string {
    if (!description) return 'Su co cuu ho';
    return description.split(/[,.]/)[0].trim() || 'Su co cuu ho';
  }
}

export default new CompanyRescueRequestService();
