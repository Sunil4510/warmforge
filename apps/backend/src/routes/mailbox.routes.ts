import { Router } from 'express';
import { MailboxController } from '../controllers/mailbox.controller';

const router = Router();

router.post('/', MailboxController.onboard);
router.get('/', MailboxController.getAll);
router.get('/:id', MailboxController.getDetail);
router.post('/:id/warmup/toggle', MailboxController.toggleWarmup);
router.post('/:id/warmup/test', MailboxController.testWarmup);

export const mailboxRoutes = router;
