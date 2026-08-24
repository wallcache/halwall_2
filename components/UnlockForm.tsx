"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { unlockGallery, type UnlockState } from "@/app/actions";
import styles from "./GatedGallery.module.css";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submit} disabled={pending}>
      {pending ? "Checking…" : "Enter"}
    </button>
  );
}

/** Password gate rendered by a server component that has already decided the
 *  page is locked. Success refreshes so the server re-renders with the cookie. */
export function UnlockForm({ slug, label }: { slug: string; label: string }) {
  const [state, action] = useActionState<UnlockState, FormData>(unlockGallery, {});
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <div className={styles.gate}>
      <form action={action} className={styles.form}>
        <input type="hidden" name="slug" value={slug} />
        <label className="sr-only" htmlFor={`pw-${slug}`}>
          Password for {label}
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
