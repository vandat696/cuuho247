import companyRepository from '../repositories/company.repository';
import serviceRepository from '../repositories/service.repository';
import serviceCategoryRepository from '../repositories/serviceCategory.repository';

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
}

export default new RescueService();
