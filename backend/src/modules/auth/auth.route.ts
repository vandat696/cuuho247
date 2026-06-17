import { Router } from 'express';
import authController from './auth.controller';
import { createUploader } from '@/shared/utils/upload.util';

const router = Router();

// Register route
router.post('/customer-register', authController.customerRegister);
router.post(
  '/company-register',
  createUploader('company_license', true).single('license_file'),
  authController.registerCompany
);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
