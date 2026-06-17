import { Router } from 'express';
import authController from './auth.controller';
import { upload } from '@/shared/utils/upload.util';

const router = Router();

// Register route
router.post('/customer-register', authController.customerRegister);
router.post('/company-register', upload.single('license_file'), authController.registerCompany);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
