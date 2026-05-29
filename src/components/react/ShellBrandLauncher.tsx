import { motion, useReducedMotion } from "motion/react";
import type { AnimationGeneratorType } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { globalNavItems } from "../../lib/site-links";

type Props = {
  backHref?: string;
  backLabel?: string;
  logoLabel?: string;
  pageTitle?: string;
  currentPath?: string;
  variant?: "default" | "rail";
};

const normalizePath = (value: string) => {
  const next = value.replace(/\/+$/, "");
  return next || "/";
};

const getSectionLabel = (value: string, fallback = "Page") => {
  const normalized = normalizePath(value);

  if (normalized === "/") return "Home";
  if (normalized === "/projects" || normalized.startsWith("/projects/")) {
    return "Projects";
  }
  if (normalized === "/references" || normalized.startsWith("/references/")) {
    return "References";
  }
  if (normalized === "/work" || normalized.startsWith("/work/")) {
    return "Work";
  }
  if (normalized === "/now" || normalized.startsWith("/now/")) {
    return "Now";
  }
  if (normalized === "/writing" || normalized.startsWith("/writing/")) {
    if (normalized.startsWith("/writing/blogs/") || normalized === "/writing/blogs") {
      return "Blogs";
    }
    if (normalized.startsWith("/writing/notes/") || normalized === "/writing/notes") {
      return "Notes";
    }
    return "Writing";
  }
  if (normalized === "/me" || normalized.startsWith("/me/")) {
    return "About";
  }

  return fallback;
};

const isActivePath = (currentPath: string, href: string) => {
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedHref = normalizePath(href);

  if (normalizedHref === "/") {
    return normalizedCurrent === "/";
  }

  return (
    normalizedCurrent === normalizedHref ||
    normalizedCurrent.startsWith(`${normalizedHref}/`)
  );
};

const HEADER_HIDE_DELTA = 48;

export function ShellBrandLauncher({
  backHref,
  backLabel = "Back",
  logoLabel = "Webxsid",
  pageTitle,
  currentPath = "/",
  variant = "default",
}: Props) {
  const reduceMotion = useReducedMotion();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState(() => normalizePath(currentPath));
  const [activeTitle, setActiveTitle] = useState(() =>
    getSectionLabel(currentPath, pageTitle),
  );
  const [hidden, setHidden] = useState(false);

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as AnimationGeneratorType, stiffness: 280, damping: 30, mass: 0.8 };

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const syncState = () => {
      const pathname = normalizePath(window.location.pathname);
      setActivePath(pathname);
      setActiveTitle(getSectionLabel(pathname, pageTitle));
      setOpen(false);
      setHidden(false);
      lastScrollYRef.current = window.scrollY;
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollYRef.current;

        if (currentScrollY <= 0) {
          setHidden(false);
        } else if (Math.abs(delta) >= HEADER_HIDE_DELTA) {
          if (delta > 0) {
            setHidden(true);
            setOpen(false);
          } else {
            setHidden(false);
          }
          lastScrollYRef.current = currentScrollY;
        }
      });
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("astro:page-load", syncState);
    document.addEventListener("astro:after-swap", syncState);
    window.addEventListener("pageshow", syncState);
    window.addEventListener("popstate", syncState);

    syncState();

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("astro:page-load", syncState);
      document.removeEventListener("astro:after-swap", syncState);
      window.removeEventListener("pageshow", syncState);
      window.removeEventListener("popstate", syncState);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [currentPath, pageTitle]);

  useEffect(() => {
    const pathname = normalizePath(currentPath);
    setActivePath(pathname);
    setActiveTitle(getSectionLabel(pathname, pageTitle));
    setOpen(false);
  }, [currentPath, pageTitle]);

  const normalizedActivePath = normalizePath(activePath);
  const shellClasses = "flex items-center gap-3";

  return (
    <motion.div
      ref={shellRef}
      layout
      animate={{ y: hidden ? -96 : 0 }}
      transition={spring}
      className={shellClasses}
    >
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
              className="h-[14px] w-[14px] relative -left-[1px] "
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.a>
        ) : null}
      </motion.div>

      <div className="relative">
        <motion.button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`${logoLabel} navigation`}
          onClick={() => setOpen((value) => !value)}
          layout
          transition={spring}
          className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-bg px-3 py-2 text-left text-text transition-[transform,box-shadow] cursor-pointer"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-bg font-mono text-[11px] uppercase tracking-[0.24em] text-text">
            WX
          </span>

          <span className="flex flex-col items-start gap-0.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text">
              {logoLabel}
            </span>

            <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.24em] text-text-muted">
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

        {open ? (
          <div className="absolute left-0 top-full z-20 mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-border/70 bg-bg p-2 shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
            <nav aria-label="Primary">
              <ul className="space-y-1">
                {globalNavItems.map((item) => {
                  const active = isActivePath(normalizedActivePath, item.href);

                  return (
                    <li key={item.href}>
                      <motion.a
                        href={item.href}
                        initial={false}
                        onClick={() => setOpen(false)}
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
        ) : null}
      </div>
    </motion.div>
  );
}
