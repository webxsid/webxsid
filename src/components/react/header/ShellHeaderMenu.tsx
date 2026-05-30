import { motion } from "motion/react";
import { globalNavItems } from "../../../lib/site-links";
import { isActivePath } from "./header-utils";

type Props = {
  activePath: string;
  open: boolean;
  onClose: () => void;
};

export function ShellHeaderMenu({ activePath, open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="absolute left-0 top-full z-20 mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-border/70 bg-bg p-2 shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
      <nav aria-label="Primary">
        <ul className="space-y-1">
          {globalNavItems.map((item) => {
            const active = isActivePath(activePath, item.href);

            return (
              <li key={item.href}>
                <motion.a
                  href={item.href}
                  initial={false}
                  onClick={onClose}
                  className={[
                    "flex items-center justify-between rounded-xl border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.24em] transition",
                    active
                      ? "border-border/80 bg-bg-elevated text-text"
                      : "border-transparent bg-bg text-text-muted hover:border-border/60 hover:bg-bg-elevated hover:text-text",
                  ].join(" ")}
                >
                  <span>{item.label}</span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[11px] w-[11px]"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </motion.a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
