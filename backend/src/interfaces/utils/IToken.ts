//import { IRefreshToken } from "../refreshToken/IRefreshToken";

export interface ITokenStorage {
  save(userId: string, token: string, expiresAt: Date): Promise<void>;
  find(token: string): Promise<IRefreshToken | null>;
  delete(token: string): Promise<void>;
}

export interface IRefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
}