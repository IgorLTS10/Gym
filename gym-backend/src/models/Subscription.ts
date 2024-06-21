import { Schema, model, Document } from 'mongoose';

interface ISubscription extends Document {
  userId: Schema.Types.ObjectId;
  type: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  price: number;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  price: { type: Number, required: true },  // Nouveau champ pour le prix
});

const Subscription = model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
