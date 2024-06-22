import { Schema, model, Document, Types } from 'mongoose';

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'member' | 'admin';
  createdAt: Date;
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  subscription?: {
    plan: string;
    startDate: Date;
    endDate: Date;
    maxTrainings: number;
    usedTrainings: number;
  };
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  createdAt: { type: Date, default: Date.now },
  height: { type: Number },
  weight: { type: Number },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  bio: { type: String },
  subscription: {
    plan: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    maxTrainings: { type: Number },
    usedTrainings: { type: Number },
  },
});

const User = model<UserDocument>('User', userSchema);

export default User;
