import { ICandidate } from "../candidate/ICandidate";

export interface IAdminCandidateService {
  getAllCandidates(page: number, limit: number, search: string): Promise<{ data: ICandidate[]; total: number }>;
  getCandidateById(id: string): Promise<ICandidate | null>;
  toggleCandidateBlocked(id: string, blocked: boolean): Promise<ICandidate | null>;
}
