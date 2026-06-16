export interface UpdateCompanyProfileInput {
  company_name?: string;
  director_name?: string;
  phone?: string;
  address?: {
    province?: string;
    district?: string;
    ward?: string;
    detail?: string;
  };
  location?: {
    coordinates: [number, number];
  };
  license_url?: string;
}
