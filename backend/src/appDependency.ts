import { Server } from 'socket.io';
import { ILogger } from './interfaces/logger/ILogger';
import { JwtService } from './utils/jwtUtils';
import SocketService from './services/socket/socketService';
import { SocketEventHandler } from './services/socket/SocketEventHandler';
import { AdminCandidateService } from './services/admin/admin.candidateService';
import { MongooseCandidateAdapter, CandidateRepository } from './repositories/candidate/candidateRepository';
import { AdminCandidateController } from './controllers/admin/admin.candidateController';
import { AdminAuthService } from './services/admin/admin.authService';
import { AuthService } from './services/auth/auth.authenticationService';
import { AdminRepository, MongooseAdminAdapter } from './repositories/admin/adminRepository';
import { AuthRepository, MongooseTokenStorage } from './repositories/auth/authRepository';
import { AdminController } from './controllers/admin/admin.authController';
import { AdminEmployerController } from './controllers/admin/admin.employerController';
import { EmployerRepository, MongooseEmployerAdapter } from './repositories/employer/employerRepository';
import { AdminEmployerService } from './services/admin/admin.employerService';
import { UserAuthService } from './services/auth/userAuthService';
import { TokenService } from './services/token/tokenService';
import { PasswordService } from './services/auth/auth.passwordService';
import { CandidateAuthRepository } from './repositories/candidate/candidateAuthRepository';
import { EmployerAuthRepository } from './repositories/employer/employerAuthRepository';
import { UserService } from './services/auth/userService';
import { EmailService } from './services/auth/emailService';
import { OtpService } from './services/auth/auth.otpService';
import { UserLookupService } from './services/auth/userLookUpService';
import { BcryptPasswordHasher } from './utils/passwordHasher';
import { OtpRepository } from './repositories/otp/otpRepository';
import { AuthRepositoryAdapter } from './repositories/auth/authRepositoryAdapter';
import { IEmailService } from './interfaces/auth/IEmailService'; 
import { ResponseFormatter, IResponseFormatter } from './interfaces/response/IResponseFormatter';

export interface AppDependencies {
  adminCandidateController: AdminCandidateController;
  adminController: AdminController;
  adminEmployerController: AdminEmployerController;
  socketService: SocketService;
}

export function initializeDependencies(io: Server, logger: ILogger): AppDependencies {

   const responseFormatter: IResponseFormatter = new ResponseFormatter();

  // Initialize core services
  const jwtService = new JwtService();
  const socketService = new SocketService(io, jwtService);
  const socketEventHandler = new SocketEventHandler(socketService, logger);

  // Initialize auth dependencies
  const tokenStorage = new MongooseTokenStorage();
  const authRepository = new AuthRepository(tokenStorage);
  const tokenService = new TokenService(jwtService, new AuthRepositoryAdapter(authRepository));
  const candidateRepository = new CandidateRepository(new MongooseCandidateAdapter(), logger);
  const employerRepository = new EmployerRepository(new MongooseEmployerAdapter(), logger);
  const adminRepository = new AdminRepository(new MongooseAdminAdapter());
  const userRepositories = new Map<string, any>([
    ['candidate', new CandidateAuthRepository(candidateRepository)],
    ['employer', new EmployerAuthRepository(employerRepository)],
  ]);
  const userService = new UserService();
  const emailService: IEmailService = new EmailService(logger);
  const otpRepository = new OtpRepository();
  const otpService = new OtpService(userService, emailService, jwtService, otpRepository);
  const userLookupService = new UserLookupService(userRepositories);
  const passwordHasher = new BcryptPasswordHasher(10);
  const passwordService = new PasswordService(userLookupService, otpService, emailService, jwtService, passwordHasher);
  const userAuthService = new UserAuthService(userRepositories, adminRepository);
  const authService = new AuthService(userAuthService, tokenService, passwordService);

  // Initialize candidate-related dependencies
  const dbAdapter = new MongooseCandidateAdapter();
  const candidateRepository2 = new CandidateRepository(dbAdapter, logger);
  const adminCandidateService = new AdminCandidateService(candidateRepository2, logger, socketEventHandler);
  const adminCandidateController = new AdminCandidateController(adminCandidateService, logger, socketEventHandler, responseFormatter);

  // Initialize admin auth dependencies
  const adapter = new MongooseAdminAdapter();
  const adminRepository2 = new AdminRepository(adapter);
  const adminAuthService = new AdminAuthService(adminRepository2, authRepository, jwtService);
  const adminController = new AdminController(adminAuthService, authService, responseFormatter);


  // Initialize employer controller
  const dbEmployerAdapter = new MongooseEmployerAdapter();
  const employerRepository2 = new EmployerRepository(dbEmployerAdapter, logger);
  const adminEmployerService = new AdminEmployerService(employerRepository2, logger, socketEventHandler, emailService);
  const adminEmployerController = new AdminEmployerController(adminEmployerService, logger, socketEventHandler, responseFormatter);

  return {
    adminCandidateController,
    adminController,
    adminEmployerController,
    socketService,
  };
}