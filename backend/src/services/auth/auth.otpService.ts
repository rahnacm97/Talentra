import bcrypt from 'bcryptjs';
import { JwtService } from '../../utils/jwtUtils';
import { IEmailService } from '../../interfaces/auth/IEmailService';
import { IUserService } from '../../interfaces/users/IUserService';
import { IOtpService } from '../../interfaces/otp/IOtpService';
import { IOtpRepository } from '../../interfaces/otp/IOtpRepository';
import { logger } from '../../utils/logger';

// Strategy interface for handling OTP purposes
interface PurposeHandler {
  purpose: string;
  handleOtpVerification(otpRecord: any, userService: IUserService): Promise<{ success: boolean; message: string; userType?: string }>;
  prepareOtpData(email: string, otp: string, fullName: string, token: string, additionalData: any): any;
}

// Handler for signup purpose
class SignupPurposeHandler implements PurposeHandler {
  purpose = 'signup';

  async handleOtpVerification(otpRecord: any, userService: IUserService): Promise<{ success: boolean; message: string; userType?: string }> {
    const { fullName, phoneNumber, password, userType } = otpRecord;
    if (!userType) {
      throw new Error('User type is required for signup verification');
    }
    if (!password || !fullName || !phoneNumber) {
      throw new Error('Required user data (password, full name, or phone number) is missing');
    }

    const user = await userService.createUser({
      email: otpRecord.email,
      password,
      name: fullName,
      phoneNumber,
      role: userType.toLowerCase(),
    });
    if (!user) {
      throw new Error('User creation failed');
    }

    return { success: true, message: 'Email verified successfully', userType };
  }

  prepareOtpData(email: string, otp: string, fullName: string, token: string, additionalData: any): any {
    const { password, phoneNumber, userType } = additionalData;
    return {
      email,
      otp,
      purpose: this.purpose,
      expiresAt: new Date(Date.now() + 60 * 1000),
      token,
      fullName,
      phoneNumber,
      password,
      userType,
    };
  }
}

// Handler for forgot-password purpose
class ForgotPasswordPurposeHandler implements PurposeHandler {
  purpose = 'forgot-password';

  async handleOtpVerification(otpRecord: any, userService: IUserService): Promise<{ success: boolean; message: string; userType?: string }> {
    return { success: true, message: 'OTP verified successfully' };
  }

  prepareOtpData(email: string, otp: string, fullName: string, token: string, additionalData: any): any {
    return {
      email,
      otp,
      purpose: this.purpose,
      expiresAt: new Date(Date.now() + 60 * 1000),
      token,
      fullName,
    };
  }
}

export class OtpService implements IOtpService {
  private userService: IUserService;
  private emailService: IEmailService;
  private jwtService: JwtService;
  private otpRepository: IOtpRepository;
  private purposeHandlers: Map<string, PurposeHandler>;

  constructor(
    userService: IUserService,
    emailService: IEmailService,
    jwtService: JwtService,
    otpRepository: IOtpRepository
  ) {
    this.userService = userService;
    this.emailService = emailService;
    this.jwtService = jwtService;
    this.otpRepository = otpRepository;
    this.purposeHandlers = new Map<string, PurposeHandler>([
      ['signup', new SignupPurposeHandler()],
      ['forgot-password', new ForgotPasswordPurposeHandler()],
    ]);
  }

  private generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("generated otp", otp);
    return otp;
  }

  async signup(email: string, password: string, fullName: string, phoneNumber: string, role: string): Promise<{ success: boolean; message: string; userType: string }> {
    try {
      const handler = this.purposeHandlers.get('signup');
      if (!handler) {
        throw new Error('Invalid OTP purpose');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = this.generateOtp();
      const token = this.jwtService.generateToken({ email, role });
      const userType = role.charAt(0).toUpperCase() + role.slice(1);

      const otpData = handler.prepareOtpData(email, otp, fullName, token, {
        password: hashedPassword,
        phoneNumber,
        userType,
      });

      await this.otpRepository.create(otpData);
      await this.emailService.sendOtpEmail(email, otp, fullName);

      return { success: true, message: 'OTP sent to your email', userType: role };
    } catch (error: any) {
      logger.error(`Signup failed: ${error.message}`);
      throw new Error(error.message || 'Signup failed');
    }
  }

  async verifyOtp(email: string, otp: string, purpose: 'signup' | 'forgot-password'): Promise<{ success: boolean; message: string; userType?: string }> {
    try {
      const otpRecord = await this.otpRepository.findOne(email, otp, purpose, false);
      if (!otpRecord) {
        throw new Error('Invalid OTP');
      }
      if (otpRecord.expiresAt < new Date()) {
        throw new Error('OTP has expired');
      }

      const handler = this.purposeHandlers.get(purpose);
      if (!handler) {
        throw new Error('Invalid OTP purpose');
      }

      const result = await handler.handleOtpVerification(otpRecord, this.userService);
      await this.otpRepository.updateOne(otpRecord._id, { isUsed: true });

      return result;
    } catch (error: any) {
      logger.error(`OTP verification failed: ${error.message}`);
      throw new Error(error.message || 'Verification failed');
    }
  }

  async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const otpRecord = await this.otpRepository.findByEmailAndPurpose(email, 'signup', false);
      if (otpRecord && otpRecord.expiresAt > new Date()) {
        throw new Error('A valid OTP already exists. Please use it or wait for it to expire.');
      }

      const existingSignupData = otpRecord || (await this.otpRepository.findByEmailAndPurpose(email, 'signup'));
      if (!existingSignupData) {
        throw new Error('No signup data found for this email. Please sign up again.');
      }

      const { fullName, phoneNumber, password, userType } = existingSignupData;
      if (!userType) {
        throw new Error('User type is required for resending OTP');
      }

      const handler = this.purposeHandlers.get('signup');
      if (!handler) {
        throw new Error('Invalid OTP purpose');
      }

      const otp = this.generateOtp();
      const token = this.jwtService.generateToken({ email, role: userType.toLowerCase() });
      const otpData = handler.prepareOtpData(email, otp, fullName || 'User', token, {
        password,
        phoneNumber,
        userType,
      });

      if (otpRecord) {
        await this.otpRepository.updateOne(otpRecord._id, otpData);
      } else {
        await this.otpRepository.create(otpData);
      }

      await this.emailService.sendOtpEmail(email, otp, fullName || 'User');
      return { success: true, message: 'New OTP sent to your email' };
    } catch (error: any) {
      logger.error(`Resend OTP failed: ${error.message}`);
      throw new Error(error.message || 'Failed to resend OTP');
    }
  }

  async forgotPassword(email: string, fullName: string, role: string): Promise<{ success: boolean; message: string }> {
    try {
      const handler = this.purposeHandlers.get('forgot-password');
      if (!handler) {
        throw new Error('Invalid OTP purpose');
      }

      const otp = this.generateOtp();
      const token = this.jwtService.generateToken({ email, role, purpose: 'forgot-password' });
      const otpData = handler.prepareOtpData(email, otp, fullName, token, {});

      await this.otpRepository.create(otpData);
      await this.emailService.sendOtpEmail(email, otp, fullName);

      return { success: true, message: 'OTP sent to your email for password reset' };
    } catch (error: any) {
      logger.error(`Forgot password failed: ${error.message}`);
      throw new Error(error.message || 'Failed to initiate password reset');
    }
  }

  async verifyOtpRecord(email: string, purpose: string): Promise<any | null> {
    try {
      return await this.otpRepository.findByEmailAndPurpose(email, purpose, true);
    } catch (error: any) {
      logger.error(`Verify OTP record failed: ${error.message}`);
      throw new Error(error.message || 'Failed to verify OTP record');
    }
  }
}
