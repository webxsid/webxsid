import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { navigate } from "astro:transitions/client";
import { type ShellBrandIcon } from "./header-utils";
import { filterSharedNavItems, globalNavItems } from "../../../lib/site-links";
import { ShellHeaderBrand } from "./ShellHeaderBrand";
import { ShellHeaderMenu } from "./ShellHeaderMenu";
import { useShellHeaderBehavior } from "./useShellHeaderBehavior";

type Props = {
  backHref?: string;
  backLabel?: string;
  brandIcon?: ShellBrandIcon;
  logoLabel?: string;
  pageTitle?: string;
  currentPath?: string;
  variant?: "default" | "rail";
  desktopRail?: boolean;
  hasReferences?: boolean;
  hasNotes?: boolean;
  hasNow?: boolean;
  /** Static content from the Astro layout, rendered beside the brand button. */
  children?: ReactNode;
};
export function ShellBrandLauncher({
  backHref,
  brandIcon,
  logoLabel = "Webxsid",
  pageTitle,
  currentPath = "/",
  variant = "default",
  desktopRail = false,
  hasReferences = false,
  hasNotes = false,
  hasNow = false,
  children,
}: Props) {
  const brandTriggerRef = useRef<HTMLButtonElement | null>(null);
  const {
    shellRef,
    open,
    setOpen,
    activePath,
    activeTitle,
    spring,
  } = useShellHeaderBehavior({
    currentPath,
    pageTitle,
  });

  // Back means "wherever I just was". Astro numbers each in-app navigation in
  // history.state.index, so index > 0 means there is a previous in-app page to
  // return to. On a first load (a deep link, a new tab, a refresh of the first
  // page) there is none, so go to the page's parent instead, replacing the
  // current entry so the parent's own back button cannot bounce back here.
  const handleBack = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    const index = window.history.state?.index;

    if (typeof index === "number" && index > 0) {
      window.history.back();
      return;
    }

    if (backHref) {
      navigate(backHref, { history: "replace" });
    }
  };

  return (
    <motion.div
      ref={shellRef}
      layout
      transition={spring}
      data-variant={variant}
      data-desktop-rail={desktopRail ? "true" : "false"}
      className="shell-header flex items-center gap-3"
    >
      <motion.div
        layout
        transition={spring}
        data-visible={backHref ? "true" : "false"}
        className="shell-header-back-slot relative flex shrink-0 justify-center overflow-visible"
      >
        <motion.a
          href={backHref}
          aria-label="Back"
          onClick={handleBack}
          aria-hidden={!backHref}
          tabIndex={backHref ? undefined : -1}
          initial={false}
          animate={{ opacity: backHref ? 1 : 0 }}
          transition={spring}
          layout
          className={`shell-brand-button shell-back-button motion-surface inline-flex items-center justify-center py-4 px-4 ${backHref ? "" : "pointer-events-none"}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative -left-[1px] h-[14px] w-[14px]"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.a>
      </motion.div>

      <div className="shell-header-brand-group flex items-center gap-2">
        <div className="relative">
          <ShellHeaderBrand
            triggerRef={brandTriggerRef}
            brandIcon={brandIcon}
            logoLabel={logoLabel}
            activeTitle={activeTitle}
            open={open}
            onToggle={() => {
              setOpen((value) => !value);
            }}
          />

          <ShellHeaderMenu
            triggerRef={brandTriggerRef}
            activePath={activePath}
            open={open}
            onClose={() => setOpen(false)}
            navItems={filterSharedNavItems(globalNavItems, {
              hasReferences,
              hasNotes,
              hasNow,
            })}
          />
        </div>

        {children ? (
          <div className="relative shrink-0" onPointerDown={() => setOpen(false)}>
            {children}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
