export interface IValidator {
  validateSignup(data: { email: string; password: string; fullName: string; phoneNumber: string; role: string }): { isValid: boolean; error?: string };
  validateVerify(data: { email: string; otp: string; purpose: string }): { isValid: boolean; error?: string };
  validateResendOtp(data: { email: string }): { isValid: boolean; error?: string };
  validateForgotPassword(data: { email: string }): { isValid: boolean; error?: string };
  validateResetPassword(data: { email: string; newPassword: string }): { isValid: boolean; error?: string };
}