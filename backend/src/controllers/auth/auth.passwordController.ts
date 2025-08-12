// import { Request, Response } from 'express';
// import { IPasswordService } from '../../interfaces/auth/IPasswordService';
// import { IValidator } from '../../interfaces/utils/IValidator';
// import { IResponseFormatter } from '../../interfaces/response/IResponseFormatter';

// export class AuthPasswordController {
//   private passwordService: IPasswordService;
//   private validator: IValidator;
//   private responseFormatter: IResponseFormatter;

//   constructor(passwordService: IPasswordService, validator: IValidator, responseFormatter: IResponseFormatter) {
//     this.passwordService = passwordService;
//     this.validator = validator;
//     this.responseFormatter = responseFormatter;
//   }

//   forgotPassword = async (req: Request, res: Response) => {
//     try {
//       const { email } = req.body;
//       const validationResult = this.validator.validateForgotPassword({ email });
//       if (!validationResult.isValid) {
//         return this.responseFormatter.formatError(res, 400, validationResult.error || 'Invalid email');
//       }

//       const result = await this.passwordService.forgotPassword(email);
//       return this.responseFormatter.formatSuccess(res, result.message);
//     } catch (error: any) {
//       return this.responseFormatter.formatError(res, 400, error.message || 'Failed to initiate password reset');
//     }
//   };

//   resetPassword = async (req: Request, res: Response) => {
//     try {
//       const { email, newPassword } = req.body;
//       const validationResult = this.validator.validateResetPassword({ email, newPassword });
//       if (!validationResult.isValid) {
//         return this.responseFormatter.formatError(res, 400, validationResult.error || 'Invalid reset password data');
//       }

//       const result = await this.passwordService.resetPassword(email, newPassword);
//       return this.responseFormatter.formatSuccess(res, result.message);
//     } catch (error: any) {
//       return this.responseFormatter.formatError(res, 400, error.message || 'Password reset failed');
//     }
//   };
// }

import { Request, Response, NextFunction } from 'express';
import { IPasswordService } from '../../interfaces/auth/IPasswordService';
import { IValidator } from '../../interfaces/utils/IValidator';
import { IResponseFormatter } from '../../interfaces/response/IResponseFormatter';
import { logger } from '../../utils/logger';

export class AuthPasswordController {
  constructor(
    private passwordService: IPasswordService,
    private validator: IValidator,
    private responseFormatter: IResponseFormatter
  ) {}

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      logger.info(`Forgot password request for email: ${email}`);
      const validationResult = this.validator.validateForgotPassword({ email });
      if (!validationResult.isValid) {
        logger.warn(`Validation failed for forgot password: ${validationResult.error}`);
        return this.responseFormatter.formatError(res, 400, validationResult.error || 'Invalid email');
      }

      const result = await this.passwordService.forgotPassword(email);
      return this.responseFormatter.formatSuccess(res, result.message);
    } catch (error: any) {
      logger.error(`Forgot password error: ${error.message}`);
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, newPassword } = req.body;
      logger.info(`Reset password request for email: ${email}`);
      const validationResult = this.validator.validateResetPassword({ email, newPassword });
      if (!validationResult.isValid) {
        logger.warn(`Validation failed for reset password: ${validationResult.error}`);
        return this.responseFormatter.formatError(res, 400, validationResult.error || 'Invalid reset password data');
      }

      const result = await this.passwordService.resetPassword(email, newPassword);
      return this.responseFormatter.formatSuccess(res, result.message);
    } catch (error: any) {
      logger.error(`Reset password error: ${error.message}`);
      next(error);
    }
  };
}