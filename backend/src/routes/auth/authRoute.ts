import { Router } from 'express';
import { IControllers, initializeDependencies } from './authDependency';

const { authController, authGoogleController, authPasswordController, authOtpController, authRefreshTokenController } =
  initializeDependencies();

const router = Router();

// Authentication routes
router.post('/signup', authOtpController.signup);
router.post('/login', authController.login);
router.post('/verify', authOtpController.verify);
router.post('/refresh-token', authRefreshTokenController.refreshToken);
router.post('/logout', authController.logout);
router.post('/resend-otp', authOtpController.resendOtp);
router.post('/google-signin', authGoogleController.googleSignIn);
router.post('/forgot-password', authPasswordController.forgotPassword);
router.post('/reset-password', authPasswordController.resetPassword);

export default router;