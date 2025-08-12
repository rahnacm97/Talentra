import { IAuthResponse } from './IAuthResponse';

export interface IGoogleAuthService {
  googleSignIn(authCode: string, role: 'candidate' | 'employer'): Promise<IAuthResponse | null>;
}