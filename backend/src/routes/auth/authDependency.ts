import { CandidateRepository, MongooseCandidateAdapter } from '../../repositories/candidate/candidateRepository';
import { EmployerRepository, MongooseEmployerAdapter } from '../../repositories/employer/employerRepository';
import { AdminRepository, MongooseAdminAdapter } from '../../repositories/admin/adminRepository';
import { AuthRepository, MongooseTokenStorage } from '../../repositories/auth/authRepository';
import { OtpRepository } from '../../repositories/otp/otpRepository';
import { JwtService } from '../../utils/jwtUtils';
import { UserService } from '../../services/auth/userService';
import { EmailService } from '../../services/auth/emailService';
import { OtpService } from '../../services/auth/auth.otpService';
import { PasswordService } from '../../services/auth/auth.passwordService';
import { GoogleAuthService } from '../../services/auth/auth.googleService';
import { UserLookupService } from '../../services/auth/userLookUpService';
import { BcryptPasswordHasher } from '../../utils/passwordHasher';
import { AuthController } from '../../controllers/auth/auth.authenticationController';
import { AuthGoogleController } from '../../controllers/auth/auth.googleController';
import { AuthPasswordController } from '../../controllers/auth/auth.passwordController';
import { AuthOtpController } from '../../controllers/auth/auth.otpController';
import { AuthRefreshTokenController } from '../../controllers/auth/auth.refreshTokenController';
import { Validator } from '../../utils/validator';
import { ResponseFormatter } from '../../interfaces/response/IResponseFormatter';
import { logger } from '../../utils/logger';
import { config } from '../../config/env';
import { GoogleOAuthProvider } from '../../utils/googleAuthProvider';
import { UserAuthService } from '../../services/auth/userAuthService';
import { TokenService } from '../../services/token/tokenService';
import { CandidateAuthRepository } from '../../repositories/candidate/candidateAuthRepository';
import { EmployerAuthRepository } from '../../repositories/employer/employerAuthRepository';
import { AuthRepositoryAdapter } from '../../repositories/auth/authRepositoryAdapter';
import { IAuthService } from '../../interfaces/auth/IAuthService';
import { IUserAuthRepository } from '../../interfaces/auth/IUserAuthRepository';
import { AuthService } from '../../services/auth/auth.authenticationService';

export interface IControllers {
  authController: AuthController;
  authGoogleController: AuthGoogleController;
  authPasswordController: AuthPasswordController;
  authOtpController: AuthOtpController;
  authRefreshTokenController: AuthRefreshTokenController;
}

export function initializeDependencies(): IControllers {
  // Initialize repositories
  const candidateRepository = new CandidateRepository(new MongooseCandidateAdapter(), logger);
  const employerRepository = new EmployerRepository(new MongooseEmployerAdapter(), logger);
  const adminRepository = new AdminRepository(new MongooseAdminAdapter());
  const userRepositories = new Map<string, IUserAuthRepository>([
    ['candidate', new CandidateAuthRepository(candidateRepository)],
    ['employer', new EmployerAuthRepository(employerRepository)],
  ]);
  const otpRepository = new OtpRepository();
  const authRepository = new AuthRepository(new MongooseTokenStorage());
  const tokenStorage = new AuthRepositoryAdapter(authRepository);

  // Initialize services
  const userService = new UserService();
  const emailService = new EmailService(logger);
  const jwtService = new JwtService();
  const otpService = new OtpService(userService, emailService, jwtService, otpRepository);
  const userLookupService = new UserLookupService(userRepositories as Map<string, any>);
  const passwordHasher = new BcryptPasswordHasher(10);
  const passwordService = new PasswordService(userLookupService, otpService, emailService, jwtService, passwordHasher);
  const oauthProvider = new GoogleOAuthProvider(config.googleClientId);
  const userAuthService = new UserAuthService(userRepositories, adminRepository);
  const tokenService = new TokenService(jwtService, tokenStorage);
  const authService = new AuthService(userAuthService, tokenService, passwordService);
  const googleAuthService = new GoogleAuthService(oauthProvider, userAuthService, tokenService);
  const validator = new Validator();
  const responseFormatter = new ResponseFormatter();

  // Initialize controllers
  const authController = new AuthController(authService, responseFormatter);
  const authGoogleController = new AuthGoogleController(googleAuthService);
  const authPasswordController = new AuthPasswordController(passwordService, validator, responseFormatter);
  const authOtpController = new AuthOtpController(otpService, validator);
  const authRefreshTokenController = new AuthRefreshTokenController(authService);

  return {
    authController,
    authGoogleController,
    authPasswordController,
    authOtpController,
    authRefreshTokenController,
  };
}