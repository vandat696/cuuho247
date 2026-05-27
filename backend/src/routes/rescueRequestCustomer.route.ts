import { Router } from 'express';
import rescueRequestController from '../controllers/rescueRequestCustomer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['customer']));

router.get('/my-requests', rescueRequestController.getMyRequests);
router.post('/', rescueRequestController.createRequest);
router.patch('/:id/cancel', rescueRequestController.cancelRequest);

export default router;
