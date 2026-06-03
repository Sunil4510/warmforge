import { Request, Response, NextFunction } from 'express';
import { MailboxService, CreateMailboxDto } from '../services/mailbox.service';
import { WarmupService } from '../services/warmup.service';
import { prisma } from '../services/prisma.service';
import { AppError } from '../errors/app.error';

const MOCK_USER_ID = 'user-123-default';

export class MailboxController {
  public static async onboard(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: CreateMailboxDto = {
        ...req.body,
        userId: MOCK_USER_ID,
      };

      const result = await MailboxService.onboardMailbox(dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const mailboxes = await MailboxService.getMailboxesByUser(MOCK_USER_ID);
      res.json({ success: true, data: mailboxes });
    } catch (error) {
      next(error);
    }
  }

  public static async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const mailbox = await MailboxService.getMailboxDetail(id as string);
      if (!mailbox) {
        throw new AppError('Mailbox not found', 404);
      }
      res.json({ success: true, data: mailbox });
    } catch (error) {
      next(error);
    }
  }

  public static async toggleWarmup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['ACTIVE', 'PAUSED'].includes(status)) {
        throw new AppError('Invalid status');
      }

      const updated = await prisma.mailbox.update({
        where: { id: id as string },
        data: { warmupStatus: status },
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  public static async testWarmup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WarmupService.executeWarmupRun(id as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
