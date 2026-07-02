import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { isActivePath } from "./header-utils";
import type { GlobalNavItem } from "../../../lib/site-links";
import type { RefObject } from "react";

type Props = {
  activePath: string;
  open: boolean;
  onClose: () => void;
  navItems: readonly GlobalNavItem[];
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

export function ShellHeaderMenu({
  activePath,
  open,
  onClose,
  navItems,
  triggerRef,
}: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTop, setMobileTop] = useState<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!open || !isMobile) return;

    const updatePosition = () => {
      const rect = triggerRef?.current?.getBoundingClientRect();
      if (!rect) return;
      setMobileTop(rect.bottom + 8);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, isMobile]);

  if (!open) return null;

  const panel = (
    <div
      data-shell-popup="true"
      className={[
        "shell-menu-panel motion-page z-50 p-2",
        isMobile
          ? "fixed left-1/2 w-[min(18rem,calc(100vw-1rem))] -translate-x-1/2"
          : "absolute left-0 top-full mt-2 w-[min(18rem,calc(100vw-1.5rem))]",
      ].join(" ")}
      style={isMobile && mobileTop !== null ? { top: `${mobileTop}px` } : undefined}
    >
      <nav aria-label="Primary">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActivePath(activePath, item.href);

            return (
              <li key={item.href}>
                <motion.a
                  href={item.href}
                  initial={false}
                  onClick={onClose}
                  className={[
                    "shell-menu-item motion-surface ui-shell flex items-center justify-between border px-3 py-2 font-mono uppercase",
                    active
                      ? "shell-item-active"
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

  return isMobile ? createPortal(panel, document.body) : panel;
}
