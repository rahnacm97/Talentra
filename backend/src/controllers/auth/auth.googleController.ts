import { Request, Response } from 'express';
import { IGoogleAuthService } from '../../interfaces/auth/IGoogleAuthService';
import { logger } from '../../utils/logger';

export class AuthGoogleController {
  private authService: IGoogleAuthService;

  constructor(authService: IGoogleAuthService) {
    this.authService = authService;
  }

  googleSignIn = async (req: Request, res: Response) => {
    try {
      const { idToken, role } = req.body;
      if (!idToken || !['candidate', 'employer'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid idToken or role' });
      }
      const result = await this.authService.googleSignIn(idToken, role as 'candidate' | 'employer');
      if (!result) {
        return res.status(401).json({ success: false, message: 'Google Sign-In failed' });
      }
      res.status(200).json({
        success: true,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        role: result.role,
        name: result.name,
        userId: result.userId,
        blocked: result.blocked,
      });
    } catch (error: any) {
      logger.error(`Google Sign-In error: ${error.message}`);
      res.status(400).json({ success: false, message: error.message });
    }
  };
}