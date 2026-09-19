import { ShellBrandLauncher } from "./ShellBrandLauncher";
import type { ShellBrandIcon } from "./header-utils";

type Props = {
  backHref?: string;
  backLabel?: string;
  brandIcon?: ShellBrandIcon;
  logoLabel?: string;
  pageTitle?: string;
  currentPath?: string;
  variant?: "default" | "rail";
  hasReferences?: boolean;
  hasNotes?: boolean;
  hasNow?: boolean;
};

export function ShellHeader({
  backHref,
  backLabel = "Back",
  brandIcon,
  logoLabel = "Webxsid",
  pageTitle,
  currentPath = "/",
  variant = "default",
  hasReferences = false,
  hasNotes = false,
  hasNow = false,
}: Props) {
  return (
    <ShellBrandLauncher
      backHref={backHref}
      backLabel={backLabel}
      brandIcon={brandIcon}
      logoLabel={logoLabel}
      pageTitle={pageTitle}
      currentPath={currentPath}
      variant={variant}
      hasReferences={hasReferences}
      hasNotes={hasNotes}
      hasNow={hasNow}
    />
  );
}
