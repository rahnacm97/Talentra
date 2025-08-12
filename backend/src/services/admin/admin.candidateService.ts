import { ICandidate } from '../../interfaces/users/candidate/ICandidate';
import { ICandidateRepository } from '../../interfaces/users/candidate/ICandidateRepository';
import { ILogger } from '../../interfaces/logger/ILogger';
import { ISocketEventHandler } from '../../interfaces/socket/ISocketEventHandler';

export class AdminCandidateService {
  constructor(
    private candidateRepository: ICandidateRepository,
    private logger: ILogger,
    private socketEventHandler: ISocketEventHandler
  ) {}

  //Candidates
  async getAllCandidates(page: number, limit: number, search: string): Promise<{ data: ICandidate[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
      const total = await this.candidateRepository.countDocuments(query);
      const data = await this.candidateRepository.find(query, skip, limit, { createdAt: -1 });
      return { data, total };
    } catch (error: any) {
      this.logger.error(`AdminCandidateService getAllCandidates error: ${error.message}`, error);
      throw new Error('Failed to fetch candidates');
    }
  }

  //Single Candidate
  async getCandidateById(id: string): Promise<ICandidate | null> {
    try {
      return await this.candidateRepository.findById(id);
    } catch (error: any) {
      this.logger.error(`AdminCandidateService getCandidateById error for ID ${id}: ${error.message}`, error);
      throw new Error('Failed to fetch candidate details');
    }
  }

  async toggleCandidateBlocked(id: string, blocked: boolean): Promise<ICandidate | null> {
    try {
      const candidate = await this.candidateRepository.updateBlockedStatus(id, blocked);
      if (candidate && blocked) {
        this.socketEventHandler.emitUserBlocked(id);
      }
      return candidate;
    } catch (error: any) {
      this.logger.error(`AdminCandidateService toggleCandidateBlocked error for ID ${id}: ${error.message}`, error);
      throw new Error('Failed to toggle candidate blocked status');
    }
  }
}