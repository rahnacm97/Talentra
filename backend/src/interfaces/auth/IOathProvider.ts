export interface IOAuthProvider {
  verifyAuthCode(authCode: string, redirectUri: string): Promise<{ email: string; name: string; providerId: string }>;
}