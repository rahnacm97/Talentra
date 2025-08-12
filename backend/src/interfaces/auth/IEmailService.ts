export interface IEmailService {
  sendOtpEmail(email: string, otp: string, fullName: string): Promise<void>;
  sendVerificationEmail(email: string, name: string, verified: boolean, rejectionReason?: string): Promise<void>;
}