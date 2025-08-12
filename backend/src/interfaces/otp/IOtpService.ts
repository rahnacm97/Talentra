export interface IOtpService {
  signup(email: string, password: string, fullName: string, phoneNumber: string, role: string): Promise<{ success: boolean; message: string; userType: string }>;
  verifyOtp(email: string, otp: string, purpose: 'signup' | 'forgot-password'): Promise<{ success: boolean; message: string; userType?: string }>;
  resendOtp(email: string): Promise<{ success: boolean; message: string }>;
  forgotPassword(email: string, fullName: string, role: string): Promise<{ success: boolean; message: string }>;
  verifyOtpRecord(email: string, purpose: string): Promise<any | null>;
}