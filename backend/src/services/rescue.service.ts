import companyRepository from '../repositories/company.repository';
import serviceRepository from '../repositories/service.repository';
import serviceCategoryRepository from '../repositories/serviceCategory.repository';
import { RescueRequest } from '../models/RescueRequest.model';
import { isValidObjectId } from 'mongoose';

export interface SearchParams {
  lat: number;
  lng: number;
  incident_type?: string; // slug of ServiceCategory
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
      const requestCoords = request.location?.coordinates;
      const serviceName = request.service_types?.[0]?.name;
      const title = serviceName || this.getTitleFromDescription(request.description);

      let distanceKm: number | null = null;
      if (companyCoords && requestCoords) {
        distanceKm =
          Math.round(this.calcDistanceKm(companyCoords[1], companyCoords[0], requestCoords[1], requestCoords[0]) * 10) /
          10;
      }

      return {
        _id: request._id.toString(),
        title,
        description: request.description,
        distance_km: distanceKm,
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
    const companyCoords = company?.location?.coordinates;

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

    const requestCoords = request.location?.coordinates;
    const serviceName = request.service_types?.[0]?.name;
    const title = serviceName || this.getTitleFromDescription(request.description);

    let distanceKm: number | null = null;
    if (companyCoords && requestCoords) {
      distanceKm =
        Math.round(this.calcDistanceKm(companyCoords[1], companyCoords[0], requestCoords[1], requestCoords[0]) * 10) /
        10;
    }

    return {
      _id: request._id.toString(),
      title,
      description: request.description,
      distance_km: distanceKm,
      created_at: request.created_at,
      address: request.address,
      status: request.status,
      customer: {
        full_name: request.user_id?.full_name || 'Khách hàng',
        phone: request.user_id?.phone || '',
      },
      incident_photos: request.incident_photos || [],
      location: request.location,
    };
  }

  async searchNearbyCompanies(params: SearchParams): Promise<CompanyResult[]> {
    const { lat, lng, incident_type, max_distance_km = 50 } = params;

    // Resolve category _id from slug if incident_type provided
    let categoryId: string | undefined = undefined;
    if (incident_type) {
      const category = await serviceCategoryRepository.findBySlug(incident_type);
      if (!category) {
        // Return empty list if category not found (not an error)
        return [];
      }
      categoryId = category._id.toString();
    }

    // Find companies within max_distance
    const companies = await companyRepository.findNearby(lng, lat, max_distance_km);

    if (companies.length === 0) {
      return [];
    }

    const companyIds = companies.map((c) => (c._id as any).toString());
    const matchingServices = await serviceRepository.findByCompanyIdsAndCategory(companyIds, categoryId);

    // Group services by company
    const servicesByCompany = new Map<string, string[]>();
    for (const svc of matchingServices) {
      const cid = svc.company_id.toString();
      if (!servicesByCompany.has(cid)) servicesByCompany.set(cid, []);
      servicesByCompany.get(cid)!.push(svc.name);
    }

    // If categoryId was provided, only include companies that actually have that service
    let resultCompanies = companies;
    if (categoryId) {
      resultCompanies = companies.filter((c) => servicesByCompany.has((c._id as any).toString()));
    }

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

  /** Haversine distance in km */
  private calcDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 + Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number) {
    return (deg * Math.PI) / 180;
  }

  private getTitleFromDescription(description?: string): string {
    if (!description) return 'Sự cố cứu hộ';
    return description.split(/[,.]/)[0].trim() || 'Sự cố cứu hộ';
  }
}

export default new RescueService();
