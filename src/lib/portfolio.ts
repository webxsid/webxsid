import { SITE_URL } from "./site";

// Canonical metadata only. Hostname routing is deliberately not configured here.
export function portfolioCanonical() {
  return new URL(
    import.meta.env.PUBLIC_PORTFOLIO_BASE_URL || "/portfolio",
    SITE_URL,
  ).href;
}
