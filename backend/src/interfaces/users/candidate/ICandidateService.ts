import { ICandidate } from './ICandidate';

export interface ICandidateService {
  getCandidateById(id: string): Promise<ICandidate | null>;
  
}