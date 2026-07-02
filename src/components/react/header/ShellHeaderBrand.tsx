import { motion } from "motion/react";
import type { RefObject } from "react";
import type { ShellBrandIcon } from "./header-utils";

type Props = {
  brandIcon?: ShellBrandIcon;
  logoLabel: string;
  activeTitle: string;
  open: boolean;
  onToggle: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

export function ShellHeaderBrand({
  brandIcon,
  logoLabel,
  activeTitle,
  open,
  onToggle,
  triggerRef,
}: Props) {
  return (
    <motion.button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label={`${logoLabel} navigation`}
      onClick={onToggle}
      layout
      className="shell-brand-button motion-surface inline-flex items-center gap-3 px-3 py-2 text-left text-text"
    >
      <span className="shell-brand-badge motion-surface inline-flex h-8 w-8 items-center justify-center overflow-hidden">
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
        <span className="motion-soft ui-shell font-mono uppercase text-text">
          {logoLabel}
        </span>

        <span className="motion-soft ui-shell flex items-center gap-1 font-mono uppercase text-text-muted">
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
