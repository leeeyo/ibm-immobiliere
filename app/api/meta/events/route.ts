import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  sendMetaCapiBrowserEvent,
  type MetaCapiBrowserEventName,
  type MetaCapiSource,
} from "@/lib/meta-capi";
import { resolveMetaEventSourceUrl } from "@/lib/meta-event-source";
import { META_CURRENCY } from "@/lib/meta-pixel";

const eventSchema = z.object({
  eventName: z.enum(["PageView", "ViewContent", "Search", "Contact"]),
  eventId: z.string().trim().min(1).max(160),
  source: z
    .enum(["page-view", "view-content", "search", "whatsapp", "phone", "email"])
    .optional(),
  contentId: z.string().trim().max(160).optional(),
  contentIds: z.array(z.string().trim().max(160)).max(50).optional(),
  contentName: z.string().trim().max(256).optional(),
  contentCategory: z.string().trim().max(128).optional(),
  searchString: z.string().trim().max(256).optional(),
  value: z.number().min(0).optional(),
  currency: z.string().trim().max(8).optional(),
  customData: z.record(z.string(), z.unknown()).optional(),
  meta: z
    .object({
      fbp: z.string().trim().max(256).optional(),
      fbc: z.string().trim().max(512).optional(),
      eventSourceUrl: z.string().trim().max(2048).optional(),
    })
    .optional(),
});

const sourceMap: Record<string, MetaCapiSource | undefined> = {
  whatsapp: "whatsapp",
  phone: "phone",
  email: "email",
};

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip");
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = eventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid Meta event payload" }, { status: 400 });
  }

  const event = parsed.data;
  await sendMetaCapiBrowserEvent(
    event.eventName as MetaCapiBrowserEventName,
    {
      eventId: event.eventId,
      eventTimeSec: Math.floor(Date.now() / 1000),
      eventSourceUrl: resolveMetaEventSourceUrl(event.meta?.eventSourceUrl),
      value: event.value,
      currency: event.currency ?? META_CURRENCY,
      contentId: event.contentId,
      contentIds: event.contentIds,
      contentName: event.contentName,
      contentCategory: event.contentCategory,
      searchString: event.searchString,
      customData: event.customData,
      clientIp: getClientIp(req),
      userAgent: req.headers.get("user-agent"),
      fbp: event.meta?.fbp,
      fbc: event.meta?.fbc,
      country: "tn",
    },
    sourceMap[event.source ?? ""],
  );

  return NextResponse.json({ ok: true });
}
