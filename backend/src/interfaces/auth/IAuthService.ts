export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: 'admin' | 'candidate' | 'employer';
  name: string;
  blocked?: boolean;
  userId: string;
  verified?: boolean;
  rejectionReason?: string;
}

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse | null>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; role: string } | null>;
  logout(refreshToken: string): Promise<void>;
}