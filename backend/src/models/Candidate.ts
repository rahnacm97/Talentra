import { Schema, model } from 'mongoose';
import { ICandidate } from '../interfaces/users/candidate/ICandidate';

const candidateSchema = new Schema<ICandidate>({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  resume: { type: String },
  skills: [{ type: String }],
  experience: [{
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
  }],
  education: [{
    institution: String,
    degree: String,
    startDate: Date,
    endDate: Date,
  }],
  jobPreferences: {
    location: String,
    jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'remote'] },
    salaryExpectation: Number,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  blocked: { type: Boolean, default: false },
});

export default model<ICandidate>('Candidate', candidateSchema);