"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Gallery } from "./Gallery";
import { unlockGallery, type UnlockState } from "@/app/actions";
import styles from "./GatedGallery.module.css";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submit} disabled={pending}>
      {pending ? "Checking…" : "Unlock"}
    </button>
  );
}

/**
 * The gate itself holds no secret. It posts to a server action, which sets an
 * httpOnly cookie; the images are then fetched through a route handler that
 * verifies that cookie on every request.
 */
export function GatedGallery({
  slug,
  count,
  name,
}: {
  slug: string;
  count: number;
  name: string;
}) {
  const [state, action] = useActionState<UnlockState, FormData>(unlockGallery, {});
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (state.ok) setUnlocked(true);
  }, [state.ok]);

  if (unlocked) {
    return (
      <Gallery
        items={Array.from({ length: count }, (_, i) => ({
          src: `/api/gated/${slug}/${slug}-hw${i + 1}.webp`,
          alt: `${name}, image ${i + 1}`,
        }))}
        initial={8}
      />
    );
  }

  return (
    <div className={styles.gate}>
      <p className={styles.lead}>
        This campaign work is shared under client agreement, so it sits behind a
        password. Ask me for it.
      </p>
      <form action={action} className={styles.form}>
        <input type="hidden" name="slug" value={slug} />
        <label className="sr-only" htmlFor={`pw-${slug}`}>
          Password for {name}
        </label>
        <input
          id={`pw-${slug}`}
          className={styles.input}
          type="password"
          name="password"
          autoComplete="off"
          placeholder="Password"
          required
        />
        <Submit />
      </form>
      {state.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}
    </div>
  );
}
