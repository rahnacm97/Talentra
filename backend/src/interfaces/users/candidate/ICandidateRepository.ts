import { ICandidate } from '../candidate/ICandidate';
import { IUserRepository } from '../IUserRepository';

export interface ICandidateRepository extends IUserRepository {
  findById(id: string): Promise<ICandidate | null>;
  findAll(): Promise<ICandidate[]>;
  countDocuments(query: any): Promise<number>;
  find(query: any, skip: number, limit: number, sort:any): Promise<ICandidate[]>;
  updateBlockedStatus(id: string, blocked: boolean): Promise<ICandidate | null>;
  update(id: string, updateData: Partial<ICandidate>): Promise<ICandidate | null>;
}