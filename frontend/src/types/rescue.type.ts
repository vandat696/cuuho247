// ─── Incident Types ────────────────────────────────────────────────────────────

export interface IncidentType {
  label: string;
  slug: string;
}

export const INCIDENT_TYPES: IncidentType[] = [
  { label: 'Xe chết máy', slug: 'xe-chet-may' },
  { label: 'Hết bình ắc quy', slug: 'het-binh-ac-quy' },
  { label: 'Thủng lốp / nổ lốp', slug: 'thung-lop-no-lop' },
  { label: 'Hết nhiên liệu', slug: 'het-nhien-lieu' },
  { label: 'Xe không khởi động được', slug: 'xe-khong-khoi-dong' },
  { label: 'Tai nạn giao thông', slug: 'tai-nan-giao-thong' },
  { label: 'Xe bị sa lầy', slug: 'xe-bi-sa-lay' },
  { label: 'Xe bị khóa vô lăng', slug: 'xe-bi-khoa-vo-lang' },
  { label: 'Quên chìa khóa trong xe', slug: 'quen-chia-khoa-trong-xe' },
  { label: 'Mất chìa khóa xe', slug: 'mat-chia-khoa-xe' },
  { label: 'Động cơ quá nhiệt', slug: 'dong-co-qua-nhiet' },
  { label: 'Hỏng phanh', slug: 'hong-phanh' },
  { label: 'Hỏng côn', slug: 'hong-con' },
  { label: 'Hỏng hộp số', slug: 'hong-hop-so' },
  { label: 'Xe bị ngập nước', slug: 'xe-bi-ngap-nuoc' },
  { label: 'Xe phát ra tiếng động lạ', slug: 'xe-phat-tieng-dong-la' },
  { label: 'Đèn cảnh báo động cơ bật sáng', slug: 'den-canh-bao-dong-co' },
  { label: 'Xe bị nghiêng/lật', slug: 'xe-bi-nghieng-lat' },
  { label: 'Cần kéo xe về garage', slug: 'keo-xe-ve-garage' },
  { label: 'Sự cố khác', slug: 'su-co-khac' },
];

// ─── Request Status ────────────────────────────────────────────────────────────

export type RequestStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'rejected' | 'timeout';
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
  eta_minutes: number | null;
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
  };
  results: SearchCompaniesResult;
}
