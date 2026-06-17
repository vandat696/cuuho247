import { http } from './http';
import { ApiResponse } from '../types/common.type';
import {
  ActiveRescueRequestDetailResult,
  ActiveRescueRequestsResult,
  AcceptPendingRescueRequestPayload,
  CanceledRescueRequestDetailResult,
  CanceledRescueRequestsResult,
  CompleteActiveRescueRequestPayload,
  CompletedRescueRequestDetailResult,
  CompletedRescueRequestsResult,
  PendingRescueRequestDetailResult,
  PendingRescueRequestsResult,
} from '../types/rescue.type';

export const companyRescueService = {
  getCompanyPendingRequests: async (): Promise<ApiResponse<PendingRescueRequestsResult>> => {
    const response = await http.get<ApiResponse<PendingRescueRequestsResult>>('/rescue/company/pending');
    return response.data;
  },

  getCompanyActiveRequests: async (): Promise<ApiResponse<ActiveRescueRequestsResult>> => {
    const response = await http.get<ApiResponse<ActiveRescueRequestsResult>>('/rescue/company/active');
    return response.data;
  },

  getCompanyActiveRequestDetail: async (requestId: string): Promise<ApiResponse<ActiveRescueRequestDetailResult>> => {
    const response = await http.get<ApiResponse<ActiveRescueRequestDetailResult>>(
      `/rescue/company/active/${requestId}`
    );
    return response.data;
  },

  getCompanyCompletedRequests: async (): Promise<ApiResponse<CompletedRescueRequestsResult>> => {
    const response = await http.get<ApiResponse<CompletedRescueRequestsResult>>('/rescue/company/completed');
    return response.data;
  },

  getCompanyCompletedRequestDetail: async (
    requestId: string
  ): Promise<ApiResponse<CompletedRescueRequestDetailResult>> => {
    const response = await http.get<ApiResponse<CompletedRescueRequestDetailResult>>(
      `/rescue/company/completed/${requestId}`
    );
    return response.data;
  },

  getCompanyCanceledRequests: async (): Promise<ApiResponse<CanceledRescueRequestsResult>> => {
    const response = await http.get<ApiResponse<CanceledRescueRequestsResult>>('/rescue/company/canceled');
    return response.data;
  },

  getCompanyCanceledRequestDetail: async (
    requestId: string
  ): Promise<ApiResponse<CanceledRescueRequestDetailResult>> => {
    const response = await http.get<ApiResponse<CanceledRescueRequestDetailResult>>(
      `/rescue/company/canceled/${requestId}`
    );
    return response.data;
  },

  getCompanyPendingRequestDetail: async (requestId: string): Promise<ApiResponse<PendingRescueRequestDetailResult>> => {
    const response = await http.get<ApiResponse<PendingRescueRequestDetailResult>>(
      `/rescue/company/pending/${requestId}`
    );
    return response.data;
  },

  acceptCompanyPendingRequest: async (
    requestId: string,
    payload: AcceptPendingRescueRequestPayload
  ): Promise<ApiResponse<ActiveRescueRequestDetailResult>> => {
    const response = await http.patch<ApiResponse<ActiveRescueRequestDetailResult>>(
      `/rescue/company/pending/${requestId}/accept`,
      payload
    );
    return response.data;
  },

  rejectCompanyPendingRequest: async (
    requestId: string,
    payload: { reason: string }
  ): Promise<ApiResponse<PendingRescueRequestDetailResult>> => {
    const response = await http.patch<ApiResponse<PendingRescueRequestDetailResult>>(
      `/rescue/company/pending/${requestId}/reject`,
      payload
    );
    return response.data;
  },

  completeCompanyActiveRequest: async (
    requestId: string,
    payload: CompleteActiveRescueRequestPayload
  ): Promise<ApiResponse<CompletedRescueRequestDetailResult>> => {
    const response = await http.patch<ApiResponse<CompletedRescueRequestDetailResult>>(
      `/rescue/company/active/${requestId}/complete`,
      payload
    );
    return response.data;
  },

  startCompanyActiveRequest: async (requestId: string): Promise<ApiResponse<ActiveRescueRequestDetailResult>> => {
    const response = await http.patch<ApiResponse<ActiveRescueRequestDetailResult>>(
      `/rescue/company/active/${requestId}/start`
    );
    return response.data;
  },

  arriveCompanyActiveRequest: async (requestId: string): Promise<ApiResponse<ActiveRescueRequestDetailResult>> => {
    const response = await http.patch<ApiResponse<ActiveRescueRequestDetailResult>>(
      `/rescue/company/active/${requestId}/arrive`
    );
    return response.data;
  },
};
