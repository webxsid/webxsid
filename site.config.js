import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_SITE_URL = "https://webxsid.com";
const BETA_SITE_URL = "https://portolfio-beta.pages.dev";
const LOCAL_SITE_URL = "http://localhost:5868";
const WRANGLER_CONFIG_PATH = resolve(process.cwd(), "wrangler.jsonc");

export const SITE_ORIGINS = {
  production: DEFAULT_SITE_URL,
  beta: BETA_SITE_URL,
  local: LOCAL_SITE_URL,
};

const readWranglerConfig = () => {
  try {
    const raw = readFileSync(WRANGLER_CONFIG_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const resolveDeployment = () => {
  if (process.env.NODE_ENV === "development") {
    return "local";
  }

  const wranglerName = String(readWranglerConfig().name ?? "").toLowerCase();

  if (wranglerName.includes("beta")) {
    return "beta";
  }

  return "production";
};

export const resolveSiteUrl = () => {
  const deployment = resolveDeployment();
  return SITE_ORIGINS[deployment];
};

export const SITE_URL = resolveSiteUrl();
