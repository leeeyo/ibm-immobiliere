import { createHash } from "crypto";
import { META_CURRENCY } from "@/lib/meta-pixel";
import { recordMetaCapiDiagnostic } from "@/lib/meta-capi-diagnostics";

export type MetaCapiBrowserEventName = "PageView" | "ViewContent" | "Search" | "Contact";

export type MetaCapiSource =
  | "contact-form"
  | "property-lead"
  | "whatsapp"
  | "phone"
  | "email";

type MetaCapiUserInput = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  dob?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  externalId?: string | null;
};

export type MetaCapiBaseInput = MetaCapiUserInput & {
  eventId: string;
  eventTimeSec: number;
  eventSourceUrl: string;
  value?: number;
  currency?: string;
  contentId?: string | null;
  contentIds?: string[];
  contentName?: string | null;
  contentCategory?: string | null;
  searchString?: string | null;
  customData?: Record<string, unknown>;
};

const MAX_EVENT_AGE_SEC = 7 * 24 * 60 * 60;

function capiGraphVersion(): string {
  return process.env.META_GRAPH_API_VERSION?.trim() || "v25.0";
}

function isServerTrackingDisabled(): boolean {
  const raw = (process.env.META_TRACKING_DISABLED ?? process.env.NEXT_PUBLIC_META_TRACKING_DISABLED)
    ?.trim()
    .toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

function getPixelId(): string | null {
  return process.env.META_PIXEL_ID?.trim() || process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || null;
}

function getAccessToken(): string | null {
  return process.env.META_ACCESS_TOKEN?.trim() || null;
}

function clampEventTime(eventTimeSec: number): number {
  const now = Math.floor(Date.now() / 1000);
  const safe = Number.isFinite(eventTimeSec) ? Math.floor(eventTimeSec) : now;
  const minAllowed = now - MAX_EVENT_AGE_SEC + 60;
  if (safe < minAllowed) return minAllowed;
  if (safe > now + 60) return now;
  return safe;
}

function normalizeClientIp(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let value = raw.trim();
  if (!value) return null;
  if (value.startsWith("[")) {
    const end = value.indexOf("]");
    if (end > 0) value = value.slice(1, end);
  } else if (value.includes(".") && value.lastIndexOf(":") > value.lastIndexOf(".")) {
    value = value.slice(0, value.lastIndexOf(":"));
  }
  return value.trim() || null;
}

function isPlausibleMetaEmail(normalized: string): boolean {
  if (normalized.length < 5 || normalized.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function normalizeEmailForMetaHash(email: string | null | undefined): string | null {
  if (!email?.trim()) return null;
  const value = email.trim().toLowerCase();
  return isPlausibleMetaEmail(value) ? value : null;
}

export function normalizeNameForMetaHash(name: string | null | undefined): string | null {
  if (!name?.trim()) return null;
  return name.trim().toLowerCase().replace(/[\s.'"`,-]+/g, "");
}

export function normalizeLocalityForMetaHash(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export function normalizeZipForMetaHash(zip: string | null | undefined): string | null {
  if (!zip?.trim()) return null;
  const value = zip.trim().toLowerCase().replace(/\s+/g, "");
  return value || null;
}

export function normalizeCountryForMetaHash(country: string | null | undefined): string | null {
  if (!country?.trim()) return null;
  const value = country.trim().toLowerCase();
  return /^[a-z]{2}$/.test(value) ? value : null;
}

export function normalizeDobForMetaHash(dob: string | null | undefined): string | null {
  if (!dob?.trim()) return null;
  const raw = dob.trim();
  if (/^\d{8}$/.test(raw)) return raw;

  const ymd = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymd) {
    const [, y, m, d] = ymd;
    return `${y}${m.padStart(2, "0")}${d.padStart(2, "0")}`;
  }

  const dmy = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const day = d.padStart(2, "0");
    const month = m.padStart(2, "0");
    if (Number(day) >= 1 && Number(day) <= 31 && Number(month) >= 1 && Number(month) <= 12) {
      return `${y}${month}${day}`;
    }
  }

  return null;
}

export function normalizeTnPhoneForMeta(phone: string | null | undefined): string | null {
  if (!phone?.trim()) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 8) return `216${digits}`;
  if (digits.startsWith("216") && digits.length >= 11) return digits;
  if (digits.length >= 10) return digits;
  return null;
}

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function addHashArray(
  userData: Record<string, string | string[]>,
  key: string,
  value: string | null,
) {
  if (value) userData[key] = [sha256Hex(value)];
}

function buildUserData(input: MetaCapiUserInput, includeEmail = true) {
  const userData: Record<string, string | string[]> = {};

  if (includeEmail) addHashArray(userData, "em", normalizeEmailForMetaHash(input.email));
  addHashArray(userData, "ph", normalizeTnPhoneForMeta(input.phone));
  addHashArray(userData, "fn", normalizeNameForMetaHash(input.firstName));
  addHashArray(userData, "ln", normalizeNameForMetaHash(input.lastName));
  addHashArray(userData, "ct", normalizeLocalityForMetaHash(input.city));
  addHashArray(userData, "st", normalizeLocalityForMetaHash(input.state));
  addHashArray(userData, "zp", normalizeZipForMetaHash(input.zip));
  addHashArray(userData, "country", normalizeCountryForMetaHash(input.country));
  addHashArray(userData, "db", normalizeDobForMetaHash(input.dob));

  const clientIp = normalizeClientIp(input.clientIp);
  if (clientIp) userData.client_ip_address = clientIp;
  if (input.userAgent?.trim()) userData.client_user_agent = input.userAgent.trim();
  if (input.fbp?.trim()) userData.fbp = input.fbp.trim();
  if (input.fbc?.trim()) userData.fbc = input.fbc.trim();
  if (input.externalId?.trim()) userData.external_id = [input.externalId.trim()];

  return userData;
}

function buildCustomData(input: MetaCapiBaseInput) {
  const customData: Record<string, unknown> = {
    ...input.customData,
  };

  const contentIds = input.contentIds ?? (input.contentId ? [input.contentId] : undefined);
  if (contentIds?.length) customData.content_ids = contentIds;
  if (input.contentName?.trim()) customData.content_name = input.contentName.trim();
  if (input.contentCategory?.trim()) customData.content_category = input.contentCategory.trim();
  if (input.searchString?.trim()) customData.search_string = input.searchString.trim();
  if (typeof input.value === "number" && Number.isFinite(input.value)) {
    customData.value = Number(input.value);
    customData.currency = (input.currency ?? META_CURRENCY).toUpperCase();
  }

  return customData;
}

async function postMetaEvent(input: {
  eventName: MetaCapiBrowserEventName | "Lead";
  input: MetaCapiBaseInput;
  source?: MetaCapiSource;
  includeEmail?: boolean;
}) {
  const version = capiGraphVersion();
  const testCode = process.env.META_TEST_EVENT_CODE?.trim();
  const diagnosticBase =
    input.source && (input.eventName === "Lead" || input.eventName === "Contact")
      ? {
          eventName: input.eventName,
          eventId: input.input.eventId,
          source: input.source,
          eventSourceUrl: input.input.eventSourceUrl,
          valueTnd: input.input.value,
          graphVersion: version,
          testEventCodeUsed: Boolean(testCode),
        }
      : null;

  if (isServerTrackingDisabled()) {
    if (diagnosticBase) {
      await recordMetaCapiDiagnostic({ ...diagnosticBase, status: "skipped_disabled" });
    }
    return;
  }

  const token = getAccessToken();
  const pixelId = getPixelId();
  if (!token || !pixelId) {
    if (diagnosticBase) {
      await recordMetaCapiDiagnostic({ ...diagnosticBase, status: "skipped_missing_config" });
    }
    return;
  }

  const customData = buildCustomData(input.input);
  const body: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: clampEventTime(input.input.eventTimeSec),
        event_id: input.input.eventId,
        event_source_url: input.input.eventSourceUrl,
        action_source: "website",
        user_data: buildUserData(input.input, input.includeEmail ?? true),
        ...(Object.keys(customData).length > 0 ? { custom_data: customData } : {}),
      },
    ],
    access_token: token,
  };

  if (testCode) body.test_event_code = testCode;

  const url = new URL(
    `https://graph.facebook.com/${version}/${encodeURIComponent(pixelId)}/events`,
  );

  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        typeof payload?.error?.message === "string"
          ? payload.error.message
          : `${res.status} ${res.statusText}`;
      console.error(`[meta-capi] ${input.eventName} ${message} event_id=${input.input.eventId}`);
      if (diagnosticBase) {
        await recordMetaCapiDiagnostic({
          ...diagnosticBase,
          status: "http_error",
          httpStatus: res.status,
          errorMessage: message.slice(0, 500),
          fbtraceId: typeof payload?.fbtrace_id === "string" ? payload.fbtrace_id : undefined,
        });
      }
      return;
    }

    if (diagnosticBase) {
      await recordMetaCapiDiagnostic({
        ...diagnosticBase,
        status: "success",
        httpStatus: res.status,
        eventsReceived:
          typeof payload?.events_received === "number" ? payload.events_received : undefined,
        fbtraceId: typeof payload?.fbtrace_id === "string" ? payload.fbtrace_id : undefined,
      });
    }

    if (process.env.NODE_ENV !== "production" || testCode) {
      console.info(
        `[meta-capi] ${input.eventName} ok event_id=${input.input.eventId} received=${
          payload?.events_received ?? "?"
        } trace=${payload?.fbtrace_id ?? "?"}`,
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[meta-capi] ${input.eventName} network error event_id=${input.input.eventId}:`, message);
    if (diagnosticBase) {
      await recordMetaCapiDiagnostic({
        ...diagnosticBase,
        status: "network_error",
        errorMessage: message.slice(0, 500),
      });
    }
  }
}

export async function sendMetaCapiBrowserEvent(
  eventName: MetaCapiBrowserEventName,
  input: MetaCapiBaseInput,
  source?: MetaCapiSource,
) {
  await postMetaEvent({
    eventName,
    input,
    source,
    includeEmail: eventName !== "PageView",
  });
}

export async function sendMetaCapiLead(input: MetaCapiBaseInput) {
  await postMetaEvent({
    eventName: "Lead",
    input,
    source: "property-lead",
  });
}

export async function sendMetaCapiContact(
  input: MetaCapiBaseInput,
  source: Exclude<MetaCapiSource, "property-lead"> = "contact-form",
) {
  await postMetaEvent({
    eventName: "Contact",
    input,
    source,
  });
}
