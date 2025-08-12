import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { IEmployerRepository } from "../../interfaces/users/employer/IEmployerRepository";
import { ILogger } from "../../interfaces/logger/ILogger";
import { ISocketEventHandler } from "../../interfaces/socket/ISocketEventHandler";
import { IEmailService } from "../../interfaces/auth/IEmailService";

export class AdminEmployerService{
  constructor(
    private employerRepository: IEmployerRepository,
    private logger: ILogger,
    private socketEventHandler: ISocketEventHandler,
    private emailService: IEmailService,
  ){}

  //Employers
  async getAllEmployers(page: number, limit: number, search: string): Promise<{ data: IEmployer[]; total: number }>{
    try {
      const skip = (page - 1) * limit;
      const query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ],
      }
      const total = await this.employerRepository.countDocuments(query);
      const data = await this.employerRepository.find(query, skip, limit, { createdAt: -1 });
      return { data, total}
    } catch (error: any) {
      this.logger.error(`adminEmployerService getAllEmployers error: ${error.message}`, error);
      throw new Error('Failed to fetch employers');
    }
  }

  //Single Employer
  async getEmployerById(id: string): Promise<IEmployer | null> {
    try {
      return await this.employerRepository.findById(id);
    } catch (error: any) {
      this.logger.error(`AdminEmployerService getEmployerById error for id ${id}: ${error.message}`, error);
      throw new Error('Failed to fetch employer details');
    }
  }

  //Blocking
  async toggleEmployerBlocked(id: string, blocked: boolean): Promise<IEmployer | null> {
    try {
      const employer = await this.employerRepository.updateEmployerBlockedStatus(id, blocked);
      if(employer && blocked){
        this.socketEventHandler.emitUserBlocked(id);
      }
      return employer;
    } catch (error: any) {
      this.logger.error(`AdminEmployerService toggleEmployerBlocked error for id ${id}: ${error.message}`, error);
      throw new Error('Failed to toggle employer blocked status');
    }
  }

  //Employer Verification
  async verifyEmployer(id: string): Promise<IEmployer | null> {
    try {
      const employer = await this.employerRepository.verifyEmployer(id);
      if (employer) {
        this.socketEventHandler.emitEmployerVerified(id);
        await this.emailService.sendVerificationEmail(employer.email, employer.name, true);
      }
      return employer;
    } catch (error: any) {
      this.logger.error(`AdminEmployerService verifyEmployer error for id ${id}: ${error.message}`, error);
      throw new Error('Failed to verify employer');
    }
  }

  //Employer rejection
  async rejectEmployer(id: string, rejectionReason: string): Promise<IEmployer | null> {
    try {
      const employer = await this.employerRepository.rejectEmployer(id, rejectionReason);
      if (employer) {
        this.socketEventHandler.emitEmployerRejected(id, rejectionReason); 
        await this.emailService.sendVerificationEmail(employer.email, employer.name, false, rejectionReason);
      }
      return employer;
    } catch (error: any) {
      this.logger.error(`AdminEmployerService rejectEmployer error for id ${id}: ${error.message}`, error);
      throw new Error('Failed to reject employer');
    }
  }

}