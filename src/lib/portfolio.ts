import { SITE_URL } from "./site";

// Set to https://portfolio.webxsid.com/ when the hostname migration is ready.
export const PORTFOLIO_BASE_URL = new URL(
  import.meta.env.PUBLIC_PORTFOLIO_BASE_URL || "/portfolio/",
  SITE_URL,
);

export function portfolioCanonical(pathname: string) {
  const relative = pathname.replace(/^\/portfolio\/?/, "");
  const base = PORTFOLIO_BASE_URL.href.replace(/\/?$/, "/");
  const url = new URL(relative, base);
  return url.pathname === "/" ? url.href : url.href.replace(/\/$/, "");
}

export const portfolioNavigation = [
  { label: "Overview", href: "/portfolio" },
  { label: "Work", href: "/portfolio/work" },
  { label: "Projects", href: "/portfolio/projects" },
  { label: "Experience", href: "/portfolio/experience" },
  { label: "Contact", href: "/portfolio/contact" },
];
