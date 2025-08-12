import { Document } from 'mongoose';

export interface IEmployer extends Document {
  _id: string;
  email: string;
  password: string;
  googleId: string,
  name: string;
  phoneNumber: string;
  companyDescription?: string;
  website?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  blocked: boolean;
  verified: boolean;
  organizationType: string;
  yearEstablishment: Date;
  regId: string;
  teamSize: string;
  industryType: string;
  rejectionReason?: string;
}