import { Schema, model } from 'mongoose';
import { IEmployer } from '../interfaces/users/employer/IEmployer';

const employerSchema = new Schema<IEmployer>({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  companyDescription: { type: String, required: false },
  website: { type: String, required: false },
  location: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  blocked: { type: Boolean, default: false },
  verified: { type: Boolean, default: false},
  organizationType: { type: String, required: false},
  yearEstablishment: {type: Date, required: false},
  regId: { type: String, },
  teamSize: { type: String, required: false},
  industryType: { type: String, required: false},
  rejectionReason: { type: String, required: false },
});

export default model<IEmployer>('Employer', employerSchema);