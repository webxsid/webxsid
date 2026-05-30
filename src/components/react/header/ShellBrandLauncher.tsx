import { motion } from "motion/react";
import type { ShellBrandIcon } from "./header-utils";
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
};
export function ShellBrandLauncher({
  backHref,
  backLabel = "Back",
  brandIcon,
  logoLabel = "Webxsid",
  pageTitle,
  currentPath = "/",
  variant = "default",
}: Props) {
  const { shellRef, open, setOpen, activePath, activeTitle, spring } =
    useShellHeaderBehavior({
      currentPath,
      pageTitle,
    });

  return (
    <motion.div
      ref={shellRef}
      layout
      transition={spring}
      data-variant={variant}
      className="flex items-center gap-3"
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
        <ShellHeaderBrand
          brandIcon={brandIcon}
          logoLabel={logoLabel}
          activeTitle={activeTitle}
          open={open}
          onToggle={() => setOpen((value) => !value)}
        />

        <ShellHeaderMenu
          activePath={activePath}
          open={open}
          onClose={() => setOpen(false)}
        />
      </div>
    </motion.div>
  );
}
