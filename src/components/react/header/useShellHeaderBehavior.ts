import { useEffect, useRef, useState } from "react";
import { useReducedMotion, type AnimationGeneratorType } from "motion/react";
import {
  defaultThemeFamily,
  defaultThemeMode,
  getSectionLabel,
  normalizePath,
  resolveThemeFamilyAndMode,
  resolveThemeFamilyFromVariant,
  resolveThemeModeFromVariant,
  THEME_FAMILY_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
  LEGACY_THEME_STORAGE_KEY,
  type ThemeFamily,
  type ThemeMode,
} from "./header-utils";


type Options = {
  currentPath: string;
  pageTitle?: string;
};

export function useShellHeaderBehavior({ currentPath, pageTitle }: Options) {
  const reduceMotion = useReducedMotion();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activePath, setActivePath] = useState(() => normalizePath(currentPath));
  const [activeTitle, setActiveTitle] = useState(() =>
    getSectionLabel(currentPath, pageTitle),
  );
  const [themeFamily, setThemeFamily] = useState<ThemeFamily>(defaultThemeFamily);
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultThemeMode);
  const [themeOpen, setThemeOpen] = useState(false);

  const spring = reduceMotion
    ? { duration: 0 }
    : {
      type: "spring" as AnimationGeneratorType,
      stiffness: 280,
      damping: 30,
      mass: 0.8,
    };

  useEffect(() => {
    const syncState = () => {
      const pathname = normalizePath(window.location.pathname);
      const storedFamily = localStorage.getItem(THEME_FAMILY_STORAGE_KEY);
      const storedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY);
      const legacyTheme = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
      const datasetFamily = document.documentElement.dataset.themeFamily;
      const datasetMode = document.documentElement.dataset.themeMode;
      const nextPreference = resolveThemeFamilyAndMode(
        storedFamily ?? datasetFamily ?? resolveThemeFamilyFromVariant(legacyTheme),
        storedMode ?? datasetMode ?? resolveThemeModeFromVariant(legacyTheme),
      );

      setActivePath(pathname);
      setActiveTitle(getSectionLabel(pathname, pageTitle));
      setOpen(false);
      setThemeOpen(false);
      setHidden(false);
      setThemeFamily(nextPreference.family);
      setThemeMode(nextPreference.mode);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!shellRef.current) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-shell-popup]")) return;

      if (!shellRef.current.contains(event.target as Node)) {
        setOpen(false);
        setThemeOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setThemeOpen(false);
      }
    };


    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("astro:page-load", syncState);
    document.addEventListener("astro:after-swap", syncState);
    window.addEventListener("pageshow", syncState);
    window.addEventListener("popstate", syncState);

    syncState();

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("astro:page-load", syncState);
      document.removeEventListener("astro:after-swap", syncState);
      window.removeEventListener("pageshow", syncState);
      window.removeEventListener("popstate", syncState);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [pageTitle]);

  useEffect(() => {
    const pathname = normalizePath(currentPath);

    setActivePath(pathname);
    setActiveTitle(getSectionLabel(pathname, pageTitle));
    setOpen(false);
    setThemeOpen(false);
    setHidden(false);

  }, [currentPath, pageTitle]);

  return {
    shellRef,
    open,
    setOpen,
    themeFamily,
    setThemeFamily,
    themeMode,
    setThemeMode,
    themeOpen,
    setThemeOpen,
    hidden,
    activePath,
    activeTitle,
    spring,
  };
}
