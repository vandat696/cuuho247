import { Router } from 'express';
import serviceCategoryController from '../controllers/serviceCategory.controller';

const router = Router();

router.get('/', serviceCategoryController.getCategories);

export default router;
