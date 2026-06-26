import { connectDB } from "@/lib/db/mongodb";
import { MetaCapiEvent } from "@/lib/models/MetaCapiEvent";

export type MetaCapiDiagnosticInput = {
  eventName: "Lead" | "Contact";
  eventId: string;
  source: "contact-form" | "property-lead" | "whatsapp" | "phone" | "email";
  status:
    | "success"
    | "http_error"
    | "network_error"
    | "skipped_disabled"
    | "skipped_missing_config";
  eventSourceUrl?: string;
  valueTnd?: number;
  httpStatus?: number;
  errorMessage?: string;
  eventsReceived?: number;
  fbtraceId?: string;
  graphVersion?: string;
  testEventCodeUsed?: boolean;
};

export async function recordMetaCapiDiagnostic(input: MetaCapiDiagnosticInput) {
  try {
    await connectDB();
    await MetaCapiEvent.create(input);
  } catch (error) {
    console.error(
      "[meta-capi] diagnostic write failed:",
      error instanceof Error ? error.message : error,
    );
  }
}
