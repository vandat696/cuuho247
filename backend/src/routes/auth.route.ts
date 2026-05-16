import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

// Register route
router.post('/customer-register', authController.customerRegister);
router.post('/company-register', authController.registerCompany);
router.post('/login', authController.login);

export default router;
