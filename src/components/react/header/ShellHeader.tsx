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
};

export function ShellHeader({
  backHref,
  backLabel = "Back",
  brandIcon,
  logoLabel = "Webxsid",
  pageTitle,
  currentPath = "/",
  variant = "default",
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
    />
  );
}
