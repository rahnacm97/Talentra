export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  name: string;
  userId: string;
  blocked: boolean;
  verified?: boolean;
  rejectionReason?: string;
}