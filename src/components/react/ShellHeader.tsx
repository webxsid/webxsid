import { motion, useReducedMotion } from "motion/react";
import type { AnimationGeneratorType } from "motion/react";

type Props = {
  backHref?: string;
  backLabel?: string;
  logoHref?: string;
  logoLabel?: string;
};

export function ShellHeader({
  backHref,
  backLabel = "Back",
  logoHref = "/",
  logoLabel = "Webxsid",
}: Props) {
  const reduceMotion = useReducedMotion();

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as AnimationGeneratorType, stiffness: 280, damping: 30, mass: 0.8 };

  return (
    <motion.div layout className="flex items-center gap-3">
      <motion.div
        layout
        animate={{
          width: backHref ? 40 : 0,
          marginRight: backHref ? 0 : -12,
        }}
        transition={spring}
        className="overflow-hidden"
        aria-hidden={backHref ? undefined : "true"}
      >
        {backHref ? (
          <motion.a
            href={backHref}
            aria-label={backLabel}
            initial={false}
            transition={spring}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-bg text-text-muted transition-[transform,box-shadow] hover:border-border hover:text-text"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[14px] w-[14px]"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.a>
        ) : null}
      </motion.div>

      <motion.a
        href={logoHref}
        aria-label={logoLabel}
        layout
        transition={spring}
        className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-bg  px-3 py-2 text-text transition-[transform,box-shadow]"
      >
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-bg font-mono text-[11px] uppercase tracking-[0.24em] text-text"
        >
          WX
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-muted">
          {logoLabel}
        </span>
      </motion.a>
    </motion.div>
  );
}
