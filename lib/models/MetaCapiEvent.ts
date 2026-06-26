import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

export const META_CAPI_EVENT_NAMES = ["Lead", "Contact"] as const;
export const META_CAPI_EVENT_SOURCES = [
  "contact-form",
  "property-lead",
  "whatsapp",
  "phone",
  "email",
] as const;
export const META_CAPI_EVENT_STATUSES = [
  "success",
  "http_error",
  "network_error",
  "skipped_disabled",
  "skipped_missing_config",
] as const;

const MetaCapiEventSchema = new Schema(
  {
    eventName: { type: String, enum: META_CAPI_EVENT_NAMES, required: true, index: true },
    eventId: { type: String, required: true, trim: true, index: true },
    source: { type: String, enum: META_CAPI_EVENT_SOURCES, required: true, index: true },
    status: { type: String, enum: META_CAPI_EVENT_STATUSES, required: true, index: true },
    eventSourceUrl: { type: String, trim: true },
    valueTnd: { type: Number },
    httpStatus: { type: Number },
    errorMessage: { type: String, trim: true },
    eventsReceived: { type: Number },
    fbtraceId: { type: String, trim: true },
    graphVersion: { type: String, trim: true },
    testEventCodeUsed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

MetaCapiEventSchema.index({ createdAt: -1 });

export type MetaCapiEventDoc = InferSchemaType<typeof MetaCapiEventSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const MetaCapiEvent =
  models.MetaCapiEvent || model("MetaCapiEvent", MetaCapiEventSchema);
