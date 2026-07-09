"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Reusable motion primitives. Use in service of the chosen art direction (see
 * ai/design-language.md §5): a calm direction uses slow Reveals and nothing
 * else; a bold one uses the full kit. `prefers-reduced-motion` is honored
 * globally in app/globals.css — never rely on motion to convey information.
 */

/** Fade + rise into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.7,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  // Reduced-motion: render at the destination, no JS tween (the CSS block in
  // globals.css can't stop framer's JS-driven values — this does).
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={reduce || inView ? { opacity: 1, y: 0 } : {}}
      transition={reduce ? { duration: 0 } : { duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Count up to a numeric value when scrolled into view. */
export function CountUp({
  to,
  suffix = "",
  decimals = 0,
  separator = false,
  className,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
  /** Thousands separator. Off by default — a year (2001) must not become "2,001". */
  separator?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // amount-based visibility is far more reliable than a pixel margin on small
  // viewports — a margin trigger can be skipped on mobile, leaving counters at 0.
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to); // reduced-motion: jump straight to the final value, no tween
      return;
    }
    let raf = 0;
    let start = 0;
    const dur = 1400;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(to); // guarantee the exact final value
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);

  const rounded = decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));
  const display = separator
    ? Number(rounded).toLocaleString()
    : rounded;

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

/** Parallax translate-Y based on scroll progress through the element. */
export function useParallax(distance = 120): {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  return { ref, y };
}

/** Magnetic hover — element drifts toward the cursor. Energetic directions only. */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Marquee — a horizontally scrolling banner. Children are duplicated so the
 * loop is seamless (the keyframe translates -50%). Drives kinetic banners in
 * bold directions. Uses the `animate-marquee` utility from globals.css.
 */
export function Marquee({
  children,
  className,
  itemClassName,
}: {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div className="flex w-max animate-marquee">
        <div className={`flex shrink-0 ${itemClassName ?? ""}`}>{children}</div>
        <div className={`flex shrink-0 ${itemClassName ?? ""}`} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Skew — a slanted chip/box that keeps its text upright (outer -skew, inner
 * +skew). The kinetic-chip device for bold/expressive directions.
 */
export function Skew({
  children,
  angle = 12,
  className,
}: {
  children: React.ReactNode;
  angle?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block ${className ?? ""}`}
      style={{ transform: `skewX(-${angle}deg)` }}
    >
      <span className="inline-block" style={{ transform: `skewX(${angle}deg)` }}>
        {children}
      </span>
    </span>
  );
}
