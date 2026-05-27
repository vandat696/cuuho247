import type { ICancellation, IPayment, PaymentMethod } from '@/models/RescueRequest.model';
import type { IAddress, IGeoPoint } from '@/models/shared';

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
  eta_minutes: number | null;
}

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
}

export interface PendingRescueRequestDetailResult extends PendingRescueRequestResult {
  customer: CustomerInfo;
  incident_photos: string[];
  location?: IGeoPoint;
}

export interface ActiveRescueRequestResult extends PendingRescueRequestResult {
  vehicle: RescueVehicleInfo;
  accepted_at?: Date;
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
