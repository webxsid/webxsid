export const footerColophon = "built with Astro, written in Markdown";

export const globalNavItems = [
  { href: "/", label: "Home", icon: "house" },
  { href: "/projects", label: "Projects", icon: "briefcase" },
  { href: "/writing", label: "Writing", icon: "book" },
  { href: "/notes", label: "Notes", icon: "notepad" },
  { href: "/references", label: "References", icon: "bookmark" },
  { href: "/now", label: "Now", icon: "clock" },
] as const;

export type GlobalNavItem = (typeof globalNavItems)[number];

/** Pages outside the main sections, listed under the header menu's sections. */
export const headerMenuExtras = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/colophon", label: "Colophon" },
] as const;

export const footerSocialLinks = [
  { href: "https://github.com/webxsid", label: "GitHub", icon: "github" },
  {
    href: "https://www.threads.net/@webxsid",
    label: "Threads",
    icon: "threads",
  },
  {
    href: "https://bsky.app/profile/webxsid.bsky.social",
    label: "Bluesky",
    icon: "bluesky",
  },
  {
    href: "https://instagram.com/webxsid",
    label: "Instagram",
    icon: "instagram",
  },
  { href: "mailto:me@webxsid.com", label: "Mail", icon: "mail" },
  { href: "/rss", label: "RSS", icon: "rss" },
] as const;

export const footerLinkColumns = [
  {
    label: "site",
    links: [
      { href: "/projects", label: "Projects" },
      { href: "/writing", label: "Writing" },
      { href: "/notes", label: "Notes" },
      { href: "/references", label: "References" },
    ],
  },
  {
    label: "elsewhere",
    links: [
      { href: "/portfolio", label: "Portfolio" },
      { href: "/now", label: "Now" },
      { href: "/colophon", label: "Colophon" },
      { href: "/rss", label: "RSS" },
    ],
  },
] as const;

type SharedNavVisibility = {
  hasReferences: boolean;
  hasNotes: boolean;
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

    if (item.href === "/notes") {
      return visibility.hasNotes;
    }

    if (item.href === "/now") {
      return visibility.hasNow;
    }

    return true;
  });
}
