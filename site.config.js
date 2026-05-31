const DEFAULT_SITE_URL = "https://webxsid.com";
const LOCAL_SITE_URL = "http://localhost:5868";

const normalizeSiteUrl = (value) => {
  const trimmed = value.trim();
  const parsed = /^https?:\/\//i.test(trimmed)
    ? new URL(trimmed)
    : new URL(`https://${trimmed}`);

  return parsed.origin;
};

export const resolveSiteUrl = () => {
  const candidate =
    process.env.SITE_URL?.trim() ||
    process.env.CF_PAGES_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (candidate) {
    return normalizeSiteUrl(candidate);
  }

  if (process.env.NODE_ENV === "development") {
    return LOCAL_SITE_URL;
  }

  return DEFAULT_SITE_URL;
};

export const SITE_URL = resolveSiteUrl();
