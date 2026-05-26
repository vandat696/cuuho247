import { Router } from 'express';
import rescueController from '@/controllers/rescue.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { authorize } from '@/middleware/authorize.middleware';

const router = Router();

router.get('/company/active', authenticate, authorize(['company']), rescueController.getCompanyActiveRequests);
router.get(
  '/company/active/:requestId',
  authenticate,
  authorize(['company']),
  rescueController.getCompanyActiveRequestDetail
);
router.patch(
  '/company/active/:requestId/complete',
  authenticate,
  authorize(['company']),
  rescueController.completeCompanyActiveRequest
);
router.get('/company/completed', authenticate, authorize(['company']), rescueController.getCompanyCompletedRequests);
router.get(
  '/company/completed/:requestId',
  authenticate,
  authorize(['company']),
  rescueController.getCompanyCompletedRequestDetail
);
router.get('/company/canceled', authenticate, authorize(['company']), rescueController.getCompanyCanceledRequests);
router.get(
  '/company/canceled/:requestId',
  authenticate,
  authorize(['company']),
  rescueController.getCompanyCanceledRequestDetail
);
router.get('/company/pending', authenticate, authorize(['company']), rescueController.getCompanyPendingRequests);
router.patch(
  '/company/pending/:requestId/accept',
  authenticate,
  authorize(['company']),
  rescueController.acceptCompanyPendingRequest
);
router.get(
  '/company/pending/:requestId',
  authenticate,
  authorize(['company']),
  rescueController.getCompanyPendingRequestDetail
);
router.get('/companies', rescueController.searchCompanies);

export default router;
