import { IEmployerService } from '../../interfaces/users/employer/IEmployerService';
import { IEmployerRepository } from '../../interfaces/users/employer/IEmployerRepository';
import { IEmployer } from '../../interfaces/users/employer/IEmployer';
import { logger } from '../../utils/logger';

export class EmployerService implements IEmployerService {
  constructor(private repository: IEmployerRepository) {}

  async getEmployerById(id: string): Promise<IEmployer | null> {
    try {
      const employer = await this.repository.findById(id);
      if (!employer) {
        logger.info(`Employer not found for id: ${id}`);
      }
      return employer;
    } catch (error: any) {
      logger.error(`Failed to get employer by id ${id}: ${error.message}`);
      throw new Error(`Failed to get employer: ${error.message}`);
    }
  }

  async updateEmployer(id: string, updateData: Partial<IEmployer>): Promise<IEmployer | null> {
    try {
      const employer = await this.repository.update(id, updateData);
      if (!employer) {
        logger.info(`Employer not found for id: ${id}`);
      }
      return employer;
    } catch (error: any) {
      logger.error(`Failed to update employer by id ${id}: ${error.message}`);
      throw new Error(`Failed to update employer: ${error.message}`);
    }
  }

}