import cron from 'node-cron';
import { WarmupService } from '../services/warmup.service';

export class WarmupScheduler {
  /**
   * Initialize the daily warmup scheduler
   */
  public static init() {
    // Run daily at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
      console.log(`[Scheduler] Starting scheduled warmup run at ${new Date().toISOString()}`);
      try {
        await WarmupService.runAllActiveWarmups();
        console.log(`[Scheduler] Completed scheduled warmup run.`);
      } catch (error) {
        console.error(`[Scheduler] Error during warmup run:`, error);
      }
    });

    console.log('[Scheduler] Warmup Scheduler Initialized (Daily at 00:00)');
  }
}
