import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import messageController from '../controllers/Message.controller';

const router = Router();

// GET /api/messages/:rescueRequestId - Fetch message history
router.get('/:rescueRequestId', authenticate, messageController.getMessages);

export default router;
