import { useRef } from "react";
import { motion } from "motion/react";
import {
  getThemeColor,
  resolveThemeVariant,
  THEME_FAMILY_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
  type ShellBrandIcon,
  type ThemeFamily,
  type ThemeMode,
} from "./header-utils";
import { filterSharedNavItems, globalNavItems } from "../../../lib/site-links";
import { ShellHeaderBrand } from "./ShellHeaderBrand";
import { ShellHeaderMenu } from "./ShellHeaderMenu";
import { ShellThemePicker } from "./ShellThemePicker";
import { useShellHeaderBehavior } from "./useShellHeaderBehavior";

declare global {
  interface Window {
    __webxsidTriggerThemeFx?: () => void;
  }
}

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
};
export function ShellBrandLauncher({
  backHref,
  backLabel = "Back",
  brandIcon,
  logoLabel = "Webxsid",
  pageTitle,
  currentPath = "/",
  variant = "default",
  desktopRail = false,
  hasReferences = false,
  hasNotes = false,
  hasNow = false,
}: Props) {
  const brandTriggerRef = useRef<HTMLButtonElement | null>(null);
  const themeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const {
    shellRef,
    open,
    setOpen,
    activePath,
    activeTitle,
    spring,
    themeFamily,
    setThemeFamily,
    themeMode,
    setThemeMode,
    themeOpen,
    setThemeOpen,
  } = useShellHeaderBehavior({
    currentPath,
    pageTitle,
  });

  const isSystemDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const applyThemeColor = (variant: string) => {
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", getThemeColor(variant));
    }
  };

  const triggerThemeFx = () => {
    window.__webxsidTriggerThemeFx?.();
  };

  const applyThemeFamily = (nextFamily: ThemeFamily) => {
    const nextVariant = resolveThemeVariant(
      nextFamily,
      themeMode,
      isSystemDark(),
    );

    document.documentElement.dataset.themeFamily = nextFamily;
    document.documentElement.dataset.themeMode = themeMode;
    document.documentElement.dataset.theme = nextVariant;
    applyThemeColor(nextVariant);
    triggerThemeFx();
    localStorage.setItem(THEME_FAMILY_STORAGE_KEY, nextFamily);
    localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);
    setThemeFamily(nextFamily);
  };

  const applyThemeMode = (nextMode: ThemeMode) => {
    const nextVariant = resolveThemeVariant(
      themeFamily,
      nextMode,
      isSystemDark(),
    );

    document.documentElement.dataset.themeFamily = themeFamily;
    document.documentElement.dataset.themeMode = nextMode;
    document.documentElement.dataset.theme = nextVariant;
    applyThemeColor(nextVariant);
    triggerThemeFx();
    localStorage.setItem(THEME_FAMILY_STORAGE_KEY, themeFamily);
    localStorage.setItem(THEME_MODE_STORAGE_KEY, nextMode);
    setThemeMode(nextMode);
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
          aria-label={backLabel}
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
              setThemeOpen(false);
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

        <ShellThemePicker
          triggerRef={themeTriggerRef}
          activeFamily={themeFamily}
          activeMode={themeMode}
          open={themeOpen}
          onToggle={() => {
            setOpen(false);
            setThemeOpen((value) => !value);
          }}
          onClose={() => setThemeOpen(false)}
          onSelectFamily={applyThemeFamily}
          onSelectMode={applyThemeMode}
        />
      </div>
    </motion.div>
  );
}
