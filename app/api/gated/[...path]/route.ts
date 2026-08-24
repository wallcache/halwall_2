import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyToken } from "@/lib/gated";

const ROOT = path.join(process.cwd(), "private-media");

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

/**
 * Serves gated media. Every request is checked; there is no path by which
 * these bytes leave the server without a valid token.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const segments = (await params).path ?? [];
  const [slug, ...rest] = segments;
  if (!slug || rest.length === 0) return new Response("Not found", { status: 404 });

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!verifyToken(slug, token)) {
    // 404 rather than 403: a locked gallery should not confirm what it holds.
    return new Response("Not found", { status: 404 });
  }

  // Resolve, then prove the result is still inside ROOT. Without this check a
  // crafted "../.." segment would read arbitrary files off the server.
  const target = path.resolve(ROOT, slug, ...rest);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const info = await stat(target);
    if (!info.isFile()) return new Response("Not found", { status: 404 });

    const stream = Readable.toWeb(createReadStream(target)) as ReadableStream;
    return new Response(stream, {
      headers: {
        "Content-Type": TYPES[path.extname(target).toLowerCase()] ?? "application/octet-stream",
        "Content-Length": String(info.size),
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
