import { Router, Request, Response } from 'express';
import { MailboxService, CreateMailboxDto } from '../services/mailbox.service';
import { WarmupService } from '../services/warmup.service';
import { prisma } from '../services/prisma.service';

const router = Router();

// Mock User ID for MVP (In real app, this comes from Auth Middleware)
const MOCK_USER_ID = 'user-123-default';

/**
 * @route POST /api/v1/mailboxes
 * @desc Onboard a new mailbox
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const dto: CreateMailboxDto = {
      ...req.body,
      userId: MOCK_USER_ID, // Force mock user for MVP demo
    };

    const result = await MailboxService.onboardMailbox(dto);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/mailboxes
 * @desc Get all mailboxes for the current user
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const mailboxes = await MailboxService.getMailboxesByUser(MOCK_USER_ID);
    res.json({ success: true, data: mailboxes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/mailboxes/:id
 * @desc Get detailed mailbox info and activity
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const mailbox = await MailboxService.getMailboxDetail(req.params.id);
    if (!mailbox) {
      return res.status(404).json({ success: false, error: 'Mailbox not found' });
    }
    res.json({ success: true, data: mailbox });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/v1/mailboxes/:id/warmup/toggle
 * @desc Pause or Resume a warmup campaign
 */
router.post('/:id/warmup/toggle', async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // 'ACTIVE' or 'PAUSED'
    if (!['ACTIVE', 'PAUSED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const updated = await prisma.mailbox.update({
      where: { id: req.params.id },
      data: { warmupStatus: status },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/v1/mailboxes/:id/warmup/test
 * @desc Trigger a manual warmup run for demo/testing
 */
router.post('/:id/warmup/test', async (req: Request, res: Response) => {
  try {
    const result = await WarmupService.executeWarmupRun(req.params.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export const mailboxRoutes = router;
