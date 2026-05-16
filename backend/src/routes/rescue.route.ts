import { Router } from 'express';
import rescueController from '@/controllers/rescue.controller';

const router = Router();

router.get('/companies', rescueController.searchCompanies);

export default router;
