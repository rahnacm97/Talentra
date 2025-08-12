import { ICandidate } from "./ICandidate";

export interface IDatabaseAdapter {
  findById(id: string): Promise<ICandidate | null>;
  findOne(query: any): Promise<ICandidate | null>;
  create(candidateData: Partial<ICandidate>): Promise<ICandidate>;
  findAll(): Promise<ICandidate[]>;
  countDocuments(query: any): Promise<number>;
  find(query: any, skip: number, limit: number, sort:any): Promise<ICandidate[]>;
  updateBlockedStatus(id: string, blocked: boolean): Promise<ICandidate | null>;
  update(id: string, updateData: Partial<ICandidate>): Promise<ICandidate | null>;
}