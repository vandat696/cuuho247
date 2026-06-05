import { Router } from 'express';
import { vehicleController } from './vehicle.controller';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { authorize } from '@/shared/middleware/authorize.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['company']));

router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicle);
router.post('/', vehicleController.createVehicle);
router.patch('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

export default router;
