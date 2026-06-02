import { promises as dns } from 'dns';

export interface DnsValidationResult {
  mx: boolean;
  spf: boolean;
  dmarc: boolean;
  dkim: boolean;
}

export class DnsService {
  public static async validateDomain(domain: string): Promise<DnsValidationResult> {
    const results = await Promise.allSettled([
      this.checkMX(domain),
      this.checkSPF(domain),
      this.checkDMARC(domain),
      this.checkDKIM(domain),
    ]);

    return {
      mx: results[0].status === 'fulfilled' && (results[0] as PromiseFulfilledResult<boolean>).value,
      spf: results[1].status === 'fulfilled' && (results[1] as PromiseFulfilledResult<boolean>).value,
      dmarc: results[2].status === 'fulfilled' && (results[2] as PromiseFulfilledResult<boolean>).value,
      dkim: results[3].status === 'fulfilled' && (results[3] as PromiseFulfilledResult<boolean>).value,
    };
  }

  private static async checkMX(domain: string): Promise<boolean> {
    try {
      const records = await dns.resolveMx(domain);
      return records.length > 0;
    } catch {
      return false;
    }
  }

  private static async checkSPF(domain: string): Promise<boolean> {
    try {
      const records = await dns.resolveTxt(domain);
      return records.some((txt) => txt.some((s) => s.startsWith('v=spf1')));
    } catch {
      return false;
    }
  }

  private static async checkDMARC(domain: string): Promise<boolean> {
    try {
      const records = await dns.resolveTxt(`_dmarc.${domain}`);
      return records.some((txt) => txt.some((s) => s.startsWith('v=DMARC1')));
    } catch {
      return false;
    }
  }

  private static async checkDKIM(domain: string): Promise<boolean> {
    try {
      // Checking a common selector for MVP. In production, this might need dynamic selectors.
      const records = await dns.resolveTxt(`default._domainkey.${domain}`);
      return records.length > 0;
    } catch {
      // Also try 'google' as a common selector
      try {
        const googleRecords = await dns.resolveTxt(`google._domainkey.${domain}`);
        return googleRecords.length > 0;
      } catch {
        return false;
      }
    }
  }
}
