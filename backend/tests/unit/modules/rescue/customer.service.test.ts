import { Types } from 'mongoose';
import customerService from '@/modules/rescue/customer.service';
import rescueRepository from '@/modules/rescue/rescue.repository';
import companyRepository from '@/modules/company/company.repository';
import { serviceCategoryRepository } from '@/modules/service-catalog/service-catalog.repository';
import { mapIncidentTypesToCategories } from '@/shared/constants/incidentMapping';
import { NotFoundError, ForbiddenError, BadRequestError, InternalServerError } from '@/shared/utils/apiError.util';

// ─── Mock tất cả external dependencies ───────────────────────────────────────
jest.mock('@/modules/rescue/rescue.repository');
jest.mock('@/modules/company/company.repository');
jest.mock('@/modules/service-catalog/service-catalog.repository');
jest.mock('@/shared/constants/incidentMapping');

// ─────────────────────────────────────────────────────────────────────────────

describe('RescueCustomerService - Unit Tests', () => {
  const userId      = new Types.ObjectId().toString();
  const companyId   = new Types.ObjectId().toString();
  const requestId   = new Types.ObjectId().toString();

  const mockCompany = {
    _id: companyId,
    company_name: 'Rescue Company Ltd',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // getRequestsForUser
  // ───────────────────────────────────────────────────────────────────────────
  describe('getRequestsForUser', () => {
    it('TC-1.1 | should return list of requests for user', async () => {
      const mockRequests = [{ _id: requestId, user_id: userId, description: 'Test request' }];
      (rescueRepository.findByUserId as jest.Mock).mockResolvedValue(mockRequests);

      const result = await customerService.getRequestsForUser(userId);

      expect(rescueRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockRequests);
    });

    it('TC-1.2 | should return empty array when user has no requests', async () => {
      (rescueRepository.findByUserId as jest.Mock).mockResolvedValue([]);

      const result = await customerService.getRequestsForUser(userId);

      expect(result).toEqual([]);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // createRescueRequest
  // ───────────────────────────────────────────────────────────────────────────
  describe('createRescueRequest', () => {
    const baseRequestData = {
      user_id:         userId,
      company_id:      companyId,
      description:     'Flat tire',
      location:        { lat: 10.762622, lng: 106.660172 },
    };

    it('TC-2.1 | should throw NotFoundError if company does not exist', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(customerService.createRescueRequest(baseRequestData)).rejects.toThrow(NotFoundError);
      expect(companyRepository.findById).toHaveBeenCalledWith(companyId);
    });

    it('TC-2.2 | should create request with correct GeoJSON coordinates (lng, lat order)', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.create as jest.Mock).mockResolvedValue({ _id: requestId });

      await customerService.createRescueRequest(baseRequestData);

      expect(rescueRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          location: {
            type: 'Point',
            coordinates: [106.660172, 10.762622], // ← lng trước, lat sau (GeoJSON)
          },
        })
      );
    });

    it('TC-2.3 | should set initial status to "pending" and create status_history entry', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.create as jest.Mock).mockResolvedValue({ _id: requestId });

      await customerService.createRescueRequest(baseRequestData);

      expect(rescueRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'pending',
          status_history: expect.arrayContaining([
            expect.objectContaining({
              status:     'pending',
              changed_by: 'user',
            }),
          ]),
        })
      );
    });

    it('TC-2.4 | should embed company name in the payload', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.create as jest.Mock).mockResolvedValue({ _id: requestId });

      await customerService.createRescueRequest(baseRequestData);

      expect(rescueRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          company: {
            company_id:   expect.any(Types.ObjectId),
            company_name: 'Rescue Company Ltd',
          },
        })
      );
    });

    it('TC-2.5 | should set address when provided', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.create as jest.Mock).mockResolvedValue({ _id: requestId });

      await customerService.createRescueRequest({ ...baseRequestData, address: '123 Test St' });

      expect(rescueRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ address: { detail: '123 Test St' } })
      );
    });

    it('TC-2.6 | should NOT set address when not provided', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.create as jest.Mock).mockResolvedValue({ _id: requestId });

      await customerService.createRescueRequest(baseRequestData); // no address

      const payload = (rescueRepository.create as jest.Mock).mock.calls[0][0];
      expect(payload.address).toBeUndefined();
    });

    it('TC-2.7 | should map service_types to categories when provided', async () => {
      const mockCategories = [{ _id: new Types.ObjectId(), slug: 'repair', name: 'Sửa chữa' }];
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (mapIncidentTypesToCategories as jest.Mock).mockReturnValue(['repair']);
      (serviceCategoryRepository.findBySlugs as jest.Mock).mockResolvedValue(mockCategories);
      (rescueRepository.create as jest.Mock).mockResolvedValue({ _id: requestId });

      await customerService.createRescueRequest({ ...baseRequestData, service_types: ['tire_puncture'] });

      expect(mapIncidentTypesToCategories).toHaveBeenCalledWith(['tire_puncture']);
      expect(serviceCategoryRepository.findBySlugs).toHaveBeenCalledWith(['repair']);
      expect(rescueRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ service_types: expect.any(Array) })
      );
    });

    it('TC-2.8 | should NOT set service_types when findBySlugs returns empty', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (mapIncidentTypesToCategories as jest.Mock).mockReturnValue(['repair']);
      (serviceCategoryRepository.findBySlugs as jest.Mock).mockResolvedValue([]); // empty
      (rescueRepository.create as jest.Mock).mockResolvedValue({ _id: requestId });

      await customerService.createRescueRequest({ ...baseRequestData, service_types: ['tire_puncture'] });

      const payload = (rescueRepository.create as jest.Mock).mock.calls[0][0];
      expect(payload.service_types).toBeUndefined();
    });

    it('TC-2.9 | should NOT call category mapping when service_types is absent', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.create as jest.Mock).mockResolvedValue({ _id: requestId });

      await customerService.createRescueRequest(baseRequestData); // no service_types

      expect(mapIncidentTypesToCategories).not.toHaveBeenCalled();
      expect(serviceCategoryRepository.findBySlugs).not.toHaveBeenCalled();
    });

    it('TC-2.10 | should set incident_photos when provided', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.create as jest.Mock).mockResolvedValue({ _id: requestId });

      await customerService.createRescueRequest({ ...baseRequestData, incident_photos: ['photo1.jpg', 'photo2.jpg'] });

      expect(rescueRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ incident_photos: ['photo1.jpg', 'photo2.jpg'] })
      );
    });

    it('TC-2.11 | should NOT set incident_photos when not provided', async () => {
      (companyRepository.findById as jest.Mock).mockResolvedValue(mockCompany);
      (rescueRepository.create as jest.Mock).mockResolvedValue({ _id: requestId });

      await customerService.createRescueRequest(baseRequestData);

      const payload = (rescueRepository.create as jest.Mock).mock.calls[0][0];
      expect(payload.incident_photos).toBeUndefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // cancelRequest
  // ───────────────────────────────────────────────────────────────────────────
  describe('cancelRequest', () => {
    const reason = 'No longer needed';

    it('TC-3.1 | should throw NotFoundError if request does not exist', async () => {
      (rescueRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(customerService.cancelRequest(requestId, userId, reason)).rejects.toThrow(NotFoundError);
      expect(rescueRepository.findById).toHaveBeenCalledWith(requestId);
    });

    it('TC-3.2 | should throw ForbiddenError if user is not the owner', async () => {
      (rescueRepository.findById as jest.Mock).mockResolvedValue({
        _id: requestId,
        user_id: new Types.ObjectId().toString(), // khác userId
        status: 'pending',
      });

      await expect(customerService.cancelRequest(requestId, userId, reason)).rejects.toThrow(ForbiddenError);
    });

    it('TC-3.3 | should throw BadRequestError when status is "in_progress"', async () => {
      (rescueRepository.findById as jest.Mock).mockResolvedValue({
        _id: requestId, user_id: userId, status: 'in_progress',
      });

      await expect(customerService.cancelRequest(requestId, userId, reason)).rejects.toThrow(BadRequestError);
    });

    it('TC-3.4 | should throw BadRequestError when status is "completed"', async () => {
      (rescueRepository.findById as jest.Mock).mockResolvedValue({
        _id: requestId, user_id: userId, status: 'completed',
      });

      await expect(customerService.cancelRequest(requestId, userId, reason)).rejects.toThrow(BadRequestError);
    });

    it('TC-3.5 | should throw BadRequestError when status is "cancelled"', async () => {
      (rescueRepository.findById as jest.Mock).mockResolvedValue({
        _id: requestId, user_id: userId, status: 'cancelled',
      });

      await expect(customerService.cancelRequest(requestId, userId, reason)).rejects.toThrow(BadRequestError);
    });

    it('TC-3.6 | should throw InternalServerError if DB update fails', async () => {
      (rescueRepository.findById as jest.Mock).mockResolvedValue({
        _id: requestId, user_id: userId, status: 'pending',
      });
      (rescueRepository.cancelById as jest.Mock).mockResolvedValue(null);

      await expect(customerService.cancelRequest(requestId, userId, reason)).rejects.toThrow(InternalServerError);
      expect(rescueRepository.cancelById).toHaveBeenCalledWith(requestId, 'user', reason);
    });

    it('TC-3.7 | should successfully cancel a "pending" request', async () => {
      const mockCancelled = { _id: requestId, user_id: userId, status: 'cancelled' };
      (rescueRepository.findById as jest.Mock).mockResolvedValue({
        _id: requestId, user_id: userId, status: 'pending',
      });
      (rescueRepository.cancelById as jest.Mock).mockResolvedValue(mockCancelled);

      const result = await customerService.cancelRequest(requestId, userId, reason);

      expect(rescueRepository.cancelById).toHaveBeenCalledWith(requestId, 'user', reason);
      expect(result).toEqual(mockCancelled);
    });

    it('TC-3.8 | should successfully cancel an "accepted" request', async () => {
      const mockCancelled = { _id: requestId, user_id: userId, status: 'cancelled' };
      (rescueRepository.findById as jest.Mock).mockResolvedValue({
        _id: requestId, user_id: userId, status: 'accepted',
      });
      (rescueRepository.cancelById as jest.Mock).mockResolvedValue(mockCancelled);

      const result = await customerService.cancelRequest(requestId, userId, reason);

      expect(result.status).toBe('cancelled');
    });
  });
});
