"use client";

import * as React from "react";
import { animate, useInView } from "framer-motion";

/** Count-up-Animation für Statistiken (Abschnitt 7). */
export function CountUp({
  to,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  React.useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent =
            prefix +
            value.toLocaleString("de-DE", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }) +
            suffix;
        }
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, prefix, suffix, decimals]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}
