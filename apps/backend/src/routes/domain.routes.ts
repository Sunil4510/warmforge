import { Router } from 'express';
import { DomainController } from '../controllers/domain.controller';

const router = Router();

router.post('/:id/validate', DomainController.validate);
router.get('/:id', DomainController.getById);

export const domainRoutes = router;
