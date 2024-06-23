import { Schema, model, Document, Types } from 'mongoose';

export interface HistoryDocument extends Document {
  user: Types.ObjectId;
  event: string;
  details: string;
  date: Date;
}

const historySchema = new Schema<HistoryDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: String, required: true },
  details: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const History = model<HistoryDocument>('History', historySchema);

export default History;
