import { Request, Response } from 'express';
import { IAuthService } from '../../interfaces/auth/IAuthService';
import { IAuth } from '../../interfaces/auth/IAuth';
import { IResponseFormatter } from '../../interfaces/response/IResponseFormatter';

export class AuthRefreshTokenController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  // Refresh token
  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, error: 'Refresh token is required' });
      }

      const result = await this.authService.refreshToken(refreshToken);
      if (!result) {
        return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
      }

      res.json({ success: true, data: { accessToken: result.accessToken, role: result.role } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Token refresh failed' });
    }
  };
}