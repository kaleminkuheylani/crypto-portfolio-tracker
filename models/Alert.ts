import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  userType: 'google' | 'email';
  coinId: string;
  coinSymbol: string;
  coinImage: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    userType: { type: String, enum: ['google', 'email'], required: true },
    coinId: { type: String, required: true },
    coinSymbol: { type: String, required: true },
    coinImage: { type: String },
    targetPrice: { type: Number, required: true },
    condition: { type: String, enum: ['above', 'below'], required: true },
    isActive: { type: Boolean, default: true },
    isTriggered: { type: Boolean, default: false },
    triggeredAt: { type: Date },
  },
  { timestamps: true }
);

AlertSchema.index({ userId: 1, userType: 1 });
AlertSchema.index({ isActive: 1, isTriggered: 1 });

export const Alert: Model<IAlert> =
  mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
