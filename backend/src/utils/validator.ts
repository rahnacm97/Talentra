
import { IValidator } from '../interfaces/utils/IValidator';

export class Validator implements IValidator {
  private validRoles = ['candidate', 'employer'];
  private validPurposes = ['signup', 'forgot-password'];

  validateSignup(data: { email: string; password: string; fullName: string; phoneNumber: string; role: string }): { isValid: boolean; error?: string } {
    const { email, password, fullName, phoneNumber, role } = data;
    if (!email || !password || !fullName || !phoneNumber || !role) {
      return { isValid: false, error: 'Email, password, full name, phone number, and role are required' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters' };
    }
    if (!this.validRoles.includes(role.toLowerCase())) {
      return { isValid: false, error: 'Invalid role' };
    }
    return { isValid: true };
  }

  validateVerify(data: { email: string; otp: string; purpose: string }): { isValid: boolean; error?: string } {
    const { email, otp, purpose } = data;
    if (!email || !otp || !purpose) {
      return { isValid: false, error: 'Email, OTP, and purpose are required' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    if (!/^\d{6}$/.test(otp)) {
      return { isValid: false, error: 'OTP must be a 6-digit number' };
    }
    if (!this.validPurposes.includes(purpose)) {
      return { isValid: false, error: 'Invalid purpose' };
    }
    return { isValid: true };
  }

  validateResendOtp(data: { email: string }): { isValid: boolean; error?: string } {
    const { email } = data;
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    return { isValid: true };
  }

  validateForgotPassword(data: { email: string }): { isValid: boolean; error?: string } {
    const { email } = data;
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    return { isValid: true };
  }

  validateResetPassword(data: { email: string; newPassword: string }): { isValid: boolean; error?: string } {
    const { email, newPassword } = data;
    if (!email || !newPassword) {
      return { isValid: false, error: 'Email and new password are required' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    if (newPassword.length < 6) {
      return { isValid: false, error: 'New password must be at least 6 characters' };
    }
    return { isValid: true };
  }
}