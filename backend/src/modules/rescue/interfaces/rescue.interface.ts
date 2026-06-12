/**
 * Rescue Module – Public Contracts (Interfaces)
 *
 * Module rescue là core business của hệ thống cuuho247.
 * Có 2 perspectives:
 *  - Company: Nhận và xử lý các yêu cầu cứu hộ
 *  - Customer: Tạo, theo dõi và hủy yêu cầu cứu hộ
 */
import type { IAddress, IGeoPoint } from '@/shared/models/shared';
import type {
  ICancellation,
  IPayment,
  PaymentMethod,
  IRescueRequest,
  CancelledBy,
  ChangedBy,
  RequestStatus,
} from '@/shared/models/RescueRequest.model';

// ─── Shared Result Types ───────────────────────────────────────────────────────

export interface CustomerInfo {
  full_name: string;
  phone: string;
}

export interface RescueVehicleInfo {
  vehicle_type: string;
  plate_number: string;
}

export interface PendingRescueRequestResult {
  _id: string;
  title: string;
  description: string;
  distance_km: number | null;
  eta_minutes?: number | null;
  created_at?: Date;
  address?: Partial<IAddress>;
  status?: string;
  user_id?: string;
}

export interface PendingRescueRequestDetailResult extends PendingRescueRequestResult {
  customer: CustomerInfo;
  incident_photos: string[];
  location?: IGeoPoint;
}

export interface ActiveRescueRequestResult extends PendingRescueRequestResult {
  vehicle: RescueVehicleInfo;
  accepted_at?: Date;
  completed_at?: Date;
  cancelled_at?: Date;
  cancellation?: ICancellation;
  payment?: IPayment;
}

export interface ActiveRescueRequestDetailResult extends ActiveRescueRequestResult {
  customer: CustomerInfo;
}

export interface CompletedRescueRequestResult extends ActiveRescueRequestResult {
  completed_at?: Date;
  payment?: IPayment;
}

export interface CompletedRescueRequestDetailResult extends CompletedRescueRequestResult {
  customer: CustomerInfo;
}

export interface CanceledRescueRequestResult extends ActiveRescueRequestResult {
  cancelled_at?: Date;
  cancellation?: ICancellation;
}

export interface CanceledRescueRequestDetailResult extends CanceledRescueRequestResult {
  customer: CustomerInfo;
}

export interface RouteEstimateResult {
  distance_km: number | null;
  eta_minutes: number | null;
  origin: { lat: number; lng: number } | null;
}

// ─── Input DTOs ────────────────────────────────────────────────────────────────

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
  address: Partial<IAddress>;
  location: IGeoPoint;
  distance_km: number;
  rating_avg: number;
  rating_count: number;
  status: string;
  service_names: string[];
  min_price: number | null;
  max_price: number | null;
}

export interface CreateRequestData {
  user_id: string;
  company_id: string;
  description: string;
  location: { lat: number; lng: number };
  address?: string;
  service_types?: string[];
  incident_photos?: string[];
}

// ─── Service Contracts ─────────────────────────────────────────────────────────

/**
 * IRescueCompanyService: Contract cho phía Công ty Cứu hộ.
 */
export interface IRescueCompanyService {
  getPendingRequestsForCompany(companyId: string): Promise<PendingRescueRequestResult[]>;
  getPendingRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<PendingRescueRequestDetailResult | null>;
  getActiveRequestsForCompany(companyId: string): Promise<ActiveRescueRequestResult[]>;
  getActiveRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<ActiveRescueRequestDetailResult | null>;
  acceptPendingRequestForCompany(
    companyId: string,
    requestId: string,
    data: AcceptRescueRequestData
  ): Promise<ActiveRescueRequestDetailResult | null>;
  startActiveRequestForCompany(companyId: string, requestId: string): Promise<ActiveRescueRequestDetailResult | null>;
  arriveActiveRequestForCompany(companyId: string, requestId: string): Promise<ActiveRescueRequestDetailResult | null>;
  completeActiveRequestForCompany(
    companyId: string,
    requestId: string,
    data: CompleteRescueRequestData
  ): Promise<CompletedRescueRequestDetailResult | null>;
  getCompletedRequestsForCompany(companyId: string): Promise<CompletedRescueRequestResult[]>;
  getCompletedRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<CompletedRescueRequestDetailResult | null>;
  getCanceledRequestsForCompany(companyId: string): Promise<CanceledRescueRequestResult[]>;
  getCanceledRequestDetailForCompany(
    companyId: string,
    requestId: string
  ): Promise<CanceledRescueRequestDetailResult | null>;
  estimateRequestRouteForCompany(
    companyId: string,
    requestId: string,
    origin?: { lat: number; lng: number }
  ): Promise<RouteEstimateResult | null>;
  searchNearbyCompanies(params: SearchParams): Promise<CompanyResult[]>;
}

/**
 * IRescueCustomerService: Contract cho phía Khách hàng.
 */
export interface IRescueCustomerService {
  getRequestsForUser(userId: string): Promise<IRescueRequest[]>;
  createRescueRequest(data: CreateRequestData): Promise<IRescueRequest>;
  cancelRequest(requestId: string, userId: string, reason: string): Promise<IRescueRequest>;
}

/**
 * IRescueRepository: Contract truy cập dữ liệu của module Rescue.
 */
export interface IRescueRepository {
  create(data: Partial<IRescueRequest>): Promise<IRescueRequest>;
  findById(id: string): Promise<IRescueRequest | null>;
  findByUserId(userId: string): Promise<IRescueRequest[]>;
  updateStatus(
    id: string,
    status: RequestStatus,
    changedBy: ChangedBy,
    note?: string,
    cancellation?: { cancelled_by?: CancelledBy; reason?: string }
  ): Promise<IRescueRequest | null>;
  cancelById(id: string, cancelledBy: CancelledBy, reason: string): Promise<IRescueRequest | null>;
  findPendingRequestsByCompany(companyId: string): Promise<any[]>;
  findActiveRequestsByCompany(companyId: string): Promise<any[]>;
  findCompletedRequestsByCompany(companyId: string): Promise<any[]>;
  findCanceledRequestsByCompany(companyId: string): Promise<any[]>;
  findDetail(companyId: string, requestId: string, statusFilter: string | string[]): Promise<any | null>;
  acceptPendingRequest(
    companyId: string,
    requestId: string,
    vehicleId: string,
    plateNumber: string,
    etaMinutes: number,
    note?: string
  ): Promise<any | null>;
  startActiveRequest(companyId: string, requestId: string): Promise<any | null>;
  arriveActiveRequest(companyId: string, requestId: string): Promise<any | null>;
  completeActiveRequest(
    companyId: string,
    requestId: string,
    amount: number,
    method?: string,
    note?: string
  ): Promise<any | null>;
  findActiveRequestByVehicle(vehicleId: string): Promise<any | null>;
}
