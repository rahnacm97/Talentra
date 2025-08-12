export interface IPasswordService {
  forgotPassword(email: string): Promise<{ success: boolean; message: string }>;
  resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }>;
  comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}