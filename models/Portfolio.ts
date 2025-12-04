import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPortfolioItem {
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  buyPrice: number;
  addedAt: Date;
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  userType: 'google' | 'email';
  items: IPortfolioItem[];
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema = new Schema<IPortfolioItem>(
  {
    coinId: { type: String, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
    amount: { type: Number, required: true },
    buyPrice: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, refPath: 'userType' },
    userType: { type: String, enum: ['google', 'email'], required: true },
    items: [PortfolioItemSchema],
  },
  { timestamps: true }
);

PortfolioSchema.index({ userId: 1, userType: 1 }, { unique: true });

export const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
