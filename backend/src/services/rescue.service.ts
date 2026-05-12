import { Company } from '../models/Company.model';
import { Service } from '../models/Service.model';
import { ServiceCategory } from '../models/ServiceCategory.model';
import { ApiError } from '../utils/apiError.util';

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

class RescueService {
  async searchNearbyCompanies(params: SearchParams): Promise<CompanyResult[]> {
    const { lat, lng, incident_type, max_distance_km = 50 } = params;

    // Resolve category _id from slug if incident_type provided
    let categoryId: string | null = null;
    if (incident_type) {
      const category = await ServiceCategory.findOne({
        slug: incident_type,
        is_active: { $ne: false },
      }).lean();
      if (!category) {
        // Return empty list if category not found (not an error)
        return [];
      }
      categoryId = category._id.toString();
    }

    // Find companies within max_distance using 2dsphere index
    const geoQuery: any = {
      status: 'active',
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat], // GeoJSON: [longitude, latitude]
          },
          $maxDistance: max_distance_km * 1000, // metres
        },
      },
    };

    const companies = await Company.find(geoQuery).select('-password_hash').limit(20).lean();

    if (companies.length === 0) {
      return [];
    }

    // If incident_type provided, filter to companies that have matching services
    let filteredCompanies = companies;
    if (categoryId) {
      const companyIds = companies.map((c) => c._id.toString());
      const matchingServices = await Service.find({
        company_id: { $in: companyIds },
        category_id: categoryId,
        is_active: { $ne: false },
      })
        .select('company_id name')
        .lean();

      const companyIdsWithService = new Set(matchingServices.map((s) => s.company_id.toString()));

      filteredCompanies = companies.filter((c) => companyIdsWithService.has(c._id.toString()));

      // Attach service names per company
      const servicesByCompany = new Map<string, string[]>();
      for (const svc of matchingServices) {
        const cid = svc.company_id.toString();
        if (!servicesByCompany.has(cid)) servicesByCompany.set(cid, []);
        servicesByCompany.get(cid)!.push(svc.name);
      }

      return filteredCompanies.map((company) => {
        const coords = company.location?.coordinates ?? [0, 0];
        const distanceKm = this.calcDistanceKm(lat, lng, coords[1], coords[0]);
        return {
          _id: company._id.toString(),
          company_name: company.company_name,
          phone: company.phone,
          address: company.address ?? {},
          location: company.location,
          distance_km: Math.round(distanceKm * 10) / 10,
          rating_avg: company.rating_avg ?? 0,
          rating_count: company.rating_count ?? 0,
          status: company.status ?? 'active',
          service_names: servicesByCompany.get(company._id.toString()) ?? [],
        };
      });
    }

    // No incident_type filter – return all nearby companies with any services
    const allCompanyIds = companies.map((c) => c._id.toString());
    const allServices = await Service.find({
      company_id: { $in: allCompanyIds },
      is_active: { $ne: false },
    })
      .select('company_id name')
      .lean();

    const servicesByCompany = new Map<string, string[]>();
    for (const svc of allServices) {
      const cid = svc.company_id.toString();
      if (!servicesByCompany.has(cid)) servicesByCompany.set(cid, []);
      servicesByCompany.get(cid)!.push(svc.name);
    }

    return companies.map((company) => {
      const coords = company.location?.coordinates ?? [0, 0];
      const distanceKm = this.calcDistanceKm(lat, lng, coords[1], coords[0]);
      return {
        _id: company._id.toString(),
        company_name: company.company_name,
        phone: company.phone,
        address: company.address ?? {},
        location: company.location,
        distance_km: Math.round(distanceKm * 10) / 10,
        rating_avg: company.rating_avg ?? 0,
        rating_count: company.rating_count ?? 0,
        status: company.status ?? 'active',
        service_names: servicesByCompany.get(company._id.toString()) ?? [],
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
}

export default new RescueService();
