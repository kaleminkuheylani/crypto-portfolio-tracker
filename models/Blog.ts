import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  metaDescription: string;
  summary: string;
  htmlContent: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  keywords: string[];
  category: 'tahmin' | 'analiz' | 'haber';
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    metaDescription: { type: String, required: true },
    summary: { type: String, required: true },
    htmlContent: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'KriptoSavasi AI' },
    date: { type: String, required: true },
    readTime: { type: String, required: true },
    imageUrl: { type: String, required: true },
    tags: [{ type: String }],
    keywords: [{ type: String }],
    category: { type: String, enum: ['tahmin', 'analiz', 'haber'], required: true },
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 });
BlogSchema.index({ date: -1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ isPublished: 1, date: -1 });

export const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
