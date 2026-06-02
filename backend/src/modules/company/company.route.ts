import { Router } from 'express';
import companyController from './company.controller';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { authorize } from '@/shared/middleware/authorize.middleware';

const router = Router();

router.get('/:companyId', authenticate, authorize(['company']), companyController.getCompanyById);

export default router;
