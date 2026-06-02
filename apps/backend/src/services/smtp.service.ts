import nodemailer from 'nodemailer';

export interface SmtpConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class SmtpService {
  public static async verifyConnection(config: SmtpConfig): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465, // Usually 465 is SSL, 587 is TLS
      auth: config.auth,
    });

    try {
      await transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP Verification Failed:', error);
      return false;
    } finally {
      transporter.close();
    }
  }

  public static async sendMail(
    config: SmtpConfig,
    options: nodemailer.SendMailOptions
  ): Promise<{ success: boolean; messageId?: string; error?: any }> {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: config.auth,
    });

    try {
      const info = await transporter.sendMail(options);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('SMTP Send Failed:', error);
      return { success: false, error };
    } finally {
      transporter.close();
    }
  }
}
