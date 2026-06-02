import { Router, Request, Response } from 'express';
import { DomainService } from '../services/domain.service';

const router = Router();

/**
 * @route POST /api/v1/domains/:id/validate
 * @desc Trigger manual DNS health validation
 */
router.post('/:id/validate', async (req: Request, res: Response) => {
  try {
    const result = await DomainService.validateDomainHealth(req.params.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/domains/:id
 * @desc Get domain health info
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const domain = await DomainService.getDomainById(req.params.id);
    if (!domain) {
      return res.status(404).json({ success: false, error: 'Domain not found' });
    }
    res.json({ success: true, data: domain });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export const domainRoutes = router;
