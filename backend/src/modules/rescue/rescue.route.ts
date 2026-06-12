import { Router } from 'express';
import rescueCompanyController from './company.controller';
import rescueCustomerController from './customer.controller';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { authorize } from '@/shared/middleware/authorize.middleware';
import { checkCompanyActive } from '@/shared/middleware/checkCompanyActive.middleware';
import './rescue.subscriber';

const router = Router();

// Apply auth and active status check for all company-scoped endpoints
router.use('/company', authenticate, authorize(['company']), checkCompanyActive);

// ─── Company-side routes (/api/rescue/company/...) ────────────────────────────
router.get('/company/active', rescueCompanyController.getCompanyActiveRequests);
router.patch('/company/active/:requestId/complete', rescueCompanyController.completeCompanyActiveRequest);
router.patch('/company/active/:requestId/start', rescueCompanyController.startCompanyActiveRequest);
router.patch('/company/active/:requestId/arrive', rescueCompanyController.arriveCompanyActiveRequest);
router.get('/company/active/:requestId', rescueCompanyController.getCompanyActiveRequestDetail);

router.get('/company/completed', rescueCompanyController.getCompanyCompletedRequests);
router.get('/company/completed/:requestId', rescueCompanyController.getCompanyCompletedRequestDetail);

router.get('/company/canceled', rescueCompanyController.getCompanyCanceledRequests);
router.get('/company/canceled/:requestId', rescueCompanyController.getCompanyCanceledRequestDetail);

router.get('/company/pending', rescueCompanyController.getCompanyPendingRequests);
router.patch('/company/pending/:requestId/accept', rescueCompanyController.acceptCompanyPendingRequest);
router.get('/company/pending/:requestId', rescueCompanyController.getCompanyPendingRequestDetail);

router.get('/company/requests/:requestId/route', rescueCompanyController.getCompanyRequestRouteEstimate);

// Public search route
router.get('/companies', rescueCompanyController.searchCompanies);

// ─── Customer-side routes (/api/rescue/requests/...) ─────────────────────────
router.use('/requests', authenticate, authorize(['customer']));
router.get('/requests/my-requests', rescueCustomerController.getMyRequests);
router.post('/requests', rescueCustomerController.createRequest);
router.patch('/requests/:id/cancel', rescueCustomerController.cancelRequest);

export default router;
