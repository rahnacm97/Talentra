import { Router } from 'express';
import { CandidateController } from '../../controllers/candidate/candidateController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();
const candidateController = new CandidateController();

// Candidate routes
router.get('/profile',authMiddleware,candidateController.getProfile);

export default router;