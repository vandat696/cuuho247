import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { authorize } from '@/middleware/authorize.middleware';
import RescueRequestController from '@/controllers/rescueRequest.controller';

const router = Router();

router.use(authenticate);
router.use(authorize(['customer']));
router.patch('/:id/cancel', RescueRequestController.cancelRequest);

export default router;
