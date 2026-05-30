import { motion } from "motion/react";
import type { ShellBrandIcon } from "./header-utils";

type Props = {
  brandIcon?: ShellBrandIcon;
  logoLabel: string;
  activeTitle: string;
  open: boolean;
  onToggle: () => void;
};

export function ShellHeaderBrand({
  brandIcon,
  logoLabel,
  activeTitle,
  open,
  onToggle,
}: Props) {
  return (
    <motion.button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label={`${logoLabel} navigation`}
      onClick={onToggle}
      layout
      className="motion-surface inline-flex items-center gap-3 rounded-full border border-border/70 bg-bg px-3 py-2 text-left text-text cursor-pointer"
    >
      <span className="motion-surface inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-bg">
        {brandIcon ? (
          <img
            src={brandIcon.src}
            width={brandIcon.width ?? 64}
            height={brandIcon.height ?? 64}
            alt=""
            aria-hidden="true"
            decoding="async"
            loading="eager"
            className="h-full w-full object-contain"
          />
        ) : null}
      </span>

      <span className="flex flex-col items-start gap-0.5">
        <span className="motion-soft font-mono text-[11px] uppercase tracking-[0.32em] text-text">
          {logoLabel}
        </span>

        <span className="motion-soft flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.24em] text-text-muted">
          <span>{activeTitle}</span>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={[
              "h-[11px] w-[11px] transition-transform duration-150",
              open ? "rotate-90" : "rotate-0",
            ].join(" ")}
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </span>
    </motion.button>
  );
}
