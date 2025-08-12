import { Request, Response } from 'express';
import { EmployerService } from '../../services/employer/employerService';
import { IAuth } from '../../interfaces/auth/IAuth';
import { IEmployerRepository } from '../../interfaces/users/employer/IEmployerRepository';
import { EmployerRepository, MongooseEmployerAdapter } from '../../repositories/employer/employerRepository';
import { logger } from '../../utils/logger';

interface AuthRequest extends Request {
  user?: IAuth;
}

export class EmployerController {
  private employerService: EmployerService;

  constructor(repository: IEmployerRepository = new EmployerRepository(new MongooseEmployerAdapter(), logger)) {
    this.employerService = new EmployerService(repository);
  }

  //Get employer profile
  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const employer = await this.employerService.getEmployerById(req.user.userId);
      if (!employer) {
        return res.status(404).json({ success: false, error: 'Employer not found' });
      }
      res.json({ success: true, data: employer });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch profile' });
    }
  };

  //Profile updation
  updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const { organizationType, industryType, yearEstablishment, regId, teamSize, website, location, companyDescription } = req.body;
      const updateData = { 
        organizationType, 
        industryType, 
        yearEstablishment: new Date(yearEstablishment), 
        regId, 
        teamSize,
        companyDescription, 
        website, 
        location, 
        verified: false 
      };
      const employer = await this.employerService.updateEmployer(req.user.userId, updateData);
      if (!employer) {
        return res.status(404).json({ success: false, error: 'Employer not found' });
      }
      res.json({ success: true, data: employer });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to update profile' });
    }
  };


}