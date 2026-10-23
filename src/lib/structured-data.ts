import { portfolio } from "../data/portfolio";
import { SITE_URL } from "./site";

export type StructuredData = Record<string, unknown>;

const personId = new URL("/#person", SITE_URL).toString();

// Facts here come from src/data/portfolio.ts, which traces to resume/facts.md.
export const personSchema = (url: string = new URL("/", SITE_URL).toString()): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personId,
  name: portfolio.name,
  alternateName: "webxsid",
  jobTitle: portfolio.role,
  knowsAbout: portfolio.expertiseAreas,
  email: portfolio.email,
  url,
  sameAs: [portfolio.github, portfolio.linkedin],
});

export const websiteSchema = (): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Webxsid",
  url: new URL("/", SITE_URL).toString(),
  inLanguage: "en",
  author: { "@id": personId },
});

export const serializeStructuredData = (data: StructuredData | StructuredData[]) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
