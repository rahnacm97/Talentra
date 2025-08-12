import { Router } from 'express';
import { io } from '../../app';
import { logger } from '../../utils/logger';
import { authMiddleware } from '../../middleware/authMiddleware';
import { validateSigninInput, validateLogoutInput } from '../../middleware/validator/adminValidator';
import { adminMiddleware } from '../../middleware/adminMiddleware';
import { initializeDependencies, AppDependencies } from '../../appDependency';

export default function adminRoutes(): Router {
  // Initializing dependencies
  const dependencies: AppDependencies = initializeDependencies(io, logger);

  const { adminController, adminCandidateController, adminEmployerController } = dependencies;
  const router = Router();

  // Admin Routes
  router.post('/signin', validateSigninInput, adminController.signin);
  router.get('/candidates', authMiddleware, adminMiddleware, adminCandidateController.getAllCandidates.bind(adminCandidateController));
  router.get('/employers', authMiddleware, adminMiddleware, adminEmployerController.getAllEmployers.bind(adminEmployerController));
  router.patch('/candidates/:id/block', authMiddleware, adminMiddleware, adminCandidateController.toggleCandidateBlocked.bind(adminCandidateController));
  router.get('/candidates/:id/view', authMiddleware, adminMiddleware, adminCandidateController.getCandidateView.bind(adminCandidateController));
  router.patch('/employers/:id/block', authMiddleware, adminMiddleware, adminEmployerController.toggleEmployerBlocked.bind(adminEmployerController));
  router.get('/employers/:id/view', authMiddleware, adminMiddleware, adminEmployerController.getEmployerView.bind(adminEmployerController));
  router.patch('/employers/:id/verify', authMiddleware, adminMiddleware, adminEmployerController.verifyEmployer.bind(adminEmployerController));
  router.patch('/employers/:id/reject', authMiddleware, adminMiddleware, adminEmployerController.rejectEmployer.bind(adminEmployerController));
  router.post('/logout', authMiddleware, validateLogoutInput, adminController.logout);

  return router;
}
