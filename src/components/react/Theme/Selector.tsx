import { useEffect, useRef, useState } from "react";
import { themes, type Theme } from "./Provider";

function applyTheme(nextTheme: Theme) {
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme === "paper" ? "light" : "dark";
  localStorage.setItem("theme", nextTheme);
}

export function ThemeSelector() {
  const [localTheme, setLocalTheme] = useState<Theme>("graphite");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initialTheme =
      saved && themes.includes(saved as Theme)
        ? (saved as Theme)
        : ((document.documentElement.dataset.theme as Theme) || "graphite");

    setLocalTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!panelRef.current) return;

      if (!panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const setTheme = (nextTheme: Theme) => {
    setLocalTheme(nextTheme);
    applyTheme(nextTheme);
    setOpen(false);
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="cursor-pointer rounded-full border border-border/70 bg-bg/35 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-text-muted backdrop-blur-md transition hover:text-text"
      >
        [ theme: {localTheme} ]
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Theme selector"
          className="absolute right-0 top-full z-20 mt-2 min-w-48 rounded-2xl border border-border/70 bg-bg/72 p-2 shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-bg/54"
        >
          <div className="space-y-1">
            {themes.map((option) => {
              const active = localTheme === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTheme(option)}
                  role="menuitemradio"
                  aria-checked={active}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 font-mono text-[11px] uppercase tracking-[0.24em] transition",
                    active
                      ? "border border-text bg-bg text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "text-text-muted hover:bg-bg/60 hover:text-text",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <span>{active ? "[x]" : "[ ]"}</span>
                    <span>{option}</span>
                  </span>
                  <span className="text-[10px] tracking-[0.32em] text-text-muted">
                    {active ? "active" : " "}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
