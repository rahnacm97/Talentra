import AdminModel from '../../models/Admin';
import { IAdmin } from '../../interfaces/users/admin/IAdmin';
import { IAdminDatabaseAdapter } from '../../interfaces/users/admin/IAdminDatabaseAdapter';
import { IAdminRepository } from '../../interfaces/users/admin/IAdminRepository';
import { logger } from '../../utils/logger';

export class MongooseAdminAdapter implements IAdminDatabaseAdapter {
  async findById(id: string): Promise<IAdmin | null> {
    return await AdminModel.findById(id);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return await AdminModel.findOne({ email });
  }

  async create(adminData: Partial<IAdmin>): Promise<IAdmin> {
    const admin = new AdminModel(adminData);
    return await admin.save();
  }
}

export class AdminRepository implements IAdminRepository {
  constructor(private adapter: IAdminDatabaseAdapter) {}

  async findById(id: string): Promise<IAdmin | null> {
    try {
      return await this.adapter.findById(id);
    } catch (error) {
      logger.error('AdminRepository findById error:', error);
      throw new Error('Failed to find admin by ID');
    }
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    try {
      return await this.adapter.findByEmail(email);
    } catch (error) {
      logger.error('AdminRepository findByEmail error:', error);
      throw new Error('Failed to find admin by email');
    }
  }

  async create(adminData: Partial<IAdmin>): Promise<IAdmin> {
    try {
      return await this.adapter.create(adminData);
    } catch (error) {
      logger.error('AdminRepository create error:', error);
      throw new Error('Failed to create admin');
    }
  }
}