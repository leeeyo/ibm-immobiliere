import { Schema, model, models } from 'mongoose';

export interface IPartner {
  name: string;
  logo: string;
  website: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    website: { type: String },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

PartnerSchema.index({ order: 1 });

export const Partner = models.Partner || model<IPartner>('Partner', PartnerSchema);
