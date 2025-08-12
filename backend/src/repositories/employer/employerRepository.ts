import { IEmployer } from '../../interfaces/users/employer/IEmployer';
import { IEmployerRepository } from '../../interfaces/users/employer/IEmployerRepository';
import { IUserRepository } from '../../interfaces/users/IUserRepository';
import { ILogger } from '../../interfaces/logger/ILogger';
import { IEmployerDatabseAdapter } from '../../interfaces/users/employer/IEmployerDatabase';
import EmployerModel from '../../models/Employer';

export class MongooseEmployerAdapter implements IEmployerDatabseAdapter {
  async findById(id: string): Promise<IEmployer | null> {
    return await EmployerModel.findById(id).lean();
  }

  async findOne(query: any): Promise<IEmployer | null> {
    return await EmployerModel.findOne(query).lean();
  }

  async create(employerData: Partial<IEmployer>): Promise<IEmployer> {
    const employer = new EmployerModel(employerData);
    return await employer.save();
  }

  async findAll(): Promise<IEmployer[]> {
    return await EmployerModel.find().lean();
  }

  async countDocuments(query: any): Promise<number> {
    return await EmployerModel.countDocuments(query);
  }

  async find(query: any, skip: number, limit: number, sort: any = {}): Promise<IEmployer[]> {
    return await EmployerModel.find(query).sort(sort).skip(skip).limit(limit).lean();
  }

  async updateEmployerBlockedStatus(id: string, blocked: boolean): Promise<IEmployer | null> {
    return await EmployerModel.findByIdAndUpdate(
      id,
      { blocked, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }

  async update(id: string, updateData: Partial<IEmployer>): Promise<IEmployer | null> {
    return await EmployerModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }

  async verifyEmployer(id: string): Promise<IEmployer | null> {
    return await EmployerModel.findByIdAndUpdate(
      id,
      { verified: true, rejectionReason: null, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }

  async rejectEmployer(id: string, rejectionReason: string): Promise<IEmployer | null> {
    return await EmployerModel.findByIdAndUpdate(
      id,
      { verified: false, rejectionReason, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }
}

export class EmployerRepository implements IEmployerRepository, IUserRepository {
  constructor(
    private dbEmployerAdapter: IEmployerDatabseAdapter,
    private logger: ILogger
  ) {}

  async findById(id: string): Promise<IEmployer | null> {
    try {
      return await this.dbEmployerAdapter.findById(id);
    } catch (error: any) {
      this.logger.error(`EmployerRepository findById error for Id: ${id}: ${error.message}`, error);
      throw new Error('Failed to find employer by ID');
    }
  }

  async findByEmail(email: string): Promise<IEmployer | null> {
    try {
      return await this.dbEmployerAdapter.findOne({ email });
    } catch (error: any) {
      this.logger.error(`EmployerRepository findByEmail error for email ${email}: ${error.message}`, error);
      throw new Error('Failed to find employer by email');
    }
  }

  async create(employerData: Partial<IEmployer>): Promise<IEmployer> {
    try {
      return await this.dbEmployerAdapter.create(employerData);
    } catch (error: any) {
      this.logger.error(`EmployerRepository create error`, error);
      throw new Error('Failed to create Employer');
    }
  }

  async findAll(): Promise<IEmployer[]> {
    try {
      return await this.dbEmployerAdapter.findAll();
    } catch (error: any) {
      this.logger.error('EmployerRepository findAll error:', error);
      throw new Error('Failed to fetch Employers');
    }
  }

  async countDocuments(query: any): Promise<number> {
    try {
      return await this.dbEmployerAdapter.countDocuments(query);
    } catch (error: any) {
      this.logger.error(`EmployerRepository countDocuments error`, error);
      throw new Error('Failed to count employers');
    }
  }

  async find(query: any, skip: number, limit: number, sort: any = {}): Promise<IEmployer[]> {
    try {
      return await this.dbEmployerAdapter.find(query, skip, limit, sort);
    } catch (error: any) {
      this.logger.error(`EmployerRepository find error`, error);
      throw new Error('Failed to fetch employers');
    }
  }

  async updateEmployerBlockedStatus(id: string, blocked: boolean): Promise<IEmployer | null> {
    try {
      return await this.dbEmployerAdapter.updateEmployerBlockedStatus(id, blocked);
    } catch (error: any) {
      this.logger.error(`EmployerRepository updateEmployerBlockedStatus error for Id ${id}: ${error.message}`, error);
      throw new Error('Failed to update blocked status');
    }
  }

  async update(id: string, updateData: Partial<IEmployer>): Promise<IEmployer | null> {
    try {
      const result = await this.dbEmployerAdapter.update(id, updateData);
      if (!result) {
        this.logger.error(`EmployerRepository update: No document found with Id ${id}`);
      }
      return result;
    } catch (error: any) {
      this.logger.error(`EmployerRepository update error for Id ${id}: ${error.message}`, error);
      throw new Error(`Failed to update employer: ${error.message}`);
    }
  }

  async verifyEmployer(id: string): Promise<IEmployer | null> {
    try {
      const result = await this.dbEmployerAdapter.verifyEmployer(id);
      if (!result) {
        this.logger.error(`EmployerRepository verifyEmployer: No document found with Id ${id}`);
      }
      return result;
    } catch (error: any) {
      this.logger.error(`EmployerRepository verifyEmployer error for Id ${id}: ${error.message}`, error);
      throw new Error('Failed to verify employer');
    }
  }

  async rejectEmployer(id: string, rejectionReason: string): Promise<IEmployer | null> {
    try {
      const result = await this.dbEmployerAdapter.rejectEmployer(id, rejectionReason);
      if (!result) {
        this.logger.error(`EmployerRepository rejectEmployer: No document found with Id ${id}`);
      }
      return result;
    } catch (error: any) {
      this.logger.error(`EmployerRepository rejectEmployer error for Id ${id}: ${error.message}`, error);
      throw new Error('Failed to reject employer');
    }
  }
}