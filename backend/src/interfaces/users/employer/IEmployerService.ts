import { IEmployer } from './IEmployer';

export interface IEmployerService {
  getEmployerById(id: string): Promise<IEmployer | null>;

}