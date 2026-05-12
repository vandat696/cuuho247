import { Router } from 'express';
import rescueController from '../controllers/rescue.controller';

const router = Router();

// GET /api/rescue/companies?lat=&lng=&incident_type=
router.get('/companies', rescueController.searchCompanies);

export default router;
