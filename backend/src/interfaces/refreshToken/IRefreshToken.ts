export interface IRefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}