import { prisma } from './prisma.service';
import { SmtpService, SmtpConfig } from './smtp.service';
import { EncryptionUtil } from '../utils/encryption';
import { DomainService } from './domain.service';

export interface CreateMailboxDto {
  userId: string;
  email: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string; // Raw password from frontend
}

export class MailboxService {
  public static async onboardMailbox(dto: CreateMailboxDto) {
    // 1. Verify SMTP Connection
    const smtpConfig: SmtpConfig = {
      host: dto.smtpHost,
      port: dto.smtpPort,
      auth: {
        user: dto.smtpUsername,
        pass: dto.smtpPassword,
      },
    };

    const isValid = await SmtpService.verifyConnection(smtpConfig);
    if (!isValid) {
      throw new Error('SMTP connection verification failed.');
    }

    // 2. Extract Domain
    const domainName = dto.email.split('@')[1];
    if (!domainName) {
      throw new Error('Invalid email address format.');
    }

    // 3. Encrypt Password
    const encryptedPassword = EncryptionUtil.encrypt(dto.smtpPassword);

    // 4. Persistence (Transactional)
    const result = await prisma.$transaction(async (tx) => {
      // Find or create domain
      let domain = await tx.domain.findUnique({
        where: { domainName },
      });

      if (!domain) {
        domain = await tx.domain.create({
          data: {
            domainName,
            userId: dto.userId,
            healthStatus: 'UNKNOWN',
          },
        });
      }

      // Create mailbox
      const mailbox = await tx.mailbox.create({
        data: {
          email: dto.email,
          userId: dto.userId,
          domainId: domain.id,
          smtpHost: dto.smtpHost,
          smtpPort: dto.smtpPort,
          smtpUsername: dto.smtpUsername,
          encryptedSmtpPassword: encryptedPassword,
        },
      });

      // Create initial warmup campaign
      await tx.warmupCampaign.create({
        data: {
          mailboxId: mailbox.id,
          status: 'ACTIVE',
        },
      });

      // Log activity
      await tx.warmupActivity.create({
        data: {
          mailboxId: mailbox.id,
          activityType: 'WARMUP_STARTED',
          status: 'SUCCESS',
          message: 'Mailbox successfully onboarded and warmup activated.',
        },
      });

      return { mailbox, domain };
    });

    // 5. Async Trigger Domain Health Check
    DomainService.validateDomainHealth(result.domain.id).catch(console.error);

    return result;
  }

  public static async getMailboxesByUser(userId: string) {
    return await prisma.mailbox.findMany({
      where: { userId },
      include: {
        domain: true,
        warmupCampaign: true,
      },
    });
  }

  public static async getMailboxDetail(id: string) {
    return await prisma.mailbox.findUnique({
      where: { id },
      include: {
        domain: true,
        warmupCampaign: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
  }
}
