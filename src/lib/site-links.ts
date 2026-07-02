export const footerClosingNote = "Still building. Still learning.";

export const footerColophon =
  "Built with Astro. Written in Markdown. Updated through regular use.";

export const globalNavItems = [
  { href: "/", label: "Home", icon: "house" },
  { href: "/projects", label: "Projects", icon: "briefcase" },
  { href: "/writing", label: "Writing", icon: "book" },
  { href: "/references", label: "References", icon: "bookmark" },
  { href: "/now", label: "Now", icon: "clock" },
] as const;

export type GlobalNavItem = (typeof globalNavItems)[number];

export const footerSocialLinks = [
  { href: "https://github.com/webxsid", label: "GitHub", icon: "github" },
  { href: "https://www.threads.net/@webxsid", label: "Threads", icon: "threads" },
  { href: "https://bsky.app/profile/webxsid.bsky.social", label: "Bluesky", icon: "bluesky" },
  { href: "https://instagram.com/webxsid", label: "Instagram", icon: "instagram" },
  { href: "mailto:me@webxsid.com", label: "Mail", icon: "mail" },
  { href: "/rss.xml", label: "RSS", icon: "rss" },
] as const;

export const footerLinkColumns = [
  [
    { href: "/projects", label: "Projects" },
    { href: "/writing", label: "Writing" },
    { href: "/references", label: "References" },
  ],
  [
    { href: "/work", label: "Work" },
    { href: "/now", label: "Now" },
    { href: "/colophon", label: "Colophon" },
  ],
] as const;

type SharedNavVisibility = {
  hasReferences: boolean;
  hasNow: boolean;
};

export function filterSharedNavItems<T extends { href: string }>(
  items: readonly T[],
  visibility: SharedNavVisibility,
) {
  return items.filter((item) => {
    if (item.href === "/references") {
      return visibility.hasReferences;
    }

    if (item.href === "/now") {
      return visibility.hasNow;
    }

    return true;
  });
}
