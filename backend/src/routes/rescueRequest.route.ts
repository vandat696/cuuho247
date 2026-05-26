import { Router } from 'express';
import rescueRequestController from '../controllers/rescueRequest.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

router.get('/my-requests', authenticate, authorize(['customer']), rescueRequestController.getMyRequests);
router.post('/', authenticate, authorize(['customer']), rescueRequestController.createRequest);
router.patch('/:id/cancel', authenticate, authorize(['customer']), rescueRequestController.cancelRequest);

export default router;
