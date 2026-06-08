import { Router } from 'express';
import companyController from './company.controller';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { authorize } from '@/shared/middleware/authorize.middleware';

const router = Router();

// ─── Company Profile Routes ───────────────────────────────────────────────────
router.get('/profile/me', authenticate, authorize(['company']), companyController.getMe);
router.put('/profile', authenticate, authorize(['company']), companyController.updateProfile);

// ─── General Company Routes ───────────────────────────────────────────────────
router.get('/:companyId', authenticate, authorize(['company']), companyController.getCompanyById);

export default router;
