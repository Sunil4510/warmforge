import { prisma } from './prisma.service';
import { SmtpService, SmtpConfig } from './smtp.service';
import { EncryptionUtil } from '../utils/encryption';

export class WarmupService {
  private static readonly SEED_LIST = (process.env.SEED_LIST || '').split(',').filter(e => e.length > 0);

  public static async executeWarmupRun(mailboxId: string) {
    const mailbox = await prisma.mailbox.findUnique({
      where: { id: mailboxId },
      include: { warmupCampaign: true },
    });

    if (!mailbox || !mailbox.warmupCampaign || mailbox.warmupStatus !== 'ACTIVE') {
      return { success: false, error: 'Mailbox or active campaign not found' };
    }

    const campaign = mailbox.warmupCampaign;
    const day = mailbox.currentWarmupDay;
    
    // 1. Calculate Volume
    let targetVolume = campaign.startingVolume + (day - 1) * campaign.dailyIncrement;
    targetVolume = Math.min(targetVolume, campaign.maxDailyVolume);

    // 2. Prepare SMTP
    const decryptedPassword = EncryptionUtil.decrypt(mailbox.encryptedSmtpPassword);
    const smtpConfig: SmtpConfig = {
      host: mailbox.smtpHost,
      port: mailbox.smtpPort,
      auth: {
        user: mailbox.smtpUsername,
        pass: decryptedPassword,
      },
    };

    // 3. Dispatch Emails (to Seed List)
    // For MVP, we send targetVolume emails distributed across the seed list
    let sentCount = 0;
    let failCount = 0;

    for (let i = 0; i < targetVolume; i++) {
      const recipient = this.SEED_LIST[i % this.SEED_LIST.length] || 'seed@warmforge.test';
      
      const result = await SmtpService.sendMail(smtpConfig, {
        from: mailbox.email,
        to: recipient,
        subject: `WarmForge Warmup - Day ${day}`,
        text: `This is an automated warmup email to build sender reputation. Sequence: ${i + 1}/${targetVolume}`,
      });

      if (result.success) {
        sentCount++;
        await prisma.warmupActivity.create({
          data: {
            mailboxId: mailbox.id,
            activityType: 'EMAIL_SENT',
            status: 'SUCCESS',
            message: `Warmup email sent to ${recipient}`,
            recipientEmail: recipient,
          },
        });

        // SIMULATION: 10% chance of a "Spam Warning" for demo visibility
        if (Math.random() < 0.1) {
          await prisma.warmupActivity.create({
            data: {
              mailboxId: mailbox.id,
              activityType: 'SPAM_WARNING',
              status: 'WARNING',
              message: `High spam-risk detected for domain reputation. Suggest slowing down increment.`,
            },
          });
        }
      } else {
        failCount++;
        await prisma.warmupActivity.create({
          data: {
            mailboxId: mailbox.id,
            activityType: 'SMTP_FAILURE',
            status: 'FAILED',
            message: `Failed to send to ${recipient}: ${result.error?.message}`,
            recipientEmail: recipient,
          },
        });
      }
    }

    // 4. Update State
    await prisma.$transaction([
      prisma.mailbox.update({
        where: { id: mailbox.id },
        data: { currentWarmupDay: day + 1 },
      }),
      prisma.warmupCampaign.update({
        where: { id: campaign.id },
        data: { lastExecutedAt: new Date() },
      }),
    ]);

    return { success: true, sentCount, failCount, targetVolume };
  }

  public static async runAllActiveWarmups() {
    const activeMailboxes = await prisma.mailbox.findMany({
      where: { warmupStatus: 'ACTIVE' },
    });

    console.log(`Starting warmup run for ${activeMailboxes.length} mailboxes...`);

    const results = [];
    for (const mailbox of activeMailboxes) {
      const res = await this.executeWarmupRun(mailbox.id);
      results.push({ mailboxId: mailbox.id, ...res });
    }

    return results;
  }
}
