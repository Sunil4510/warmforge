import Tangerine from 'tangerine';

const resolver = new Tangerine();

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
    console.log(`[DNS Service] Validation results for ${domain}:`, results);
    return {
      mx: results[0].status === 'fulfilled' && (results[0] as PromiseFulfilledResult<boolean>).value,
      spf: results[1].status === 'fulfilled' && (results[1] as PromiseFulfilledResult<boolean>).value,
      dmarc: results[2].status === 'fulfilled' && (results[2] as PromiseFulfilledResult<boolean>).value,
      dkim: results[3].status === 'fulfilled' && (results[3] as PromiseFulfilledResult<boolean>).value,
    };
  }

  private static async checkMX(domain: string): Promise<boolean> {
    try {
      const records = await resolver.resolveMx(domain);
      return records.length > 0;
    } catch {
      return false;
    }
  }

  private static async checkSPF(domain: string): Promise<boolean> {
    try {
      const records = await resolver.resolveTxt(domain);
      // Scan all record sets and all strings within them
      return records.some((txtSet: string[]) => 
        txtSet.some((record: string) => record.toLowerCase().includes('v=spf1'))
      );
    } catch (e) {
      return false;
    }
  }

  private static async checkDMARC(domain: string): Promise<boolean> {
    try {
      const records = await resolver.resolveTxt(`_dmarc.${domain}`);
      return records.some((txtSet: string[]) => 
        txtSet.some((record: string) => record.toUpperCase().includes('V=DMARC1'))
      );
    } catch (e) {
      return false;
    }
  }

  private static async checkDKIM(domain: string): Promise<boolean> {
    const selectors = ['google', 'default', 'mandrill', 'k1', 'mail'];
    
    for (const selector of selectors) {
      try {
        const records = await resolver.resolveTxt(`${selector}._domainkey.${domain}`);
        if (records.length > 0) return true;
      } catch {
        continue;
      }
    }
    return false;
  }
}
