import {
  Bird,
  Github,
  Instagram,
  Mail,
  MessageCircleMore,
  Rss,
  Threads
} from "lucide-astro";

export const footerClosingNote = "Still building. Still learning.";

export const footerColophon =
  "Built with Astro. Written in Markdown. Updated through regular use.";

export const footerSocialLinks = [
  { href: "https://github.com/webxsid", label: "GitHub", icon: Github },
  { href: "https://www.threads.com/@webxsid", label: "Threads", icon: Threads },
  { href: "https://bsky.app/profile/webxsid.com", label: "Bluesky", icon: Bird },
  { href: "https://instagram.com/webxsid", label: "Instagram", icon: Instagram },
  { href: "mailto:me@webxsid.com", label: "Mail", icon: Mail },
  { href: "/rss.xml", label: "RSS", icon: Rss },
] as const;

export const footerLinkColumns = [
  [
    { href: "/projects", label: "Projects" },
    { href: "/writing", label: "Writing" },
    { href: "/references", label: "References" },
  ],
  [
    { href: "/work", label: "Work" },
    { href: "/me", label: "About" },
    { href: "/now", label: "Now" },
  ],
] as const;
