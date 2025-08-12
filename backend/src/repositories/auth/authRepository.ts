import { ITokenStorage, } from "../../interfaces/utils/IToken";
import { IRefreshToken } from "src/interfaces/refreshToken/IRefreshToken";
import RefreshTokenModel from '../../models/RefreshToken';

export class MongooseTokenStorage implements ITokenStorage {
  async save(userId: string, token: string, expiresAt: Date): Promise<void> {
    await RefreshTokenModel.create({ userId, token, expiresAt });
  }

  async find(token: string): Promise<IRefreshToken | null> {
    return RefreshTokenModel.findOne({ token });
  }

  async delete(token: string): Promise<void> {
    await RefreshTokenModel.deleteOne({ token });
  }
}

export class AuthRepository {
  constructor(private storage: ITokenStorage, private tokenExpirationDays = 7) {}

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date(Date.now() + this.tokenExpirationDays * 24 * 60 * 60 * 1000);
    await this.storage.save(userId, token, expiresAt);
  }

  async findRefreshToken(token: string): Promise<IRefreshToken | null> {
    return this.storage.find(token);
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.storage.delete(token);
  }
}