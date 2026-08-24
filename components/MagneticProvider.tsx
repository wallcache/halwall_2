"use client";

import { useEffect } from "react";
import { initMagnetic } from "@/lib/magnetic";

/** Mounts the single delegated magnetic listener for the whole app. */
export function MagneticProvider() {
  useEffect(() => initMagnetic(), []);
  return null;
}
