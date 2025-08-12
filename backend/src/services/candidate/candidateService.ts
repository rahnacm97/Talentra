import { ICandidateService } from '../../interfaces/users/candidate/ICandidateService';
import { ICandidateRepository } from '../../interfaces/users/candidate/ICandidateRepository';
import { ICandidate } from '../../interfaces/users/candidate/ICandidate';
import { logger } from '../../utils/logger';

export class CandidateService implements ICandidateService {
  constructor(private repository: ICandidateRepository) {}

  async getCandidateById(id: string): Promise<ICandidate | null> {
    try {
      const candidate = await this.repository.findById(id);
      if (!candidate) {
        logger.info(`Candidate not found for id: ${id}`);
      }
      return candidate;
    } catch (error: any) {
      logger.error(`Failed to get candidate by id ${id}: ${error.message}`);
      throw new Error(`Failed to get candidate: ${error.message}`);
    }
  }

}