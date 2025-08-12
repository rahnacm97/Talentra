import { IOAuthProvider } from '../../interfaces/auth/IOathProvider';
import { IUserAuthService } from '../../interfaces/auth/IUserAuthService';
import { ITokenService } from '../../interfaces/utils/IJwt.Service';
import { IAuthResponse } from 'src/interfaces/auth/IAuthResponse';
import { logger } from '../../utils/logger';
import { config } from '../../config/env';

export interface IGoogleAuthService {
  googleSignIn(authCode: string, role: 'candidate' | 'employer'): Promise<IAuthResponse | null>;
}

export class GoogleAuthService implements IGoogleAuthService {
  private oauthProvider: IOAuthProvider;
  private userAuthService: IUserAuthService;
  private tokenService: ITokenService;

  constructor(oauthProvider: IOAuthProvider, userAuthService: IUserAuthService, tokenService: ITokenService) {
    this.oauthProvider = oauthProvider;
    this.userAuthService = userAuthService;
    this.tokenService = tokenService;
  }

  async googleSignIn(authCode: string, role: 'candidate' | 'employer'): Promise<IAuthResponse | null> {
    try {
      const { email, name, providerId } = await this.oauthProvider.verifyAuthCode(authCode, config.frontendUrl);

      const { userId, name: userName, blocked } = await this.userAuthService.findOrCreateUser(
        role,
        email,
        name,
        providerId
      );

      if (blocked) {
        logger.error(`Blocked ${role} attempted Google Sign-In: ${email}`);
        throw new Error('Your account has been blocked by admin');
      }

      const tokenPayload = { userId, role, email };
      const accessToken = this.tokenService.generateAccessToken(tokenPayload);
      const refreshToken = this.tokenService.generateRefreshToken({ userId, role });

      await this.tokenService.saveRefreshToken(userId, refreshToken);

      logger.info(`Google Sign-In successful for ${role}: ${email}`);
      return {
        accessToken,
        refreshToken,
        role,
        name: userName,
        blocked,
        userId,
      };
    } catch (error: any) {
      logger.error(`Google Sign-In failed for ${role}: ${error.message}`);
      throw new Error(`Google Sign-In failed: ${error.message}`);
    }
  }
}