export interface Candidate {
  _id: string;
  email: string;
  name: string;
  resume?: string;
  skills: string[];
  experience: { company: string; role: string; startDate: Date; endDate?: Date }[];
  education: { institution: string; degree: string; startDate: Date; endDate?: Date }[];
  jobPreferences: { location?: string; jobType?: 'full-time' | 'part-time' | 'contract' | 'remote'; salaryExpectation?: number };
  createdAt: Date;
  updatedAt: Date;
  blocked: boolean;
}