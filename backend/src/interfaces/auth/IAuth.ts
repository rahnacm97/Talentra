export interface IAuth {
  userId: string;
  email?: string;
  role: 'admin' | 'candidate' | 'employer';
  name?: string;
  accessToken?: string;
  refreshToken?: string;
  iat?: number;
  exp?: number;
}