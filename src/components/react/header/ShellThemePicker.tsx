import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import type { RefObject } from "react";
import {
  themeFamilies,
  themeModes,
  type ThemeFamily,
  type ThemeMode,
} from "./header-utils";

type Props = {
  activeFamily: ThemeFamily;
  activeMode: ThemeMode;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelectFamily: (theme: ThemeFamily) => void;
  onSelectMode: (mode: ThemeMode) => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

const modeIcons = {
  system: SystemIcon,
  light: SunIcon,
  dark: MoonIcon,
} as const;

function ThemePickerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.95"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="7.54"
        y="5.07"
        width="13.81"
        height="8.98"
        transform="translate(10.99 -7.41) rotate(45)"
      />
      <path d="M16.15,17.62,14.6,19.17a2,2,0,0,1-2.76,0l-2-2L5,21.89a2.08,2.08,0,0,1-1.47.61h0A2.07,2.07,0,0,1,1.5,20.43h0A2.08,2.08,0,0,1,2.11,19L6.87,14.2l-2-2a2,2,0,0,1,0-2.76L6.38,7.85Z" />
      <path d="M15.66 4.43 11.27 8.83" />
    </svg>
  );
}

function SystemIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M8 19h8" />
      <path d="M12 16v3" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.9 19.1 1.4-1.4" />
      <path d="m17.7 6.3 1.4-1.4" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3a7.5 7.5 0 1 0 9 9A9 9 0 0 1 12 3Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function ShellThemePicker({
  activeFamily,
  activeMode,
  open,
  onToggle,
  onClose,
  onSelectFamily,
  onSelectMode,
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

  return (
    <div className="relative shrink-0">
      <motion.button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Theme picker"
        onClick={onToggle}
        className="shell-brand-button motion-surface inline-flex items-center justify-center px-3 py-3 text-text"
      >
        <ThemePickerIcon className="h-[15px] w-[15px]" />
      </motion.button>

      {open ? (
        (() => {
          const topStyle =
            isMobile && mobileTop !== null ? { top: `${mobileTop}px` } : undefined;
          const panel = (
            <div
              data-shell-popup="true"
              className={[
                "shell-menu-panel motion-page z-50 overflow-hidden p-2",
                isMobile
                  ? "fixed left-1/2 w-[min(24rem,calc(100vw-1rem))] -translate-x-1/2"
                  : "absolute top-full left-1/2 mt-2 w-[min(24rem,calc(100vw-1rem))] -translate-x-1/2",
                "sm:left-auto sm:right-0 sm:w-[min(22rem,calc(100vw-1.5rem))] sm:translate-x-0",
              ].join(" ")}
              style={topStyle}
            >
              <div className="space-y-2">
                <div
                  role="tablist"
                  aria-label="Theme appearance"
                  className="grid grid-cols-3 gap-1"
                >
                  {themeModes.map((mode) => {
                    const active = mode.value === activeMode;
                    const Icon = modeIcons[mode.value];

                    return (
                      <button
                        key={mode.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          onSelectMode(mode.value);
                          onClose();
                        }}
                        className={[
                          "shell-menu-item motion-surface flex flex-col items-center justify-center gap-1 border px-2 py-2 text-center",
                          active
                            ? "shell-item-active"
                            : "border-transparent bg-bg text-text-muted hover:border-border/60 hover:bg-bg-elevated hover:text-text",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="ui-shell font-mono uppercase">
                          {mode.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-border/70 pt-2">
                  <p className="ui-meta mb-2 font-mono uppercase text-text-muted">
                    Theme
                  </p>

                  <ul className="space-y-1">
                    {themeFamilies.map((option) => {
                      const active = option.value === activeFamily;

                      return (
                        <li key={option.value}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectFamily(option.value);
                              onClose();
                            }}
                            className={[
                              "shell-menu-item motion-surface flex w-full items-center justify-between border px-3 py-2",
                              "font-mono uppercase",
                              active
                                ? "shell-item-active"
                                : "border-transparent bg-bg text-text-muted hover:border-border/60 hover:bg-bg-elevated hover:text-text",
                            ].join(" ")}
                          >
                            <span className="ui-shell">{option.label}</span>
                            {active ? (
                              <CheckIcon className="h-[14px] w-[14px]" />
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );

          return isMobile ? createPortal(panel, document.body) : panel;
        })()
      ) : null}
    </div>
  );
}
