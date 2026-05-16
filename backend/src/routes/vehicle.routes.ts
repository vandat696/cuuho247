import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['company']));

router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicle);
router.post('/', vehicleController.createVehicle);
router.patch('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

export default router;
