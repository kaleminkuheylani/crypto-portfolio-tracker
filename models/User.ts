import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserGoogle extends Document {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserEmail extends Document {
  email: string;
  passwordHash: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserGoogleSchema = new Schema<IUserGoogle>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String },
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: { type: Date },
  },
  { timestamps: true }
);

const UserEmailSchema = new Schema<IUserEmail>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: { type: Date },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

UserGoogleSchema.index({ email: 1 });
UserGoogleSchema.index({ googleId: 1 });
UserEmailSchema.index({ email: 1 });

export const UserGoogle: Model<IUserGoogle> =
  mongoose.models.UserGoogle || mongoose.model<IUserGoogle>('UserGoogle', UserGoogleSchema);

export const UserEmail: Model<IUserEmail> =
  mongoose.models.UserEmail || mongoose.model<IUserEmail>('UserEmail', UserEmailSchema);
