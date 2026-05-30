export type ShellBrandIcon = {
  src: string;
  width?: number;
  height?: number;
};

export const normalizePath = (value: string) => {
  const next = value.replace(/\/+$/, "");
  return next || "/";
};

export const getSectionLabel = (value: string, fallback = "Page") => {
  const normalized = normalizePath(value);

  if (normalized === "/") return "Home";
  if (normalized === "/projects" || normalized.startsWith("/projects/")) {
    return "Projects";
  }
  if (normalized === "/references" || normalized.startsWith("/references/")) {
    return "References";
  }
  if (normalized === "/work" || normalized.startsWith("/work/")) {
    return "Work";
  }
  if (normalized === "/now" || normalized.startsWith("/now/")) {
    return "Now";
  }
  if (normalized === "/writing" || normalized.startsWith("/writing/")) {
    if (normalized.startsWith("/writing/blogs/") || normalized === "/writing/blogs") {
      return "Blogs";
    }
    if (normalized.startsWith("/writing/notes/") || normalized === "/writing/notes") {
      return "Notes";
    }
    return "Writing";
  }
  if (normalized === "/me" || normalized.startsWith("/me/")) {
    return "About";
  }

  return fallback;
};

export const isActivePath = (currentPath: string, href: string) => {
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedHref = normalizePath(href);

  if (normalizedHref === "/") {
    return normalizedCurrent === "/";
  }

  return (
    normalizedCurrent === normalizedHref ||
    normalizedCurrent.startsWith(`${normalizedHref}/`)
  );
};
