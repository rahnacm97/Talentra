import nodemailer from 'nodemailer';
import { config } from '../../config/env';
import { IEmailService } from '../../interfaces/auth/IEmailService';
import { ILogger } from '../../interfaces/logger/ILogger';

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor(private logger: ILogger) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string, fullName: string): Promise<void> {
    try {
      const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Workscape OTP Verification',
        text: `Dear ${fullName},\n\nYour OTP for Workscape account verification is: ${otp}\n\nThis OTP is valid for 1 minute.\n\nBest regards,\nWorkscape Team`,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error: any) {
      this.logger.error(`Failed to send OTP email: ${error.message}`);
      throw new Error('Failed to send OTP email');
    }
  }

  async sendVerificationEmail(email: string, name: string, verified: boolean, rejectionReason?: string): Promise<void> {
    try {
      const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: verified ? 'Employer Verification Approved' : 'Employer Verification Rejected',
        html: verified
          ? `
            <h1>Verification Approved</h1>
            <p>Dear ${name},</p>
            <p>Your employer account has been successfully verified. You can now access all features of our platform.</p>
            <p>Thank you for joining us!</p>
          `
          : `
            <h1>Verification Rejected</h1>
            <p>Dear ${name},</p>
            <p>We regret to inform you that your employer account verification was rejected.</p>
            <p><strong>Reason:</strong> ${rejectionReason}</p>
            <p>Please address the issue and try again or contact support for assistance.</p>
          `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.info(`Verification email sent to ${email}`);
    } catch (error: any) {
      this.logger.error(`EmailService sendVerificationEmail error for ${email}: ${error.message}`, error);
      throw new Error('Failed to send verification email');
    }
  }
}