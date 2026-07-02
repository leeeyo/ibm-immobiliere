import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".webp": "image/webp",
};

function getUploadRoot() {
  return path.resolve(process.env.UPLOAD_ROOT || path.join(process.cwd(), "public", "uploads"));
}

function resolveUploadPath(parts: string[]) {
  const root = getUploadRoot();
  const resolved = path.resolve(root, ...parts);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return resolved;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const params = await context.params;
  const parts = params.path || [];
  const filePath = resolveUploadPath(parts);
  if (!filePath) return new NextResponse("Not found", { status: 404 });

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return new NextResponse("Not found", { status: 404 });

    const body = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(stat.size),
        "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
