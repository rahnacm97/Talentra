import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config/env';
import { logger } from './logger';
import { IJwtService, JwtPayload } from '../interfaces/utils/IJwt.Service';

export class JwtService implements IJwtService {
  private jwtSecret: Secret;
  private jwtRefreshSecret: Secret;
  private jwtExpiresIn: string;
  private jwtRefreshExpiresIn: string;

  constructor() {
    this.jwtSecret = config.jwtSecret;
    this.jwtRefreshSecret = config.jwtRefreshSecret;
    this.jwtExpiresIn = config.jwtExpiresIn;
    this.jwtRefreshExpiresIn = config.jwtRefreshExpiresIn;

    // Validate configuration
    if (!this.jwtSecret || !this.jwtRefreshSecret) {
      logger.error('JWT secrets are not defined in configuration');
      throw new Error('JWT configuration is missing');
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      if (!token) {
        logger.error('No token provided for verification');
        throw new Error('No token provided');
      }
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      return decoded;
    } catch (error: any) {
      logger.error(`JWT verification failed: ${error.message}`);
      throw new Error('Invalid or expired token');
    }
  }

  generateToken(payload: JwtPayload): string {
    try {
      return jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      } as SignOptions);
    } catch (error: any) {
      logger.error(`JWT generation failed: ${error.message}`);
      throw new Error('Failed to generate token');
    }
  }

  generateRefreshToken(payload: { userId: string; role: string }): string {
    try {
      return jwt.sign(payload, this.jwtRefreshSecret, {
        expiresIn: this.jwtRefreshExpiresIn,
      } as SignOptions);
    } catch (error: any) {
      logger.error(`JWT refresh token generation failed: ${error.message}`);
      throw new Error('Failed to generate refresh token');
    }
  }
}