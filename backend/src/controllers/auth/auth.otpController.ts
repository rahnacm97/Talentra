import { Request, Response } from 'express';
import { IOtpService } from '../../interfaces/otp/IOtpService';
import { ResponseHandler } from '../../utils/response';
import { IValidator } from '../../interfaces/utils/IValidator';

export class AuthOtpController {
  private otpService: IOtpService;
  private validator: IValidator;

  constructor(otpService: IOtpService, validator: IValidator) {
    this.otpService = otpService;
    this.validator = validator;
  }

  signup = async (req: Request, res: Response) => {
    try {
      const { email, password, fullName, phoneNumber, role } = req.body;
      const validationResult = this.validator.validateSignup({ email, password, fullName, phoneNumber, role });
      if (!validationResult.isValid) {
        return ResponseHandler.sendErrorResponse(res, 400, validationResult.error || 'Invalid signup data');
      }

      const result = await this.otpService.signup(email, password, fullName, phoneNumber, role);
      return ResponseHandler.sendSuccessResponse(res, null, 'OTP sent to your email', { userType: result.userType });
    } catch (error: any) {
      return ResponseHandler.sendErrorResponse(res, 400, error.message || 'Signup failed');
    }
  };

  verify = async (req: Request, res: Response) => {
    try {
      const { email, otp, purpose = 'signup' } = req.body;
      const validationResult = this.validator.validateVerify({ email, otp, purpose });
      if (!validationResult.isValid) {
        return ResponseHandler.sendErrorResponse(res, 400, validationResult.error || 'Invalid verification data');
      }

      const result = await this.otpService.verifyOtp(email, otp, purpose);
      return ResponseHandler.sendSuccessResponse(res, null, result.message, { userType: result.userType });
    } catch (error: any) {
      return ResponseHandler.sendErrorResponse(res, 400, error.message || 'Verification failed');
    }
  };

  resendOtp = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const validationResult = this.validator.validateResendOtp({ email });
      if (!validationResult.isValid) {
        return ResponseHandler.sendErrorResponse(res, 400, validationResult.error || 'Invalid resend OTP data');
      }

      const result = await this.otpService.resendOtp(email);
      return ResponseHandler.sendSuccessResponse(res, null, result.message);
    } catch (error: any) {
      return ResponseHandler.sendErrorResponse(res, 400, error.message || 'Failed to resend OTP');
    }
  };
}