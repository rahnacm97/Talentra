export interface IOtpRepository {
  create(otpData: any): Promise<any>;
  findOne(email: string, otp: string, purpose: string, isUsed: boolean): Promise<any | null>;
  updateOne(id: string, updateData: any): Promise<void>;
  findByEmailAndPurpose(email: string, purpose: string, isUsed?: boolean): Promise<any | null>;
}