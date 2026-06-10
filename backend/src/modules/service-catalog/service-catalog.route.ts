import { Router } from 'express';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { authorize } from '@/shared/middleware/authorize.middleware';
import { checkCompanyActive } from '@/shared/middleware/checkCompanyActive.middleware';
import serviceCatalogController from './service-catalog.controller';

// ─── Company Services Routes (/api/company/services) ──────────────────────────
export const serviceRouter = Router();

serviceRouter.use(authenticate);
serviceRouter.use(authorize(['company']));
serviceRouter.use(checkCompanyActive);

serviceRouter.get('/', serviceCatalogController.getServices);
serviceRouter.get('/:serviceId', serviceCatalogController.getServiceById);
serviceRouter.post('/new', serviceCatalogController.createService);
serviceRouter.put('/:serviceId', serviceCatalogController.updateService);
serviceRouter.delete('/:serviceId/delete', serviceCatalogController.deleteService);

// ─── Service Categories Routes (/api/service-categories) ──────────────────────
export const serviceCategoryRouter = Router();

serviceCategoryRouter.get('/', serviceCatalogController.getCategories);
