import { Types } from 'mongoose';
import companyRescueRequestService from '@/modules/rescue/company.service';
import rescueRepository from '@/modules/rescue/rescue.repository';
import companyRepository from '@/modules/company/company.repository';
import { vehicleRepository } from '@/modules/vehicle/vehicle.repository';
import { serviceRepository, serviceCategoryRepository } from '@/modules/service-catalog/service-catalog.repository';
import { getDistanceFromCoordinates, estimateEtaMinutes, calcDistanceKm } from '@/shared/utils/geo.util';
import { mapIncidentTypeToCategory } from '@/shared/constants/incidentMapping';
import { NotFoundError, BadRequestError } from '@/shared/utils/apiError.util';

// ─── Mock tất cả external dependencies ───────────────────────────────────────
jest.mock('@/modules/rescue/rescue.repository');
jest.mock('@/modules/company/company.repository');
jest.mock('@/modules/vehicle/vehicle.repository');
jest.mock('@/modules/service-catalog/service-catalog.repository', () => ({
  serviceRepository: {
    findByCompanyIdsAndCategory: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByCompanyId: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  },
  serviceCategoryRepository: {
    findBySlug: jest.fn(),
    findBySlugs: jest.fn(),
    findAllActive: jest.fn(),
  },
}));
jest.mock('@/shared/utils/geo.util');
jest.mock('@/shared/constants/incidentMapping');

// ─────────────────────────────────────────────────────────────────────────────

/** Tạo mock request dùng chung */
const makeRequest = (overrides: Record<string, any> = {}) => ({
  _id: new Types.ObjectId().toString(),
  description: 'Test rescue',
  status: 'accepted',
  eta_minutes: 15,
  created_at: new Date(),
  accepted_at: new Date(),
  completed_at: null,
  cancelled_at: null,
  cancellation: null,
  address: { detail: 'Hanoi' },
  payment: null,
  user_id: { _id: new Types.ObjectId(), full_name: 'Nguyen Van A', phone: '0987654321' },
  vehicle: { vehicle_id: new Types.ObjectId(), plate_number: '29A-12345' },
  service_types: [],
  incident_type: null,
  ...overrides,
});

describe('CompanyRescueRequestService - Unit Tests', () => {
  const companyId = new Types.ObjectId().toString();
  const requestId = new Types.ObjectId().toString();
  const vehicleId = new Types.ObjectId().toString();

  const mockVehicleAvailable = {
    _id: vehicleId,
    company_id: companyId,
    status: 'available',
    plate_number: '29A-12345',
    vehicle_type: 'Xe cẩu',
  };

  const mockCompany = {
    _id: companyId,
    company_name: 'Fast Rescue Co.',
    location: { type: 'Point', coordinates: [105.804817, 21.028511] },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // getPendingRequestsForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('getPendingRequestsForCompany', () => {
    it('TC-1.1 | should return list of pending requests with distance calculated', async () => {
      const mockRequest = makeRequest({ status: 'pending', location: { type: 'Point', coordinates: [105.85, 21.05] } });
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.findPendingRequestsByCompany as jest.Mock).mockResolvedValue([mockRequest]);
      (getDistanceFromCoordinates as jest.Mock).mockReturnValue(3.2);

      const result = await companyRescueRequestService.getPendingRequestsForCompany(companyId);

      expect(rescueRepository.findPendingRequestsByCompany).toHaveBeenCalledWith(companyId);
      expect(getDistanceFromCoordinates).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].distance_km).toBe(3.2);
    });

    it('TC-1.2 | should return empty list when no pending requests exist', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.findPendingRequestsByCompany as jest.Mock).mockResolvedValue([]);

      const result = await companyRescueRequestService.getPendingRequestsForCompany(companyId);

      expect(result).toEqual([]);
    });

    it('TC-1.3 | should handle missing company location gracefully', async () => {
      const companyNoLocation = { _id: companyId, company_name: 'No Loc Co.', location: null };
      (companyRepository.findById as jest.Mock).mockResolvedValue(companyNoLocation);
      (rescueRepository.findPendingRequestsByCompany as jest.Mock).mockResolvedValue([makeRequest()]);
      (getDistanceFromCoordinates as jest.Mock).mockReturnValue(null);

      const result = await companyRescueRequestService.getPendingRequestsForCompany(companyId);

      expect(result[0].distance_km).toBeNull();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // getPendingRequestDetailForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('getPendingRequestDetailForCompany', () => {
    it('TC-2.1 | should return null if request not found', async () => {
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(null);

      const result = await companyRescueRequestService.getPendingRequestDetailForCompany(companyId, requestId);

      expect(result).toBeNull();
      expect(rescueRepository.findDetail).toHaveBeenCalledWith(companyId, requestId, 'pending');
    });

    it('TC-2.2 | should return full detail with customer info and photos', async () => {
      const mockRequest = makeRequest({
        status: 'pending',
        incident_photos: ['img1.jpg'],
        location: { type: 'Point', coordinates: [105.85, 21.05] },
      });
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(mockRequest);
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (getDistanceFromCoordinates as jest.Mock).mockReturnValue(2.0);
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);

      const result = await companyRescueRequestService.getPendingRequestDetailForCompany(companyId, requestId);

      expect(result).not.toBeNull();
      expect(result!.customer).toBeDefined();
      expect(result!.incident_photos).toEqual(['img1.jpg']);
      expect(result!.location).toBeDefined();
    });

    it('TC-2.3 | should return empty photos array when none exist', async () => {
      const mockRequest = makeRequest({ status: 'pending', incident_photos: undefined, location: {} });
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(mockRequest);
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (getDistanceFromCoordinates as jest.Mock).mockReturnValue(1.0);
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(null);

      const result = await companyRescueRequestService.getPendingRequestDetailForCompany(companyId, requestId);

      expect(result!.incident_photos).toEqual([]);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // getActiveRequestsForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('getActiveRequestsForCompany', () => {
    it('TC-3.1 | should return list of active requests', async () => {
      (rescueRepository.findActiveRequestsByCompany as jest.Mock).mockResolvedValue([makeRequest()]);
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);

      const result = await companyRescueRequestService.getActiveRequestsForCompany(companyId);

      expect(rescueRepository.findActiveRequestsByCompany).toHaveBeenCalledWith(companyId);
      expect(result).toHaveLength(1);
    });

    it('TC-3.2 | should return empty array when no active requests', async () => {
      (rescueRepository.findActiveRequestsByCompany as jest.Mock).mockResolvedValue([]);

      const result = await companyRescueRequestService.getActiveRequestsForCompany(companyId);

      expect(result).toEqual([]);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // getActiveRequestDetailForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('getActiveRequestDetailForCompany', () => {
    it('TC-4.1 | should return null if active request not found', async () => {
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(null);

      const result = await companyRescueRequestService.getActiveRequestDetailForCompany(companyId, requestId);

      expect(result).toBeNull();
      expect(rescueRepository.findDetail).toHaveBeenCalledWith(companyId, requestId, [
        'accepted',
        'in_progress',
        'arrived',
      ]);
    });

    it('TC-4.2 | should return detail with customer info', async () => {
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(makeRequest());
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);

      const result = await companyRescueRequestService.getActiveRequestDetailForCompany(companyId, requestId);

      expect(result).not.toBeNull();
      expect(result!.customer).toBeDefined();
      expect(result!.customer.full_name).toBe('Nguyen Van A');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // acceptPendingRequestForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('acceptPendingRequestForCompany', () => {
    const acceptData = { vehicle_id: vehicleId, eta_minutes: 15, note: 'On the way' };

    it('TC-5.1 | should return null if requestId is not a valid ObjectId', async () => {
      const result = await companyRescueRequestService.acceptPendingRequestForCompany(
        companyId,
        'invalid-id',
        acceptData
      );
      expect(result).toBeNull();
    });

    it('TC-5.2 | should return null if vehicleId is not a valid ObjectId', async () => {
      const result = await companyRescueRequestService.acceptPendingRequestForCompany(companyId, requestId, {
        ...acceptData,
        vehicle_id: 'bad-id',
      });
      expect(result).toBeNull();
    });

    it('TC-5.3 | should throw NotFoundError if vehicle does not exist', async () => {
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        companyRescueRequestService.acceptPendingRequestForCompany(companyId, requestId, acceptData)
      ).rejects.toThrow(NotFoundError);
    });

    it('TC-5.4 | should throw NotFoundError if vehicle belongs to different company', async () => {
      (vehicleRepository.findById as jest.Mock).mockResolvedValue({
        ...mockVehicleAvailable,
        company_id: new Types.ObjectId().toString(), // khác companyId
      });

      await expect(
        companyRescueRequestService.acceptPendingRequestForCompany(companyId, requestId, acceptData)
      ).rejects.toThrow(NotFoundError);
    });

    it('TC-5.5 | should throw BadRequestError if vehicle is unavailable', async () => {
      (vehicleRepository.findById as jest.Mock).mockResolvedValue({
        ...mockVehicleAvailable,
        status: 'unavailable',
      });

      await expect(
        companyRescueRequestService.acceptPendingRequestForCompany(companyId, requestId, acceptData)
      ).rejects.toThrow(BadRequestError);
    });

    it('TC-5.6 | should return null if rescueRepository.acceptPendingRequest returns null', async () => {
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);
      (rescueRepository.acceptPendingRequest as jest.Mock).mockResolvedValue(null); // đơn đã bị nhận bởi công ty khác

      const result = await companyRescueRequestService.acceptPendingRequestForCompany(companyId, requestId, acceptData);

      expect(result).toBeNull();
      expect(vehicleRepository.update).not.toHaveBeenCalled(); // xe không bị đổi trạng thái
    });

    it('TC-5.7 | should accept request and mark vehicle as unavailable', async () => {
      const mockAcceptedRequest = makeRequest({ status: 'accepted', eta_minutes: 15 });
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);
      (rescueRepository.acceptPendingRequest as jest.Mock).mockResolvedValue(mockAcceptedRequest);
      (vehicleRepository.update as jest.Mock).mockResolvedValue(true);

      const result = await companyRescueRequestService.acceptPendingRequestForCompany(companyId, requestId, acceptData);

      expect(rescueRepository.acceptPendingRequest).toHaveBeenCalledWith(
        companyId,
        requestId,
        vehicleId,
        '29A-12345',
        'Xe cẩu',
        15,
        'On the way'
      );
      expect(vehicleRepository.update).toHaveBeenCalledWith(vehicleId, { status: 'unavailable' });
      expect(result).not.toBeNull();
      expect(result!.status).toBe('accepted');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // startActiveRequestForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('startActiveRequestForCompany', () => {
    it('TC-6.1 | should return null for invalid requestId', async () => {
      const result = await companyRescueRequestService.startActiveRequestForCompany(companyId, 'bad-id');
      expect(result).toBeNull();
    });

    it('TC-6.2 | should return null if request not found or wrong status', async () => {
      (rescueRepository.startActiveRequest as jest.Mock).mockResolvedValue(null);

      const result = await companyRescueRequestService.startActiveRequestForCompany(companyId, requestId);

      expect(result).toBeNull();
    });

    it('TC-6.3 | should start request and return updated data', async () => {
      const mockStarted = makeRequest({ status: 'in_progress' });
      (rescueRepository.startActiveRequest as jest.Mock).mockResolvedValue(mockStarted);
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);

      const result = await companyRescueRequestService.startActiveRequestForCompany(companyId, requestId);

      expect(rescueRepository.startActiveRequest).toHaveBeenCalledWith(companyId, requestId);
      expect(result).not.toBeNull();
      expect(result!.status).toBe('in_progress');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // arriveActiveRequestForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('arriveActiveRequestForCompany', () => {
    it('TC-7.1 | should return null for invalid requestId', async () => {
      const result = await companyRescueRequestService.arriveActiveRequestForCompany(companyId, 'bad-id');
      expect(result).toBeNull();
    });

    it('TC-7.2 | should return null if request not found or wrong status', async () => {
      (rescueRepository.arriveActiveRequest as jest.Mock).mockResolvedValue(null);

      const result = await companyRescueRequestService.arriveActiveRequestForCompany(companyId, requestId);

      expect(result).toBeNull();
    });

    it('TC-7.3 | should mark request as arrived and return updated data', async () => {
      const mockArrived = makeRequest({ status: 'arrived' });
      (rescueRepository.arriveActiveRequest as jest.Mock).mockResolvedValue(mockArrived);
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);

      const result = await companyRescueRequestService.arriveActiveRequestForCompany(companyId, requestId);

      expect(rescueRepository.arriveActiveRequest).toHaveBeenCalledWith(companyId, requestId);
      expect(result!.status).toBe('arrived');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // getCompletedRequestsForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('getCompletedRequestsForCompany', () => {
    it('TC-8.1 | should return list of completed requests', async () => {
      const completed = makeRequest({ status: 'completed' });
      (rescueRepository.findCompletedRequestsByCompany as jest.Mock).mockResolvedValue([completed]);
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);

      const result = await companyRescueRequestService.getCompletedRequestsForCompany(companyId);

      expect(rescueRepository.findCompletedRequestsByCompany).toHaveBeenCalledWith(companyId);
      expect(result).toHaveLength(1);
    });

    it('TC-8.2 | should return empty array when none completed', async () => {
      (rescueRepository.findCompletedRequestsByCompany as jest.Mock).mockResolvedValue([]);

      const result = await companyRescueRequestService.getCompletedRequestsForCompany(companyId);

      expect(result).toEqual([]);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // getCompletedRequestDetailForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('getCompletedRequestDetailForCompany', () => {
    it('TC-9.1 | should return null if request not found', async () => {
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(null);

      const result = await companyRescueRequestService.getCompletedRequestDetailForCompany(companyId, requestId);

      expect(result).toBeNull();
      expect(rescueRepository.findDetail).toHaveBeenCalledWith(companyId, requestId, 'completed');
    });

    it('TC-9.2 | should return detail with customer info', async () => {
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(makeRequest({ status: 'completed' }));
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);

      const result = await companyRescueRequestService.getCompletedRequestDetailForCompany(companyId, requestId);

      expect(result).not.toBeNull();
      expect(result!.customer).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // completeActiveRequestForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('completeActiveRequestForCompany', () => {
    const completeData = { amount: 500000, method: 'cash' as const, note: 'Job done' };

    it('TC-10.1 | should return null for invalid requestId', async () => {
      const result = await companyRescueRequestService.completeActiveRequestForCompany(
        companyId,
        'invalid-id',
        completeData
      );
      expect(result).toBeNull();
    });

    it('TC-10.2 | should return null if DB update fails', async () => {
      (rescueRepository.completeActiveRequest as jest.Mock).mockResolvedValue(null);

      const result = await companyRescueRequestService.completeActiveRequestForCompany(
        companyId,
        requestId,
        completeData
      );

      expect(result).toBeNull();
    });

    it('TC-10.3 | should complete request and free vehicle back to available', async () => {
      const mockCompleted = makeRequest({
        status: 'completed',
        vehicle: { vehicle_id: new Types.ObjectId(vehicleId), plate_number: '29A-12345' },
      });
      (rescueRepository.completeActiveRequest as jest.Mock).mockResolvedValue(mockCompleted);
      (vehicleRepository.update as jest.Mock).mockResolvedValue(true);
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);

      const result = await companyRescueRequestService.completeActiveRequestForCompany(
        companyId,
        requestId,
        completeData
      );

      expect(rescueRepository.completeActiveRequest).toHaveBeenCalledWith(
        companyId,
        requestId,
        500000,
        'cash',
        'Job done'
      );
      expect(vehicleRepository.update).toHaveBeenCalledWith(vehicleId, { status: 'available' });
      expect(result!.status).toBe('completed');
    });

    it('TC-10.4 | should NOT call vehicleRepository.update when request has no vehicle_id', async () => {
      const mockCompleted = makeRequest({ status: 'completed', vehicle: null }); // không có xe
      (rescueRepository.completeActiveRequest as jest.Mock).mockResolvedValue(mockCompleted);
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(null);

      await companyRescueRequestService.completeActiveRequestForCompany(companyId, requestId, completeData);

      expect(vehicleRepository.update).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // getCanceledRequestsForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('getCanceledRequestsForCompany', () => {
    it('TC-11.1 | should return list of cancelled requests', async () => {
      (rescueRepository.findCanceledRequestsByCompany as jest.Mock).mockResolvedValue([
        makeRequest({ status: 'cancelled' }),
      ]);
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);

      const result = await companyRescueRequestService.getCanceledRequestsForCompany(companyId);

      expect(rescueRepository.findCanceledRequestsByCompany).toHaveBeenCalledWith(companyId);
      expect(result).toHaveLength(1);
    });

    it('TC-11.2 | should return empty array when none cancelled', async () => {
      (rescueRepository.findCanceledRequestsByCompany as jest.Mock).mockResolvedValue([]);

      const result = await companyRescueRequestService.getCanceledRequestsForCompany(companyId);

      expect(result).toEqual([]);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // getCanceledRequestDetailForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('getCanceledRequestDetailForCompany', () => {
    it('TC-12.1 | should return null if request not found', async () => {
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(null);

      const result = await companyRescueRequestService.getCanceledRequestDetailForCompany(companyId, requestId);

      expect(result).toBeNull();
      expect(rescueRepository.findDetail).toHaveBeenCalledWith(companyId, requestId, 'cancelled');
    });

    it('TC-12.2 | should return detail with customer info', async () => {
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(makeRequest({ status: 'cancelled' }));
      (vehicleRepository.findById as jest.Mock).mockResolvedValue(mockVehicleAvailable);

      const result = await companyRescueRequestService.getCanceledRequestDetailForCompany(companyId, requestId);

      expect(result!.customer).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // estimateRequestRouteForCompany
  // ───────────────────────────────────────────────────────────────────────────
  describe('estimateRequestRouteForCompany', () => {
    it('TC-13.1 | should return null for invalid requestId', async () => {
      const result = await companyRescueRequestService.estimateRequestRouteForCompany(companyId, 'bad-id');
      expect(result).toBeNull();
    });

    it('TC-13.2 | should return null if request not found', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(null);

      const result = await companyRescueRequestService.estimateRequestRouteForCompany(companyId, requestId);

      expect(result).toBeNull();
    });

    it('TC-13.3 | should use company coordinates as origin when no custom origin given', async () => {
      const mockRequest = makeRequest({ location: { type: 'Point', coordinates: [105.85, 21.05] } });
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(mockRequest);
      (getDistanceFromCoordinates as jest.Mock).mockReturnValue(5.0);
      (estimateEtaMinutes as jest.Mock).mockReturnValue(12);

      const result = await companyRescueRequestService.estimateRequestRouteForCompany(companyId, requestId);

      expect(result).toEqual({
        distance_km: 5.0,
        eta_minutes: 12,
        origin: { lng: 105.804817, lat: 21.028511 }, // từ company.location.coordinates
      });
    });

    it('TC-13.4 | should use custom origin when provided', async () => {
      const mockRequest = makeRequest({ location: { type: 'Point', coordinates: [105.85, 21.05] } });
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(mockRequest);
      (getDistanceFromCoordinates as jest.Mock).mockReturnValue(2.0);
      (estimateEtaMinutes as jest.Mock).mockReturnValue(5);

      const customOrigin = { lat: 21.01, lng: 105.83 };
      const result = await companyRescueRequestService.estimateRequestRouteForCompany(
        companyId,
        requestId,
        customOrigin
      );

      expect(result!.origin).toEqual({ lng: 105.83, lat: 21.01 });
    });

    it('TC-13.5 | should return null eta when distance is null', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.findDetail as jest.Mock).mockResolvedValue(makeRequest());
      (getDistanceFromCoordinates as jest.Mock).mockReturnValue(null); // không tính được khoảng cách

      const result = await companyRescueRequestService.estimateRequestRouteForCompany(companyId, requestId);

      expect(result!.distance_km).toBeNull();
      expect(result!.eta_minutes).toBeNull();
      expect(estimateEtaMinutes).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // searchNearbyCompanies
  // ───────────────────────────────────────────────────────────────────────────
  describe('searchNearbyCompanies', () => {
    const baseParams = { lat: 21.028511, lng: 105.804817 };

    const makeMockCompany = (id = companyId) => ({
      _id: new Types.ObjectId(id),
      company_name: 'Fast Rescue',
      director_name: 'Nguyen Van A',
      email: 'a@rescue.com',
      phone: '0987654321',
      address: { detail: 'Hanoi' },
      location: { type: 'Point', coordinates: [105.804817, 21.028511] },
      rating_avg: 4.8,
      rating_count: 12,
      status: 'active',
    });

    beforeEach(() => {
      (vehicleRepository.getCompanyIdsWithAvailableVehicles as jest.Mock).mockResolvedValue([companyId]);
    });

    it('TC-14.1 | should return empty list when findNearby and findSearchable both empty', async () => {
      (companyRepository.findNearby as jest.Mock).mockResolvedValue([]);
      (companyRepository.findSearchable as jest.Mock).mockResolvedValue([]);

      const result = await companyRescueRequestService.searchNearbyCompanies(baseParams);

      expect(result).toEqual([]);
    });

    it('TC-14.2 | should fallback to findSearchable when findNearby returns empty', async () => {
      const mockCo = makeMockCompany();
      (companyRepository.findNearby as jest.Mock).mockResolvedValue([]);
      (companyRepository.findSearchable as jest.Mock).mockResolvedValue([mockCo]);
      (serviceRepository.findByCompanyIdsAndCategory as jest.Mock).mockResolvedValue([]);
      (calcDistanceKm as jest.Mock).mockReturnValue(8.0);

      const result = await companyRescueRequestService.searchNearbyCompanies(baseParams);

      expect(companyRepository.findSearchable).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('TC-14.3 | should map companies with correct distance, min/max price and service names', async () => {
      const mockCo = makeMockCompany();
      const mockServices = [
        { company_id: new Types.ObjectId(companyId), name: 'Sửa động cơ', price: 300000 },
        { company_id: new Types.ObjectId(companyId), name: 'Kéo xe', price: 500000 },
      ];
      (companyRepository.findNearby as jest.Mock).mockResolvedValue([mockCo]);
      (serviceRepository.findByCompanyIdsAndCategory as jest.Mock).mockResolvedValue(mockServices);
      (calcDistanceKm as jest.Mock).mockReturnValue(2.55); // → round to 2.6

      const result = await companyRescueRequestService.searchNearbyCompanies(baseParams);

      expect(result[0]).toMatchObject({
        _id: companyId,
        distance_km: 2.6,
        min_price: 300000,
        max_price: 500000,
        service_names: ['Sửa động cơ', 'Kéo xe'],
      });
    });

    it('TC-14.4 | should filter companies by incident_type when provided', async () => {
      const matchingCatId = new Types.ObjectId().toString();
      const company1 = makeMockCompany();
      const company2 = { ...makeMockCompany(), _id: new Types.ObjectId() }; // công ty không có dịch vụ phù hợp
      const matchingService = [{ company_id: new Types.ObjectId(companyId), name: 'Sửa động cơ', price: 400000 }];

      (companyRepository.findNearby as jest.Mock).mockResolvedValue([company1, company2]);
      (mapIncidentTypeToCategory as jest.Mock).mockReturnValue('engine');
      (serviceCategoryRepository.findBySlug as jest.Mock).mockResolvedValue({ _id: matchingCatId, slug: 'engine' });
      (serviceRepository.findByCompanyIdsAndCategory as jest.Mock).mockImplementation((_ids, catId) => {
        return Promise.resolve(catId ? matchingService : matchingService);
      });
      (calcDistanceKm as jest.Mock).mockReturnValue(3.0);

      const result = await companyRescueRequestService.searchNearbyCompanies({
        ...baseParams,
        incident_type: 'engine_breakdown',
      });

      // Chỉ trả về company1 (có matching service), loại bỏ company2
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe(companyId);
    });

    it('TC-14.5 | should return null min/max price when company has no services', async () => {
      (companyRepository.findNearby as jest.Mock).mockResolvedValue([makeMockCompany()]);
      (serviceRepository.findByCompanyIdsAndCategory as jest.Mock).mockResolvedValue([]); // không có dịch vụ
      (calcDistanceKm as jest.Mock).mockReturnValue(1.0);

      const result = await companyRescueRequestService.searchNearbyCompanies(baseParams);

      expect(result[0].min_price).toBeNull();
      expect(result[0].max_price).toBeNull();
    });

    it('TC-14.6 | should use default max_distance_km of 50 when not specified', async () => {
      (companyRepository.findNearby as jest.Mock).mockResolvedValue([]);
      (companyRepository.findSearchable as jest.Mock).mockResolvedValue([]);

      await companyRescueRequestService.searchNearbyCompanies(baseParams);

      expect(companyRepository.findNearby).toHaveBeenCalledWith(105.804817, 21.028511, 50);
    });
  });
});
