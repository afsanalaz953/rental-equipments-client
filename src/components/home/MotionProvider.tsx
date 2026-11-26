"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Wraps the marketing sections so framer-motion honours the user's
 * `prefers-reduced-motion` setting instead of forcing every animation.
 * Must be a client component because `MotionConfig` provides context.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
