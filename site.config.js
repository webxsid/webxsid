const DEFAULT_SITE_URL = "https://webxsid.com";
const LOCAL_SITE_URL = "http://localhost:5868";

export const resolveSiteUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return LOCAL_SITE_URL;
  }

  return process.env.SITE_URL?.trim() || DEFAULT_SITE_URL;
};

export const SITE_URL = resolveSiteUrl();
