import { Schema, model } from 'mongoose';

interface IUser {
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
}

const userSchema = new Schema<IUser>({
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
});

const User = model<IUser>('User', userSchema);

export default User;
