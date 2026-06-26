import { Schema, model, models } from "mongoose";

export interface IRateLimit {
  scope: string;
  key: string;
  count: number;
  resetAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    scope: { type: String, required: true },
    key: { type: String, required: true },
    count: { type: Number, required: true, default: 1 },
    resetAt: { type: Date, required: true },
  },
  { versionKey: false }
);

RateLimitSchema.index({ scope: 1, key: 1 }, { unique: true });
RateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit =
  models.RateLimit || model<IRateLimit>("RateLimit", RateLimitSchema);
