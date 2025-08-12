import { ITokenService } from '../../interfaces/utils/IJwt.Service';
import { IJwtService } from '../../interfaces/utils/IJwt.Service';
import { ITokenStorage } from '../../interfaces/utils/IToken';
import { logger } from '../../utils/logger';

export class TokenService implements ITokenService {
  private jwtService: IJwtService;
  private tokenStorage: ITokenStorage;

  constructor(jwtService: IJwtService, tokenStorage: ITokenStorage) {
    this.jwtService = jwtService;
    this.tokenStorage = tokenStorage;
  }

  generateAccessToken(payload: { userId: string; role: string }): string {
    return this.jwtService.generateToken(payload);
  }

  generateRefreshToken(payload: { userId: string; role: string }): string {
    return this.jwtService.generateRefreshToken(payload);
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await this.tokenStorage.save(userId, refreshToken, expiresAt);
      logger.info(`Refresh token saved for userId: ${userId}`);
    } catch (error: any) {
      logger.error(`Failed to save refresh token for userId ${userId}: ${error.message}`);
      throw new Error('Failed to save refresh token');
    }
  }

  async findRefreshToken(token: string): Promise<{ userId: string; token: string; expiresAt: Date } | null> {
    try {
      const storedToken = await this.tokenStorage.find(token);
      if (!storedToken) {
        logger.info(`Refresh token not found: ${token}`);
        return null;
      }
      return storedToken;
    } catch (error: any) {
      logger.error(`Failed to find refresh token: ${error.message}`);
      throw new Error('Failed to find refresh token');
    }
  }

  async deleteRefreshToken(token: string): Promise<void> {
    try {
      await this.tokenStorage.delete(token);
      logger.info(`Refresh token deleted: ${token}`);
    } catch (error: any) {
      logger.error(`Failed to delete refresh token: ${error.message}`);
      throw new Error('Failed to delete refresh token');
    }
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string; role: string } | null> {
    try {
      const decoded = await this.jwtService.verifyToken(token);
      if (!decoded.userId || !decoded.role) {
        logger.error(`Invalid refresh token payload: missing userId or role`);
        return null;
      }
      const storedToken = await this.findRefreshToken(token);
      if (!storedToken) {
        logger.info(`Refresh token not found in storage: ${token}`);
        return null;
      }
      return { userId: decoded.userId, role: decoded.role };
    } catch (error: any) {
      logger.error(`Failed to verify refresh token: ${error.message}`);
      return null;
    }
  }
}