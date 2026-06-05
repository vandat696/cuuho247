import { Router } from 'express';
import rescueCompanyController from './company.controller';
import rescueCustomerController from './customer.controller';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { authorize } from '@/shared/middleware/authorize.middleware';

const router = Router();

// ─── Company-side routes (/api/rescue/company/...) ────────────────────────────
router.get('/company/active', authenticate, authorize(['company']), rescueCompanyController.getCompanyActiveRequests);
router.patch(
  '/company/active/:requestId/complete',
  authenticate,
  authorize(['company']),
  rescueCompanyController.completeCompanyActiveRequest
);
router.patch(
  '/company/active/:requestId/start',
  authenticate,
  authorize(['company']),
  rescueCompanyController.startCompanyActiveRequest
);
router.patch(
  '/company/active/:requestId/arrive',
  authenticate,
  authorize(['company']),
  rescueCompanyController.arriveCompanyActiveRequest
);
router.get(
  '/company/active/:requestId',
  authenticate,
  authorize(['company']),
  rescueCompanyController.getCompanyActiveRequestDetail
);
router.get(
  '/company/completed',
  authenticate,
  authorize(['company']),
  rescueCompanyController.getCompanyCompletedRequests
);
router.get(
  '/company/completed/:requestId',
  authenticate,
  authorize(['company']),
  rescueCompanyController.getCompanyCompletedRequestDetail
);
router.get(
  '/company/canceled',
  authenticate,
  authorize(['company']),
  rescueCompanyController.getCompanyCanceledRequests
);
router.get(
  '/company/canceled/:requestId',
  authenticate,
  authorize(['company']),
  rescueCompanyController.getCompanyCanceledRequestDetail
);
router.get('/company/pending', authenticate, authorize(['company']), rescueCompanyController.getCompanyPendingRequests);
router.patch(
  '/company/pending/:requestId/accept',
  authenticate,
  authorize(['company']),
  rescueCompanyController.acceptCompanyPendingRequest
);
router.get(
  '/company/pending/:requestId',
  authenticate,
  authorize(['company']),
  rescueCompanyController.getCompanyPendingRequestDetail
);
router.get(
  '/company/requests/:requestId/route',
  authenticate,
  authorize(['company']),
  rescueCompanyController.getCompanyRequestRouteEstimate
);

// Public search route
router.get('/companies', rescueCompanyController.searchCompanies);

// ─── Customer-side routes (/api/rescue/requests/...) ─────────────────────────
router.use('/requests', authenticate, authorize(['customer']));
router.get('/requests/my-requests', rescueCustomerController.getMyRequests);
router.post('/requests', rescueCustomerController.createRequest);
router.patch('/requests/:id/cancel', rescueCustomerController.cancelRequest);

export default router;
