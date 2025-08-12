import { Schema, model } from 'mongoose';
import { IRefreshToken } from '../interfaces/refreshToken/IRefreshToken';

const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IRefreshToken>('RefreshToken', refreshTokenSchema);