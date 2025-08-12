export interface JwtPayload {
  userId?: string;
  email?: string;
  role: string;
  iat?: number;
  exp?: number;
  purpose?: string;
}

export interface IJwtService{
    generateToken(payload: JwtPayload): string;
    generateRefreshToken(payload: { userId: string, role: string}): string;
    verifyToken(token: string): Promise<JwtPayload>;
}

export interface ITokenService {
  generateAccessToken(payload: { userId: string; role: string }): string;
  generateRefreshToken(payload: { userId: string; role: string }): string;
  saveRefreshToken(userId: string, refreshToken: string): Promise<void>;
  findRefreshToken(token: string): Promise<{ userId: string; token: string; expiresAt: Date } | null>;
  deleteRefreshToken(token: string): Promise<void>;
  verifyRefreshToken(token: string): Promise<{ userId: string; role: string } | null>;
}