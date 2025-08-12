import { IAuthService, AuthResponse } from '../../interfaces/auth/IAuthService';
import { IUserAuthService } from '../../interfaces/auth/IUserAuthService';
import { ITokenService } from '../../interfaces/utils/IJwt.Service';
import { IPasswordService } from '../../interfaces/auth/IPasswordService';
import { logger } from '../../utils/logger';

export class AuthService implements IAuthService {
  private userAuthService: IUserAuthService;
  private tokenService: ITokenService;
  private passwordService: IPasswordService;

  constructor(
    userAuthService: IUserAuthService,
    tokenService: ITokenService,
    passwordService: IPasswordService
  ) {
    this.userAuthService = userAuthService;
    this.tokenService = tokenService;
    this.passwordService = passwordService;
  }

  //Login
  async login(email: string, password: string): Promise<AuthResponse | null> {
    try {
      const roles: ('admin' | 'candidate' | 'employer')[] = ['admin', 'candidate', 'employer'];
      let user: { userId: string; name: string; password?: string; blocked?: boolean; verified?: boolean; rejectionReason?: string; } | null = null;
      let role: 'admin' | 'candidate' | 'employer' | null = null;

      for (const r of roles) {
        logger.info(`Checking role ${r} for email: ${email}`);
        user = await this.userAuthService.findByEmail(email, r);
        if (user) {
          role = r;
          logger.info(`User found for email: ${email}, role: ${r}, userId: ${user.userId}`);
          break;
        }
      }

      if (!user) {
        logger.info(`No user found for email: ${email} across roles`);
        return null;
      }

      if (!user.password) {
        logger.info(`No password set for email: ${email}, role: ${role}`);
        return null;
      }

      const isPasswordValid = await this.passwordService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        logger.info(`Invalid password for email: ${email}, role: ${role}`);
        return null;
      }

      if (user.blocked) {
        logger.error(`Blocked user attempted login: ${email}, role: ${role}`);
        throw new Error('Your account has been blocked by admin');
      }

      const tokenPayload = { userId: user.userId, role: role! };
      const accessToken = this.tokenService.generateAccessToken(tokenPayload);
      const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

      await this.tokenService.saveRefreshToken(user.userId, refreshToken);

      logger.info(`Login successful for email: ${email}, role: ${role}, userId: ${user.userId}`);

      console.log('AuthService login response:', {
      accessToken,
      refreshToken,
      role: role!,
      name: user.name,
      blocked: user.blocked,
      userId: user.userId,
      verified: user.verified,
      rejectionReason: user.rejectionReason,
    });

      return {
        accessToken,
        refreshToken,
        role: role!,
        name: user.name,
        blocked: user.blocked,
        userId: user.userId,
        verified: user.verified,
        rejectionReason: user.rejectionReason,
      };
    } catch (error: any) {
      logger.error(`Login failed for email ${email}: ${error.message}`);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  //Logout
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; role: string } | null> {
    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      if (!payload) {
        logger.info(`Invalid or missing refresh token`);
        return null;
      }
      const accessToken = this.tokenService.generateAccessToken(payload);
      logger.info(`Access token refreshed for userId: ${payload.userId}`);
      return { accessToken, role: payload.role };
    } catch (error: any) {
      logger.error(`Refresh token failed: ${error.message}`);
      return null;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await this.tokenService.deleteRefreshToken(refreshToken);
      logger.info(`Logout successful for refresh token`);
    } catch (error: any) {
      logger.error(`Logout failed: ${error.message}`);
      throw new Error(`Logout failed: ${error.message}`);
    }
  }
}