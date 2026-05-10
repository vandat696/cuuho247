import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';

const router = Router();

router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicle);
router.post('/', vehicleController.createVehicle);
router.patch('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

export default router;
