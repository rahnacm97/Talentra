import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../interfaces/utils/IPasswordHasher';
import { logger } from './logger';

export class BcryptPasswordHasher implements IPasswordHasher {
  private saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      logger.info('Password hashed successfully');
      return hashedPassword;
    } catch (error: any) {
      logger.error(`Password hashing failed: ${error.message}`);
      throw new Error('Failed to hash password');
    }
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      logger.info(`Password verification ${isMatch ? 'succeeded' : 'failed'}`);
      return isMatch;
    } catch (error: any) {
      logger.error(`Password verification failed: ${error.message}`);
      throw new Error('Failed to verify password');
    }
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      logger.info(`Password comparison ${isMatch ? 'successful' : 'failed'}`);
      return isMatch;
    } catch (error: any) {
      logger.error(`Password comparison failed: ${error.message}`);
      throw new Error('Password comparison failed');
    }
  }
}