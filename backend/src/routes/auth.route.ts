import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { upload } from '../utils/upload.util';

const router = Router();

// Register route
router.post('/customer-register', authController.customerRegister);
router.post('/company-register', upload.single('license_file'), authController.registerCompany);
router.post('/login', authController.login);

export default router;
