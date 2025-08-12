import { IUserService } from '../../interfaces/users/IUserService';
import { IUserRepository } from '../../interfaces/users/IUserRepository';
import { CandidateRepository } from '../../repositories/candidate/candidateRepository';
import { EmployerRepository } from '../../repositories/employer/employerRepository';
import { MongooseCandidateAdapter } from '../../repositories/candidate/candidateRepository';
import { MongooseEmployerAdapter } from '../../repositories/employer/employerRepository';
import { logger } from '../../utils/logger';

export class UserService implements IUserService {
  private repositories: Map<string, IUserRepository>;

  constructor() {
    this.repositories = new Map<string, IUserRepository>([
      ['candidate', new CandidateRepository(new MongooseCandidateAdapter(), logger)],
      ['employer', new EmployerRepository(new MongooseEmployerAdapter(), logger)],
    ]);
  }

  async getUserByEmail(role: string, email: string): Promise<any | null> {
    const repository = this.repositories.get(role.toLowerCase());
    if (!repository) {
      throw new Error('Invalid role');
    }
    return await repository.findByEmail(email);
  }

  async createUser(data: { email: string; password: string; name: string; phoneNumber: string; role: string }): Promise<any> {
    const { email, password, name, phoneNumber, role } = data;
    const repository = this.repositories.get(role.toLowerCase());
    if (!repository) {
      throw new Error('Invalid role');
    }

    const userData: any = { email, password, name, phoneNumber };
    if (role.toLowerCase() === 'candidate') {
      userData.skills = [];
      userData.experience = [];
      userData.education = [];
      userData.jobPreferences = {};
    } else if (role.toLowerCase() === 'employer') {
      userData.companyDescription = '';
      userData.website = '';
    }

    return await repository.create(userData);
  }
}