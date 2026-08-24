"use server";

import { cookies } from "next/headers";
import { COOKIE_NAME, COOKIE_MAX_AGE, issueToken, gatingConfigured } from "@/lib/gated";

export interface UnlockState {
  error?: string;
  ok?: boolean;
}

export async function unlockGallery(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const slug = String(formData.get("slug") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!gatingConfigured()) {
    return { error: "This gallery is not configured. GALLERY_PASSWORD and GALLERY_SECRET are unset." };
  }

  const token = issueToken(slug, password);
  if (!token) return { error: "That password is not right." };

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return { ok: true };
}
