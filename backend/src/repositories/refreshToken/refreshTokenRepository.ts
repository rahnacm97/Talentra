import { IRefreshToken } from '../../interfaces/refreshToken/IRefreshToken';
import RefreshTokenModel from '../../models/RefreshToken';

export interface IRefreshTokenRepository {
  deleteByUserId(userId: string): Promise<void>;
}

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async deleteByUserId(userId: string): Promise<void> {
    try {
      await RefreshTokenModel.deleteMany({ userId });
    } catch (error: any) {
      throw new Error(`Failed to delete refresh tokens for user ${userId}: ${error.message || 'Unknown error'}`);
    }
  }
}

export default RefreshTokenRepository;