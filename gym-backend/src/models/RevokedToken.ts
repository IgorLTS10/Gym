import { Schema, model } from 'mongoose';

interface IRevokedToken {
  token: string;
  createdAt: Date;
}

const revokedTokenSchema = new Schema<IRevokedToken>({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }, // Token will be removed after 1 hour
});

const RevokedToken = model<IRevokedToken>('RevokedToken', revokedTokenSchema);

export default RevokedToken;
