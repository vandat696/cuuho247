import { Router } from 'express';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { upload } from '@/shared/utils/upload.util';
import userController from './user.controller';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getProfile);
router.put('/me', upload.single('avatar'), userController.updateProfile);

export default router;
