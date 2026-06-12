import { Router } from 'express';
import { authenticate } from '@/shared/middleware/auth.middleware';
import messageController from './message.controller';
import { upload } from '@/shared/utils/upload.util';
import './message.subscriber';

const router = Router();

// GET /api/messages/:rescueRequestId - Fetch message history
router.get('/:rescueRequestId', authenticate, messageController.getMessages);

// POST /api/messages/:rescueRequestId/image - Upload image
router.post('/:rescueRequestId/image', authenticate, upload.single('image'), messageController.sendImage);

export default router;
