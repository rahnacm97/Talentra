import { Request, Response } from 'express';
import { IAuthService } from '../../interfaces/auth/IAuthService';
import { IResponseFormatter } from '../../interfaces/response/IResponseFormatter';
import { logger } from '../../utils/logger';

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export class AuthController {
  private authService: IAuthService;
  private responseFormatter: IResponseFormatter;

  constructor(authService: IAuthService, responseFormatter: IResponseFormatter) {
    this.authService = authService;
    this.responseFormatter = responseFormatter;
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        logger.error('Missing email or password in login request');
        return this.responseFormatter.formatError(res, 400, 'Email and password are required');
      }

      const result = await this.authService.login(email, password);
      if (!result) {
        logger.info(`Invalid credentials for email: ${email}`);
        return this.responseFormatter.formatError(res, 401, 'Invalid credentials');
      }

      this.responseFormatter.formatSuccess(res, 'Login successful', result);

    } catch (error: any) {
      logger.error(`Login error: ${error.message}`);
      this.responseFormatter.formatError(res, 500, error.message);
    }
  };

  logout = async (req: AuthRequest, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        logger.error('Missing refresh token in logout request');
        return this.responseFormatter.formatError(res, 400, 'Refresh token is required');
      }

      await this.authService.logout(refreshToken);
      logger.info('Logout successful');
      this.responseFormatter.formatSuccess(res, 'Logged out successfully');
    } catch (error: any) {
      logger.error(`Logout error: ${error.message}`);
      this.responseFormatter.formatError(res, 500, 'Logout failed');
    }
  };
}