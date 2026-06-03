import cron from 'node-cron';
import { WarmupService } from '../services/warmup.service';

export class WarmupScheduler {
  /**
   * Initialize the daily warmup scheduler
   */
  public static init() {
    // Run at 12:05 PM (12:05) for testing
    cron.schedule('5 12 * * *', async () => {
      console.log(`[Scheduler] Starting scheduled warmup run at ${new Date().toISOString()}`);
      try {
        await WarmupService.runAllActiveWarmups();
        console.log(`[Scheduler] Completed scheduled warmup run.`);
      } catch (error) {
        console.error(`[Scheduler] Error during warmup run:`, error);
      }
    });

    console.log('[Scheduler] Warmup Scheduler Initialized (Run scheduled for 12:05 PM)');
  }
}
