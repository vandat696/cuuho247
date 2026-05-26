import { isValidObjectId, Types } from 'mongoose';
import companyRepository from '../repositories/company.repository';
import serviceRepository from '../repositories/service.repository';
import serviceCategoryRepository from '../repositories/serviceCategory.repository';
import { RescueRequest } from '../models/RescueRequest.model';
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

class RescueService {
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
        full_name: request.user_id?.full_name || 'Khach hang',
        phone: request.user_id?.phone || '',
      },
    };
  }

  async searchNearbyCompanies(params: SearchParams): Promise<CompanyResult[]> {
    const { lat, lng, incident_type, max_distance_km = 50 } = params;

    let categoryId: string | undefined = undefined;
    if (incident_type) {
      const category = await serviceCategoryRepository.findBySlug(incident_type);
      if (!category) {
        return [];
      }
      categoryId = category._id.toString();
    }

    const companies = await companyRepository.findNearby(lng, lat, max_distance_km);
    if (companies.length === 0) {
      return [];
    }

    const companyIds = companies.map((company) => (company._id as any).toString());
    const matchingServices = await serviceRepository.findByCompanyIdsAndCategory(companyIds, categoryId);
    const servicesByCompany = new Map<string, string[]>();

    for (const service of matchingServices) {
      const companyId = service.company_id.toString();
      if (!servicesByCompany.has(companyId)) {
        servicesByCompany.set(companyId, []);
      }
      servicesByCompany.get(companyId)!.push(service.name);
    }

    const resultCompanies = categoryId
      ? companies.filter((company) => servicesByCompany.has((company._id as any).toString()))
      : companies;

    return resultCompanies.map((company) => {
      const coords = company.location?.coordinates ?? [0, 0];
      const distanceKm = this.calcDistanceKm(lat, lng, coords[1], coords[0]);

      return {
        _id: (company._id as any).toString(),
        company_name: company.company_name,
        phone: company.phone,
        address: company.address ?? {},
        location: company.location,
        distance_km: Math.round(distanceKm * 10) / 10,
        rating_avg: company.rating_avg ?? 0,
        rating_count: company.rating_count ?? 0,
        status: company.status ?? 'active',
        service_names: servicesByCompany.get((company._id as any).toString()) ?? [],
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
      vehicle: {
        vehicle_type: vehicle?.vehicle_type || 'Xe cuu ho',
        plate_number: request.vehicle?.plate_number || vehicle?.plate_number || 'Chua co bien so',
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

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private getTitleFromDescription(description?: string): string {
    if (!description) return 'Su co cuu ho';
    return description.split(/[,.]/)[0].trim() || 'Su co cuu ho';
  }
}

export default new RescueService();
