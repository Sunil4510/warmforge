import { prisma } from './prisma.service';
import { DnsService } from './dns.service';

export class DomainService {
  public static async validateDomainHealth(domainId: string) {
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
    });

    if (!domain) {
      throw new Error('Domain not found');
    }

    const dnsResults = await DnsService.validateDomain(domain.domainName);

    // Health Logic
    const mxStatus = dnsResults.mx ? 'VALID' : 'MISSING';
    const spfStatus = dnsResults.spf ? 'VALID' : 'MISSING';
    const dmarcStatus = dnsResults.dmarc ? 'VALID' : 'MISSING';
    const dkimStatus = dnsResults.dkim ? 'VALID' : 'WARNING'; // Warning if DKIM missing

    let healthStatus = 'HEALTHY';
    if (mxStatus === 'MISSING' || spfStatus === 'MISSING') {
      healthStatus = 'CRITICAL';
    } else if (dmarcStatus === 'MISSING' || dkimStatus === 'WARNING') {
      healthStatus = 'WARNING';
    }

    return await prisma.domain.update({
      where: { id: domainId },
      data: {
        mxStatus,
        spfStatus,
        dmarcStatus,
        dkimStatus,
        healthStatus,
        lastCheckedAt: new Date(),
      },
    });
  }

  public static async getDomainById(domainId: string) {
    return await prisma.domain.findUnique({
      where: { id: domainId },
      include: {
        mailboxes: true,
      },
    });
  }
}
