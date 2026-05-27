import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import messageController from '../controllers/message.controller';
import { upload } from '../utils/upload.util';

const router = Router();

// GET /api/messages/:rescueRequestId - Fetch message history
router.get('/:rescueRequestId', authenticate, messageController.getMessages);

// POST /api/messages/:rescueRequestId/image - Upload image
router.post('/:rescueRequestId/image', authenticate, upload.single('image'), messageController.sendImage);

export default router;
