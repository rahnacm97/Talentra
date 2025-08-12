import { Request, Response } from 'express';
import { CandidateService } from '../../services/candidate/candidateService';
import { IAuth } from '../../interfaces/auth/IAuth';
import { ICandidateRepository } from '../../interfaces/users/candidate/ICandidateRepository';
import { CandidateRepository, MongooseCandidateAdapter } from '../../repositories/candidate/candidateRepository';
import { logger } from '../../utils/logger';

interface AuthRequest extends Request {
  user?: IAuth;
}

export class CandidateController {
  private candidateService: CandidateService;

  constructor(repository: ICandidateRepository = new CandidateRepository(new MongooseCandidateAdapter(), logger)) {
    this.candidateService = new CandidateService(repository);
  }

  //Get candidate Profile
  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const candidate = await this.candidateService.getCandidateById(req.user.userId);
      if (!candidate) {
        return res.status(404).json({ success: false, error: 'Candidate not found' });
      }
      res.json({ success: true, data: candidate });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch profile' });
    }
  };


}