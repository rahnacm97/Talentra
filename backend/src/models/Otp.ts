import mongoose, { Schema } from 'mongoose';

const OtpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, required: true, enum: ['signup', 'forgot-password'] },
  isUsed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  token: { type: String, required: true, unique: true },
  fullName: { type: String,  },
  companyName: { type: String },
  phoneNumber: { type: String, },
  password: { type: String,  },
  userType: { type: String, required: false, enum: ['Candidate', 'Employer'] },
});

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

export default mongoose.model('Otp', OtpSchema);