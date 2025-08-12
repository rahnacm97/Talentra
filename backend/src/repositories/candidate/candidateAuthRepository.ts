import { CandidateRepository } from '../../repositories/candidate/candidateRepository';
import { IUserAuthRepository } from '../../interfaces/auth/IUserAuthRepository';
import { logger } from '../../utils/logger';

export class CandidateAuthRepository implements IUserAuthRepository {
  private repository: CandidateRepository;

  constructor(repository: CandidateRepository) {
    this.repository = repository;
  }

  async findByEmail(email: string): Promise<{ _id: string; name: string; googleId?: string; password?: string; blocked?: boolean } | null> {
    try {
      const user = await this.repository.findByEmail(email);
      if (!user) return null;
      return {
        _id: user._id!.toString(), // Convert ObjectId to string
        name: user.name,
        googleId: user.googleId,
        blocked: user.blocked,
        password: user.password,
      };
    } catch (error: any) {
      logger.error(`CandidateAuthRepository findByEmail error for email ${email}: ${error.message}`);
      throw new Error('Failed to find candidate by email');
    }
  }

  async create(data: any): Promise<{ _id: string; name: string; googleId: string; blocked: boolean }> {
    try {
      const user = await this.repository.create(data);
      return {
        _id: user._id!.toString(), // Convert ObjectId to string
        name: user.name,
        googleId: user.googleId!,
        blocked: user.blocked || false,
      };
    } catch (error: any) {
      logger.error(`CandidateAuthRepository create error: ${error.message}`);
      throw new Error('Failed to create candidate');
    }
  }

  async update(id: string, data: any): Promise<{ _id: string; name: string; googleId: string; blocked: boolean } | null> {
    try {
      const user = await this.repository.update(id, data);
      if (!user) {
        logger.error(`CandidateAuthRepository update: No document found with ID ${id}`);
        return null;
      }
      return {
        _id: user._id!.toString(), // Convert ObjectId to string
        name: user.name,
        googleId: user.googleId!,
        blocked: user.blocked || false,
      };
    } catch (error: any) {
      logger.error(`CandidateAuthRepository update error for ID ${id}: ${error.message}`);
      throw new Error(`Failed to update candidate: ${error.message}`);
    }
  }
}