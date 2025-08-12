import { IEmployer } from '../employer/IEmployer';
import { IUserRepository } from '../IUserRepository';

export interface IEmployerRepository extends IUserRepository {
  findById(id: string): Promise<IEmployer | null>;
  findAll(): Promise<IEmployer[]>;
  countDocuments(query: any): Promise<number>;
  find(query: any, skip: number, limit: number, sort:any): Promise<IEmployer[]>;
  updateEmployerBlockedStatus(id: string, blocked: boolean): Promise<IEmployer | null>;
  update(id: string, updateData: Partial<IEmployer>): Promise<IEmployer | null>;
  verifyEmployer(id: string): Promise<IEmployer | null>;
  rejectEmployer(id: string, rejectionReason: string): Promise<IEmployer | null>;
}