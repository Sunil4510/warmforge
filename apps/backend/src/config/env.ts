import dotenv from 'dotenv';
import { AppError } from '../errors/app.error';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  encryptionKey: process.env.ENCRYPTION_KEY,
  seedList: (process.env.SEED_LIST || '').split(',').filter((e) => e.length > 0),
};

export const validateEnv = () => {
  if (!config.encryptionKey || config.encryptionKey.length !== 32) {
    throw new AppError('ENCRYPTION_KEY must be 32 characters long.', 500);
  }
};
