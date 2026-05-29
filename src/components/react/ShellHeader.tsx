import { ShellBrandLauncher } from "./ShellBrandLauncher";

type Props = {
  backHref?: string;
  backLabel?: string;
  logoLabel?: string;
  pageTitle?: string;
  currentPath?: string;
  variant?: "default" | "rail";
};

export function ShellHeader({
  backHref,
  backLabel = "Back",
  logoLabel = "Webxsid",
  pageTitle,
  currentPath = "/",
  variant = "default",
}: Props) {
  return (
    <ShellBrandLauncher
      backHref={backHref}
      backLabel={backLabel}
      logoLabel={logoLabel}
      pageTitle={pageTitle}
      currentPath={currentPath}
      variant={variant}
    />
  );
}
