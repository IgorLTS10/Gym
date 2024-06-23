import mongoose, { Document, Schema } from 'mongoose';

export interface ICours extends Document {
  date: string;
  time: string;
  title: string;
  duration: number;
  coach: string;
  description?: string;
  capacity: number;
  participants: mongoose.Types.ObjectId[];
}

const CoursSchema: Schema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  coach: { type: String, required: true },
  description: { type: String },
  capacity: { type: Number, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Cours = mongoose.model<ICours>('Cours', CoursSchema);
export default Cours;
