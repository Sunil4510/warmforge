import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const userId = 'user-123-default';
  
  // 1. Create a Healthy Domain (Gmail)
  const gmail = await prisma.domain.upsert({
    where: { domainName: 'gmail.com' },
    update: {
      mxStatus: 'VALID',
      spfStatus: 'VALID',
      dmarcStatus: 'VALID',
      dkimStatus: 'VALID',
      healthStatus: 'HEALTHY',
    },
    create: {
      domainName: 'gmail.com',
      userId,
      mxStatus: 'VALID',
      spfStatus: 'VALID',
      dmarcStatus: 'VALID',
      dkimStatus: 'VALID',
      healthStatus: 'HEALTHY',
    },
  });

  const healthyMailbox = await prisma.mailbox.upsert({
    where: { email: 'demo.healthy@gmail.com' },
    update: {},
    create: {
      email: 'demo.healthy@gmail.com',
      userId,
      domainId: gmail.id,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'demo.healthy@gmail.com',
      encryptedSmtpPassword: 'mock-encrypted-data',
      warmupStatus: 'ACTIVE',
      currentWarmupDay: 12,
      dailyLimit: 35,
    },
  });

  await prisma.warmupCampaign.upsert({
    where: { mailboxId: healthyMailbox.id },
    update: {},
    create: {
      mailboxId: healthyMailbox.id,
      startingVolume: 5,
      dailyIncrement: 3,
      maxDailyVolume: 50,
      status: 'ACTIVE',
    }
  });

  // 2. Create a Warning Domain (Outlook)
  const outlook = await prisma.domain.upsert({
    where: { domainName: 'outlook.com' },
    update: {
      mxStatus: 'VALID',
      spfStatus: 'VALID',
      dmarcStatus: 'MISSING',
      dkimStatus: 'VALID',
      healthStatus: 'WARNING',
    },
    create: {
      domainName: 'outlook.com',
      userId,
      mxStatus: 'VALID',
      spfStatus: 'VALID',
      dmarcStatus: 'MISSING',
      dkimStatus: 'VALID',
      healthStatus: 'WARNING',
    },
  });

  const warningMailbox = await prisma.mailbox.upsert({
    where: { email: 'demo.warning@outlook.com' },
    update: {},
    create: {
      email: 'demo.warning@outlook.com',
      userId,
      domainId: outlook.id,
      smtpHost: 'smtp.office365.com',
      smtpPort: 587,
      smtpUsername: 'demo.warning@outlook.com',
      encryptedSmtpPassword: 'mock-encrypted-data',
      warmupStatus: 'PAUSED',
      currentWarmupDay: 4,
      dailyLimit: 15,
    },
  });

  await prisma.warmupCampaign.upsert({
    where: { mailboxId: warningMailbox.id },
    update: {},
    create: {
      mailboxId: warningMailbox.id,
      startingVolume: 5,
      dailyIncrement: 2,
      maxDailyVolume: 50,
      status: 'PAUSED',
    }
  });

  console.log('Demo data seeded successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
