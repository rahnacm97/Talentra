import { ICandidate } from '../../interfaces/users/candidate/ICandidate';
import { ICandidateRepository } from '../../interfaces/users/candidate/ICandidateRepository';
import { IUserRepository } from '../../interfaces/users/IUserRepository';
import { ILogger } from '../../interfaces/logger/ILogger';
import { IDatabaseAdapter } from '../../interfaces/users/candidate/ICandidateDatabase';
import CandidateModel from '../../models/Candidate';

export class MongooseCandidateAdapter implements IDatabaseAdapter {
  async findById(id: string): Promise<ICandidate | null> {
    return await CandidateModel.findById(id).lean();
  }

  async findOne(query: any): Promise<ICandidate | null> {
    return await CandidateModel.findOne(query).lean();
  }

  async create(candidateData: Partial<ICandidate>): Promise<ICandidate> {
    const candidate = new CandidateModel(candidateData);
    return await candidate.save();
  }

  async findAll(): Promise<ICandidate[]> {
    return await CandidateModel.find().lean();
  }

  async countDocuments(query: any): Promise<number> {
    return await CandidateModel.countDocuments(query);
  }

  async find(query: any, skip: number, limit: number, sort: any = {}): Promise<ICandidate[]> {
    return await CandidateModel.find(query).sort(sort).skip(skip).limit(limit).lean();
  }

  async updateBlockedStatus(id: string, blocked: boolean): Promise<ICandidate | null> {
    return await CandidateModel.findByIdAndUpdate(
      id,
      { blocked, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }

  async update(id: string, updateData: Partial<ICandidate>): Promise<ICandidate | null> {
    return await CandidateModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }
}

export class CandidateRepository implements ICandidateRepository, IUserRepository {
  constructor(
    private dbAdapter: IDatabaseAdapter,
    private logger: ILogger
  ) {}

  async findById(id: string): Promise<ICandidate | null> {
    try {
      return await this.dbAdapter.findById(id);
    } catch (error: any) {
      this.logger.error(`CandidateRepository findById error for ID ${id}: ${error.message}`, error);
      throw new Error('Failed to find candidate by ID');
    }
  }

  async findByEmail(email: string): Promise<ICandidate | null> {
    try {
      return await this.dbAdapter.findOne({ email });
    } catch (error: any) {
      this.logger.error(`CandidateRepository findByEmail error for email ${email}: ${error.message}`, error);
      throw new Error('Failed to find candidate by email');
    }
  }

  async create(candidateData: Partial<ICandidate>): Promise<ICandidate> {
    try {
      return await this.dbAdapter.create(candidateData);
    } catch (error: any) {
      this.logger.error('CandidateRepository create error:', error);
      throw new Error('Failed to create candidate');
    }
  }

  async findAll(): Promise<ICandidate[]> {
    try {
      return await this.dbAdapter.findAll();
    } catch (error: any) {
      this.logger.error('CandidateRepository findAll error:', error);
      throw new Error('Failed to fetch candidates');
    }
  }

  async countDocuments(query: any): Promise<number> {
    try {
      return await this.dbAdapter.countDocuments(query);
    } catch (error: any) {
      this.logger.error('CandidateRepository countDocuments error:', error);
      throw new Error('Failed to count candidates');
    }
  }

  async find(query: any, skip: number, limit: number, sort: any = {}): Promise<ICandidate[]> {
    try {
      return await this.dbAdapter.find(query, skip, limit, sort);
    } catch (error: any) {
      this.logger.error('CandidateRepository find error:', error);
      throw new Error('Failed to fetch candidates');
    }
  }

  async updateBlockedStatus(id: string, blocked: boolean): Promise<ICandidate | null> {
    try {
      return await this.dbAdapter.updateBlockedStatus(id, blocked);
    } catch (error: any) {
      this.logger.error(`CandidateRepository updateBlockedStatus error for ID ${id}: ${error.message}`, error);
      throw new Error('Failed to update blocked status');
    }
  }

  async update(id: string, updateData: Partial<ICandidate>): Promise<ICandidate | null> {
    try {
      const result = await this.dbAdapter.update(id, updateData);
      if (!result) {
        this.logger.error(`CandidateRepository update: No document found with ID ${id}`);
      }
      return result;
    } catch (error: any) {
      this.logger.error(`CandidateRepository update error for ID ${id}: ${error.message}`, error);
      throw new Error(`Failed to update candidate: ${error.message}`);
    }
  }
}