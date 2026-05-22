import { Router } from 'express';
import rescueController from '@/controllers/rescue.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { authorize } from '@/middleware/authorize.middleware';

const router = Router();

router.get('/company/pending', authenticate, authorize(['company']), rescueController.getCompanyPendingRequests);
router.get(
  '/company/pending/:requestId',
  authenticate,
  authorize(['company']),
  rescueController.getCompanyPendingRequestDetail
);
router.get('/companies', rescueController.searchCompanies);

export default router;
