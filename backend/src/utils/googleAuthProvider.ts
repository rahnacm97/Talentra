import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { config } from '../config/env';
import { IOAuthProvider } from '../interfaces/auth/IOathProvider';
import { logger } from './logger';

export class GoogleOAuthProvider implements IOAuthProvider {
  private googleClient: OAuth2Client;

  constructor(clientId: string) {
    this.googleClient = new OAuth2Client(clientId);
  }

  async verifyAuthCode(authCode: string, redirectUri: string): Promise<{ email: string; name: string; providerId: string }> {
    try {
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code: authCode,
        client_id: config.googleClientId,
        client_secret: config.clientSecret,
        redirect_uri : redirectUri,
        grant_type: 'authorization_code',
      });

      const { id_token } = tokenResponse.data;

      const ticket = await this.googleClient.verifyIdToken({
        idToken: id_token,
        audience: config.googleClientId,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.name) {
        throw new Error('Invalid Google ID token');
      }

      logger.info(`Google OAuth verified for email: ${payload.email}`);
      return {
        email: payload.email,
        name: payload.name,
        providerId: payload.sub,
      };
    } catch (error: any) {
      logger.error(`Google OAuth verification failed: ${error.message}`);
      throw new Error(`OAuth verification failed: ${error.message}`);
    }
  }
}