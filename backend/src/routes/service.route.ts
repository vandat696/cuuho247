import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { authorize } from '@/middleware/authorize.middleware';
import serviceController from '@/controllers/service.controller';

const router = Router();

router.use(authenticate);
router.use(authorize(['company']));

router.get('/', serviceController.getServices);
router.get('/:serviceId', serviceController.getServiceById);
router.post('/new', serviceController.createService);
router.put('/:serviceId', serviceController.updateService);
router.delete('/:serviceId/delete', serviceController.deleteService);

export default router;
