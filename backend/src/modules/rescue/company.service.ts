import { Types } from 'mongoose';
import { rescueEventEmitter, RESCUE_EVENTS } from './rescue.event';
import companyRepository from '@/modules/company/company.repository';
import { serviceRepository, serviceCategoryRepository } from '@/modules/service-catalog/service-catalog.repository';
import rescueRepository from './rescue.repository';
import { vehicleRepository } from '@/modules/vehicle/vehicle.repository';
import { getIncidentLabel } from '@/shared/config/incidents';
import { mapIncidentTypeToCategory } from '@/shared/constants/incidentMapping';
import { NotFoundError, BadRequestError } from '@/shared/utils/apiError.util';
import { getDistanceFromCoordinates, estimateEtaMinutes, calcDistanceKm } from '@/shared/utils/geo.util';
import type {
  AcceptRescueRequestData,
  ActiveRescueRequestDetailResult,
  ActiveRescueRequestResult,
  CanceledRescueRequestDetailResult,
  CanceledRescueRequestResult,
  CompanyResult,
  CompleteRescueRequestData,
  CompletedRescueRequestDetailResult,
  CompletedRescueRequestResult,
  PendingRescueRequestDetailResult,
  PendingRescueRequestResult,
  RouteEstimateResult,
  SearchParams,
} from './interfaces/rescue.interface';

/**
 * CompanyRescueRequestService: Xử lý nghiệp vụ Cứu hộ từ phía Công ty.
 *
 * Giao tiếp với module Company thông qua companyRepository (ICompanyRepository).
 * Giao tiếp với module ServiceCatalog thông qua serviceRepository (IServiceRepository).
 * Giao tiếp với Database thông qua rescueRepository (IRescueRepository) và vehicleRepository (IVehicleRepository).
 */
class CompanyRescueRequestService {
  async getPendingRequestsForCompany(companyId: string): Promise<PendingRescueRequestResult[]> {
    const company = await companyRepository.findById(companyId);
    const companyCoords = company?.location?.coordinates;

    const requests = await rescueRepository.findPendingRequestsByCompany(companyId);

    return requests.map((request: any) => {
      const distanceKm = getDistanceFromCoordinates(companyCoords, request.location?.coordinates);
      return this.mapBasicRequest(request, distanceKm);
    });
  }

  async getPendingRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<PendingRescueRequestDetailResult | null> {
    const request = await rescueRepository.findDetail(companyId, requestId, 'pending');
    if (!request) {
      return null;
    }

    const company = await companyRepository.findById(companyId);
    const distanceKm = getDistanceFromCoordinates(company?.location?.coordinates, request.location?.coordinates);

    return {
      ...this.mapBasicRequest(request, distanceKm),
      customer: this.mapCustomer(request.user_id),
      incident_photos: request.incident_photos || [],
      location: request.location,
    };
  }

  async getGenericRequestDetailForCompany(companyId: string, requestId: string): Promise<any | null> {
    const request = await rescueRepository.findDetail(companyId, requestId, [
      'pending',
      'accepted',
      'in_progress',
      'arrived',
      'completed',
      'cancelled',
      'rejected',
      'timeout',
    ]);

    if (!request) {
      return null;
    }

    const company = await companyRepository.findById(companyId);
    const distanceKm = getDistanceFromCoordinates(company?.location?.coordinates, request.location?.coordinates);

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: this.mapCustomer(request.user_id),
      incident_photos: request.incident_photos || [],
      location: request.location,
      distance_km: distanceKm,
    };
  }

  async getActiveRequestsForCompany(companyId: string): Promise<ActiveRescueRequestResult[]> {
    const requests = await rescueRepository.findActiveRequestsByCompany(companyId);
    return Promise.all(requests.map((request: any) => this.mapRequestWithVehicle(request)));
  }

  async getActiveRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<ActiveRescueRequestDetailResult | null> {
    const request = await rescueRepository.findDetail(companyId, requestId, ['accepted', 'in_progress', 'arrived']);
    if (!request) {
      return null;
    }

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: this.mapCustomer(request.user_id),
    };
  }

  async acceptPendingRequestForCompany(
    companyId: string,
    requestId: string,
    data: AcceptRescueRequestData
  ): Promise<ActiveRescueRequestDetailResult | null> {
    const { isValidObjectId } = await import('mongoose');
    if (!isValidObjectId(requestId) || !isValidObjectId(data.vehicle_id)) {
      return null;
    }

    const vehicle = await vehicleRepository.findById(data.vehicle_id);

    if (!vehicle || vehicle.company_id.toString() !== companyId) {
      throw new NotFoundError('Xe cứu hộ không tồn tại hoặc không thuộc công ty');
    }

    if (vehicle.status === 'unavailable') {
      throw new BadRequestError('Xe cứu hộ đang không khả dụng');
    }

    const request = await rescueRepository.acceptPendingRequest(
      companyId,
      requestId,
      data.vehicle_id,
      vehicle.plate_number,
      data.eta_minutes,
      data.note || undefined
    );

    if (!request) {
      return null;
    }

    await vehicleRepository.update(data.vehicle_id, { status: 'unavailable' });

    return {
      ...(await this.mapRequestWithVehicle(request, vehicle)),
      customer: this.mapCustomer(request.user_id),
    };
  }

  async rejectPendingRequestForCompany(
    companyId: string,
    requestId: string,
    reason: string
  ): Promise<PendingRescueRequestDetailResult | null> {
    const { isValidObjectId } = await import('mongoose');
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const request = await rescueRepository.rejectPendingRequest(companyId, requestId, reason);

    if (!request) {
      return null;
    }

    const company = await companyRepository.findById(companyId);
    const distanceKm = getDistanceFromCoordinates(company?.location?.coordinates, request.location?.coordinates);

    return {
      ...this.mapBasicRequest(request, distanceKm),
      customer: this.mapCustomer(request.user_id),
      incident_photos: request.incident_photos || [],
      location: request.location,
    };
  }

  async startActiveRequestForCompany(
    companyId: string,
    requestId: string
  ): Promise<ActiveRescueRequestDetailResult | null> {
    const { isValidObjectId } = await import('mongoose');
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const request = await rescueRepository.startActiveRequest(companyId, requestId);

    if (!request) {
      return null;
    }

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: this.mapCustomer(request.user_id),
    };
  }

  async arriveActiveRequestForCompany(
    companyId: string,
    requestId: string
  ): Promise<ActiveRescueRequestDetailResult | null> {
    const { isValidObjectId } = await import('mongoose');
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const request = await rescueRepository.arriveActiveRequest(companyId, requestId);

    if (!request) {
      return null;
    }

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: this.mapCustomer(request.user_id),
    };
  }

  async getCompletedRequestsForCompany(companyId: string): Promise<CompletedRescueRequestResult[]> {
    const requests = await rescueRepository.findCompletedRequestsByCompany(companyId);
    return Promise.all(requests.map((request: any) => this.mapRequestWithVehicle(request)));
  }

  async getCompletedRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<CompletedRescueRequestDetailResult | null> {
    const request = await rescueRepository.findDetail(companyId, requestId, 'completed');
    if (!request) {
      return null;
    }

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: this.mapCustomer(request.user_id),
    };
  }

  async completeActiveRequestForCompany(
    companyId: string,
    requestId: string,
    data: CompleteRescueRequestData
  ): Promise<CompletedRescueRequestDetailResult | null> {
    const { isValidObjectId } = await import('mongoose');
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const request = await rescueRepository.completeActiveRequest(
      companyId,
      requestId,
      data.amount,
      data.method,
      data.note || undefined
    );

    if (!request) {
      return null;
    }

    if (request.vehicle?.vehicle_id) {
      await vehicleRepository.update(request.vehicle.vehicle_id.toString(), { status: 'available' });
    }

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: this.mapCustomer(request.user_id),
    };
  }

  async getCanceledRequestsForCompany(companyId: string): Promise<CanceledRescueRequestResult[]> {
    const requests = await rescueRepository.findCanceledRequestsByCompany(companyId);
    return Promise.all(requests.map((request: any) => this.mapRequestWithVehicle(request)));
  }

  async getCanceledRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<CanceledRescueRequestDetailResult | null> {
    const request = await rescueRepository.findDetail(companyId, requestId, 'cancelled');
    if (!request) {
      return null;
    }

    return {
      ...(await this.mapRequestWithVehicle(request)),
      customer: this.mapCustomer(request.user_id),
    };
  }

  async estimateRequestRouteForCompany(
    companyId: string,
    requestId: string,
    origin?: { lat: number; lng: number }
  ): Promise<RouteEstimateResult | null> {
    const { isValidObjectId } = await import('mongoose');
    if (!isValidObjectId(requestId)) {
      return null;
    }

    const [company, request] = await Promise.all([
      companyRepository.findById(companyId),
      rescueRepository.findDetail(companyId, requestId, [
        'pending',
        'accepted',
        'in_progress',
        'arrived',
        'completed',
        'cancelled',
      ]),
    ]);

    if (!request) {
      return null;
    }

    const companyCoords = company?.location?.coordinates;
    const originCoords = origin ? [origin.lng, origin.lat] : companyCoords;
    const distanceKm = getDistanceFromCoordinates(originCoords, (request as any).location?.coordinates);

    return {
      distance_km: distanceKm,
      eta_minutes: distanceKm === null ? null : estimateEtaMinutes(distanceKm),
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
      const categorySlug = mapIncidentTypeToCategory(incident_type);
      const category = await serviceCategoryRepository.findBySlug(categorySlug);
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
      servicesByCompany.get(companyId)!.push(service.name);
    }

    const priceSourceServices = categoryId ? matchingServices : displayServices;
    for (const service of priceSourceServices) {
      const companyId = service.company_id.toString();
      if (!pricesByCompany.has(companyId)) {
        pricesByCompany.set(companyId, []);
      }
      pricesByCompany.get(companyId)!.push(service.price);
    }

    const resultCompanies = categoryId
      ? companies.filter((company) => matchingCompanyIds.has((company._id as any).toString()))
      : companies;

    return resultCompanies.map((company) => {
      const companyId = (company._id as any).toString();
      const coords = company.location?.coordinates ?? [0, 0];
      const distanceKm = calcDistanceKm(lat, lng, coords[1], coords[0]);
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
      };
    });
  }

  private async mapRequestWithVehicle(request: any, providedVehicle?: any): Promise<ActiveRescueRequestResult> {
    const vehicle =
      providedVehicle ||
      (request.vehicle?.vehicle_id ? await vehicleRepository.findById(request.vehicle.vehicle_id.toString()) : null);

    return {
      _id: request._id.toString(),
      title: this.getRequestTitle(request),
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
      user_id: request.user_id?._id ? request.user_id._id.toString() : request.user_id?.toString(),
      vehicle: {
        vehicle_type: vehicle?.vehicle_type || 'Xe cứu hộ',
        plate_number: request.vehicle?.plate_number || vehicle?.plate_number || 'Chưa có biển số',
      },
    } as ActiveRescueRequestResult;
  }

  private getRequestTitle(request: any): string {
    const serviceName = request.service_types?.[0]?.name;
    return (request.incident_type && getIncidentLabel(request.incident_type)) || serviceName || 'Sự cố khác';
  }

  private mapBasicRequest(request: any, distanceKm: number | null) {
    return {
      _id: request._id.toString(),
      title: this.getRequestTitle(request),
      description: request.description,
      distance_km: distanceKm,
      eta_minutes: request.eta_minutes ?? null,
      created_at: request.created_at,
      address: request.address,
      status: request.status,
      user_id: request.user_id?._id ? request.user_id._id.toString() : request.user_id?.toString(),
    };
  }

  private mapCustomer(userIdObj: any) {
    return {
      full_name: userIdObj?.full_name || 'Khách hàng',
      phone: userIdObj?.phone || '',
    };
  }
}

export default new CompanyRescueRequestService();
