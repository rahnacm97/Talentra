import { Schema, model } from 'mongoose';
import { IAdmin } from '../interfaces/users/admin/IAdmin';

const adminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model<IAdmin>('Admin', adminSchema);