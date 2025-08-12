import OtpModel from '../../models/Otp';
import { IOtpRepository } from '../../interfaces/otp/IOtpRepository';
import { logger } from '../../utils/logger';

export class OtpRepository implements IOtpRepository {
  async create(otpData: any): Promise<any> {
    try {
      return await OtpModel.create(otpData);
    } catch (error: any) {
      logger.error(`Failed to create OTP record: ${error.message}`);
      throw new Error('Failed to create OTP record');
    }
  }

  async findOne(email: string, otp: string, purpose: string, isUsed: boolean): Promise<any | null> {
    try {
      return await OtpModel.findOne({ email, otp, purpose, isUsed });
    } catch (error: any) {
      logger.error(`Failed to find OTP record: ${error.message}`);
      throw new Error('Failed to find OTP record');
    }
  }

  async updateOne(id: string, updateData: any): Promise<void> {
    try {
      await OtpModel.updateOne({ _id: id }, updateData);
    } catch (error: any) {
      logger.error(`Failed to update OTP record: ${error.message}`);
      throw new Error('Failed to update OTP record');
    }
  }

  async findByEmailAndPurpose(email: string, purpose: string, isUsed?: boolean): Promise<any | null> {
    try {
      const query: any = { email, purpose };
      if (isUsed !== undefined) {
        query.isUsed = isUsed;
      }
      return await OtpModel.findOne(query);
    } catch (error: any) {
      logger.error(`Failed to find OTP record by email and purpose: ${error.message}`);
      throw new Error('Failed to find OTP record by email and purpose');
    }
  }
}