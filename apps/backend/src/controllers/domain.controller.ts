import { Request, Response, NextFunction } from 'express';
import { DomainService } from '../services/domain.service';
import { AppError } from '../errors/app.error';

export class DomainController {
  public static async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await DomainService.validateDomainHealth(id as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const domain = await DomainService.getDomainById(id as string);
      if (!domain) {
        throw new AppError('Domain not found', 404);
      }
      res.json({ success: true, data: domain });
    } catch (error) {
      next(error);
    }
  }
}
