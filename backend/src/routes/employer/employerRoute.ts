import { Router } from 'express';
import { EmployerController } from '../../controllers/employer/employerController';
import { authMiddleware } from '../../middleware/authMiddleware';
import { employerMiddleware } from '../../middleware/employerMiddleware';

const router = Router();
const employerController = new EmployerController();

// Employer routes
router.get('/profile',authMiddleware, employerMiddleware, employerController.getProfile);
router.put('/verification',authMiddleware, employerMiddleware, employerController.updateProfile);

export default router;