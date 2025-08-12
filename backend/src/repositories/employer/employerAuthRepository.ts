import { EmployerRepository } from '../../repositories/employer/employerRepository';
import { IUserAuthRepository } from '../../interfaces/auth/IUserAuthRepository';
import { logger } from '../../utils/logger';

export class EmployerAuthRepository implements IUserAuthRepository {
  private repository: EmployerRepository;

  constructor(repository: EmployerRepository) {
    this.repository = repository;
  }

  async findByEmail(email: string): Promise<{ _id: string; name: string; googleId?: string;password?: string; blocked?: boolean; verified?: boolean; rejectionReason?:string } | null> {
    try {
      const user = await this.repository.findByEmail(email);
      console.log("Employer auth repo user", user);
      if (!user) return null;
      return {
        _id: user._id.toString(), 
        name: user.name,
        googleId: user.googleId,
        blocked: user.blocked,
        password: user.password,
        verified: user.verified,
        rejectionReason: user.rejectionReason,
      };
    } catch (error: any) {
      logger.error(`EmployerAuthRepository findByEmail error for email ${email}: ${error.message}`);
      throw new Error('Failed to find employer by email');
    }
  }

  async create(data: any): Promise<{ _id: string; name: string; googleId: string; blocked: boolean; verified?: boolean; rejectionReason?:string}> {
    try {
      const user = await this.repository.create(data);
      return {
        _id: user._id.toString(), 
        name: user.name,
        googleId: user.googleId!,
        blocked: user.blocked || false,
        verified: user.verified,
        rejectionReason: user.rejectionReason,
      };
    } catch (error: any) {
      logger.error(`EmployerAuthRepository create error: ${error.message}`);
      throw new Error('Failed to create employer');
    }
  }

  async update(id: string, data: any): Promise<{ _id: string; name: string; googleId: string; blocked: boolean; verified?: boolean; rejectionReason?:string} | null> {
    try {
      const user = await this.repository.update(id, data);
      if (!user) {
        logger.error(`EmployerAuthRepository update: No document found with ID ${id}`);
        return null;
      }
      return {
        _id: user._id.toString(),
        name: user.name,
        googleId: user.googleId!,
        blocked: user.blocked || false,
        verified: user.verified,
        rejectionReason: user.rejectionReason
      };
    } catch (error: any) {
      logger.error(`EmployerAuthRepository update error for ID ${id}: ${error.message}`);
      throw new Error(`Failed to update employer: ${error.message}`);
    }
  }
}