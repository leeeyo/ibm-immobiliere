import "server-only";
import { createHash } from "node:crypto";
import { connectDB } from "@/lib/db/mongodb";
import { RateLimit } from "@/lib/models/RateLimit";
import type { IRateLimit } from "@/lib/models/RateLimit";

export function getRequestIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function consumeRateLimit({
  scope,
  identifier,
  limit,
  windowMs,
}: {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
}): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  await connectDB();
  const key = createHash("sha256")
    .update(`${scope}:${identifier}`)
    .digest("hex");
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  let record = (await RateLimit.findOneAndUpdate(
    { scope, key, resetAt: { $gt: now } },
    { $inc: { count: 1 } },
    { new: true }
  ).lean()) as IRateLimit | null;

  if (!record) {
    await RateLimit.deleteOne({ scope, key, resetAt: { $lte: now } });
    try {
      record = (await RateLimit.create({ scope, key, count: 1, resetAt })).toObject() as IRateLimit;
    } catch (error: any) {
      if (error?.code !== 11000) throw error;
      record = (await RateLimit.findOneAndUpdate(
        { scope, key },
        { $inc: { count: 1 } },
        { new: true }
      ).lean()) as IRateLimit | null;
    }
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((new Date(record!.resetAt).getTime() - Date.now()) / 1000)
  );
  return { allowed: record!.count <= limit, retryAfterSeconds };
}
