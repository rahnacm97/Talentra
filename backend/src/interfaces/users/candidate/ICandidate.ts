import { Document } from 'mongoose';

export interface IExperience {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
}

export interface IEducation {
  institution: string;
  degree: string;
  startDate: Date;
  endDate?: Date;
}

export interface IJobPreferences {
  location?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'remote';
  salaryExpectation?: number;
}

export interface ICandidate extends Document {
  Iid: string;
  email: string;
  password: string;
  googleId: string,
  name: string;
  resume?: string;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  jobPreferences: IJobPreferences;
  createdAt: Date;
  updatedAt: Date;
  blocked: boolean;
}