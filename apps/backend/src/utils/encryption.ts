import crypto from 'crypto';
import { config } from '../config/env';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export class EncryptionUtil {
  private static readonly key = config.encryptionKey;

  public static encrypt(text: string): string {
    if (!this.key || this.key.length !== 32) {
      throw new Error('Invalid ENCRYPTION_KEY. Must be 32 characters.');
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(this.key), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${encrypted}:${tag.toString('hex')}`;
  }

  public static decrypt(encryptedText: string): string {
    if (!this.key || this.key.length !== 32) {
      throw new Error('Invalid ENCRYPTION_KEY. Must be 32 characters.');
    }

    const [ivHex, encrypted, tagHex] = encryptedText.split(':');
    if (!ivHex || !encrypted || !tagHex) {
      throw new Error('Invalid encrypted text format.');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(this.key), iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
