import { ITokenStorage } from '../../interfaces/utils/IToken';
import { AuthRepository } from '../../repositories/auth/authRepository';
import { logger } from '../../utils/logger';
import { IRefreshToken } from '../../interfaces/refreshToken/IRefreshToken';

export class AuthRepositoryAdapter implements ITokenStorage {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async save(userId: string, token: string, expiresAt: Date): Promise<void> {
    try {
      await this.authRepository.saveRefreshToken(userId, token);
      logger.info(`AuthRepositoryAdapter saved token for userId: ${userId}`);
    } catch (error: any) {
      logger.error(`AuthRepositoryAdapter save error for userId ${userId}: ${error.message}`);
      throw new Error(`Failed to save token: ${error.message}`);
    }
  }

  async find(token: string): Promise<IRefreshToken | null> {
    try {
      return await this.authRepository.findRefreshToken(token);
    } catch (error: any) {
      logger.error(`AuthRepositoryAdapter find error for token: ${error.message}`);
      throw new Error(`Failed to find token: ${error.message}`);
    }
  }

  async delete(token: string): Promise<void> {
    try {
      await this.authRepository.deleteRefreshToken(token);
      logger.info(`AuthRepositoryAdapter deleted token: ${token}`);
    } catch (error: any) {
      logger.error(`AuthRepositoryAdapter delete error: ${error.message}`);
      throw new Error(`Failed to delete token: ${error.message}`);
    }
  }
}