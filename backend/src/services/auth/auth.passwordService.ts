import { JwtService } from '../../utils/jwtUtils';
import { IEmailService } from '../../interfaces/auth/IEmailService';
import { IOtpService } from '../../interfaces/otp/IOtpService';
import { IPasswordService } from '../../interfaces/auth/IPasswordService';
import { IUserLookupService } from '../../interfaces/users/IUserLookupService';
import { IPasswordHasher } from '../../interfaces/utils/IPasswordHasher';
import { logger } from '../../utils/logger';

export class PasswordService implements IPasswordService {
  private userLookupService: IUserLookupService;
  private otpService: IOtpService;
  private emailService: IEmailService;
  private jwtService: JwtService;
  private passwordHasher: IPasswordHasher;

  constructor(
    userLookupService: IUserLookupService,
    otpService: IOtpService,
    emailService: IEmailService,
    jwtService: JwtService,
    passwordHasher: IPasswordHasher
  ) {
    this.userLookupService = userLookupService;
    this.otpService = otpService;
    this.emailService = emailService;
    this.jwtService = jwtService;
    this.passwordHasher = passwordHasher;
  }

  //Paswword Comparison
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      const isMatch = await this.passwordHasher.comparePassword(plainPassword, hashedPassword);
      logger.info(`Password comparison ${isMatch ? 'successful' : 'failed'} for plainPassword`);
      return isMatch;
    } catch (error: any) {
      logger.error(`Password comparison failed: ${error.message}`);
      throw new Error('Password comparison failed');
    }
  }

  //Forgot Password
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const userResult = await this.userLookupService.findByEmail(email);
      if (!userResult) {
        logger.error(`Forgot password: No account found with email ${email}`);
        throw new Error('No account found with this email');
      }
      const { user, role } = userResult;
      const result = await this.otpService.forgotPassword(email, user.name, role);
      return result;
    } catch (error: any) {
      logger.error(`Forgot password failed for email ${email}: ${error.message}`);
      throw new Error(error.message || 'Failed to initiate password reset');
    }
  }

  //Reset Password
  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const otpRecord = await this.otpService.verifyOtpRecord(email, 'forgot-password');
      if (!otpRecord) {
        logger.error(`Reset password: No OTP record found for email ${email}`);
        throw new Error('Invalid or missing OTP verification');
      }
      if (!otpRecord.isUsed) {
        logger.error(`Reset password: OTP not used for email ${email}`);
        throw new Error('Invalid or missing OTP verification');
      }
      if (otpRecord.expiresAt < new Date()) {
        logger.error(`Reset password: OTP expired for email ${email}`);
        throw new Error('OTP has expired');
      }

      const userResult = await this.userLookupService.findByEmail(email);
      if (!userResult) {
        logger.error(`Reset password: No account found with email ${email}`);
        throw new Error('No account found with this email');
      }

      const { user, role } = userResult;
      logger.info(`Reset password: Found user with email ${email}, ID: ${user._id}, role: ${role}`);

      const hashedPassword = await this.passwordHasher.hashPassword(newPassword);
      const updatedUser = await this.userLookupService.update(user._id.toString(), role, { password: hashedPassword });
      if (!updatedUser) {
        logger.error(`Reset password: Failed to update user with ID ${user._id} for email ${email}`);
        throw new Error('Failed to update password');
      }

      logger.info(`Reset password: Password updated successfully for email ${email}`);
      return { success: true, message: 'Password reset successfully' };
    } catch (error: any) {
      logger.error(`Reset password failed for email ${email}: ${error.message}`);
      throw new Error(error.message || 'Password reset failed');
    }
  }
}