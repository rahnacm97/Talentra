import { IRefreshToken } from "../refreshToken/IRefreshToken";

export interface IAuthRepository{
    saveRefreshToken(userId: string, refreshToken: string): Promise<void>;
}