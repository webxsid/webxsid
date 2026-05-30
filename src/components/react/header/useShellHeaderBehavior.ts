import { useEffect, useRef, useState } from "react";
import { useReducedMotion, type AnimationGeneratorType } from "motion/react";
import { getSectionLabel, normalizePath } from "./header-utils";


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

      setActivePath(pathname);
      setActiveTitle(getSectionLabel(pathname, pageTitle));
      setOpen(false);
      setHidden(false);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!shellRef.current) return;

      if (!shellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
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
    setHidden(false);

  }, [currentPath, pageTitle]);

  return {
    shellRef,
    open,
    setOpen,
    hidden,
    activePath,
    activeTitle,
    spring,
  };
}
