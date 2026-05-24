import { Router } from 'express';
import rescueRequestController from '../controllers/rescueRequest.controller';

const router = Router();

// Endpoint tạo yêu cầu cứu hộ
router.post('/', rescueRequestController.createRequest);

// Endpoint hủy yêu cầu cứu hộ
router.patch('/:id/cancel', rescueRequestController.cancelRequest);

export default router;
