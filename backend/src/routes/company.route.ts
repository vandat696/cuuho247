import companyController from '@/controllers/company.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { authorize } from '@/middleware/authorize.middleware';
import { Router } from 'express';

const router = Router();

router.get('/:companyId', authenticate, authorize(['company']), companyController.getCompanyById);

export default router;
