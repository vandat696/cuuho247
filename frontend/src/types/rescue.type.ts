// ─── Incident Types ────────────────────────────────────────────────────────────

export interface IncidentType {
  label: string;
  slug: string;
  category?: string;
  icon?: string;
}

export const INCIDENT_TYPES: readonly IncidentType[] = [
  {
    slug: 'su-co-lop-xe',
    label: 'Lốp xe gặp sự cố',
    category: 'va-vo-va-lop-xe',
    icon: 'tire',
  },

  {
    slug: 'het-binh-ac-quy',
    label: 'Hết bình ắc quy',
    category: 'kich-binh-sac-ac-quy',
    icon: 'battery',
  },

  {
    slug: 'het-nhien-lieu',
    label: 'Hết nhiên liệu',
    category: 'tiep-nhien-lieu',
    icon: 'fuel',
  },

  {
    slug: 'xe-khong-khoi-dong',
    label: 'Xe không khởi động được',
    category: 'sua-chua-dong-co-luu-dong',
    icon: 'car-off',
  },

  {
    slug: 'xe-chet-may',
    label: 'Xe bị chết máy giữa đường',
    category: 'sua-chua-dong-co-luu-dong',
    icon: 'engine',
  },

  {
    slug: 'xe-gap-su-co-ky-thuat',
    label: 'Xe có dấu hiệu hỏng hóc',
    category: 'sua-chua-dong-co-luu-dong',
    icon: 'wrench',
  },

  {
    slug: 'tai-nan-giao-thong',
    label: 'Tai nạn giao thông',
    category: 'cau-keo-xe-o-to',
    icon: 'alert-triangle',
  },

  {
    slug: 'xe-bi-sa-lay',
    label: 'Xe bị sa lầy hoặc mắc kẹt',
    category: 'cau-keo-xe-o-to',
    icon: 'truck',
  },

  {
    slug: 'xe-bi-ngap-nuoc',
    label: 'Xe bị ngập nước',
    category: 'cau-keo-xe-o-to',
    icon: 'waves',
  },

  {
    slug: 'su-co-khoa-xe',
    label: 'Không mở được xe',
    category: 'cuu-ho-khoa-xe',
    icon: 'key',
  },

  {
    slug: 'khac',
    label: 'Sự cố khác',
    category: 'sua-chua-dong-co-luu-dong',
    icon: 'help-circle',
  },
] as const;

// ─── Request Status ────────────────────────────────────────────────────────────

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'arrived'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'timeout';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'e_wallet';

// ─── Form Data ─────────────────────────────────────────────────────────────────

export interface RescueLocation {
  lat: number;
  lng: number;
  address: string; // human-readable address
  placeId?: string;
}

export interface RescueFormData {
  incident_type: IncidentType | null;
  description: string;
  images: File[];
  location: RescueLocation | null;
}

export interface RescueFormErrors {
  incident_type?: string;
  description?: string;
  location?: string;
  images?: string;
}

// ─── Company Result ────────────────────────────────────────────────────────────

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
}

// ─── Search Params & Result ────────────────────────────────────────────────────

export interface SearchCompaniesParams {
  lat: number;
  lng: number;
  incident_type?: string;
  max_distance_km?: number;
}

export interface SearchCompaniesResult {
  total: number;
  companies: CompanyResult[];
}

export interface PendingRescueRequest {
  _id: string;
  title: string;
  description: string;
  distance_km: number | null;
  eta_minutes?: number | null;
  created_at?: string;
  status?: string;
  address?: Record<string, unknown>;
}

export interface PendingRescueRequestsResult {
  total: number;
  requests: PendingRescueRequest[];
}

export interface PendingRescueRequestDetail extends PendingRescueRequest {
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

export interface PendingRescueRequestDetailResult {
  request: PendingRescueRequestDetail;
}

export interface ActiveRescueRequest extends PendingRescueRequest {
  vehicle: {
    vehicle_type: string;
    plate_number: string;
  };
  accepted_at?: string;
}

export interface AcceptPendingRescueRequestPayload {
  vehicle_id: string;
  eta_minutes: number;
  note?: string;
}

export interface RequestPayment {
  amount?: number;
  method?: PaymentMethod;
  paid_at?: string;
}

export interface CompleteActiveRescueRequestPayload {
  amount: number;
  method?: PaymentMethod;
  note?: string;
}

export interface ActiveRescueRequestsResult {
  total: number;
  requests: ActiveRescueRequest[];
}

export interface ActiveRescueRequestDetail extends ActiveRescueRequest {
  customer: {
    full_name: string;
    phone: string;
  };
}

export interface ActiveRescueRequestDetailResult {
  request: ActiveRescueRequestDetail;
}

export interface CompletedRescueRequest extends ActiveRescueRequest {
  completed_at?: string;
  payment?: RequestPayment;
}

export interface CompletedRescueRequestsResult {
  total: number;
  requests: CompletedRescueRequest[];
}

export interface CompletedRescueRequestDetail extends CompletedRescueRequest {
  customer: {
    full_name: string;
    phone: string;
  };
}

export interface CompletedRescueRequestDetailResult {
  request: CompletedRescueRequestDetail;
}

export interface CanceledRescueRequest extends ActiveRescueRequest {
  cancelled_at?: string;
  cancellation?: {
    cancelled_by?: string;
    reason?: string;
  };
}

export interface CanceledRescueRequestsResult {
  total: number;
  requests: CanceledRescueRequest[];
}

export interface CanceledRescueRequestDetail extends CanceledRescueRequest {
  customer: {
    full_name: string;
    phone: string;
  };
}

export interface CanceledRescueRequestDetailResult {
  request: CanceledRescueRequestDetail;
}

// ─── Navigation State (passed to results page) ────────────────────────────────

export interface RescueSearchState {
  formData: {
    incident_type_label: string;
    description: string;
    location: RescueLocation | null;
    locationManual: string;
    images?: File[];
  };
  results: SearchCompaniesResult;
}
