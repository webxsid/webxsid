export type ShellBrandIcon = {
  src: string;
  width?: number;
  height?: number;
};

export const themeFamilies = [
  {
    value: "graphite",
    label: "Graphite",
    lightVariant: "paper",
    darkVariant: "graphite",
  },
  {
    value: "e-ink",
    label: "E-Ink",
    lightVariant: "e-ink",
    darkVariant: "e-ink-dark",
  },
  {
    value: "phosphor",
    label: "Phosphor",
    lightVariant: "phosphor-light",
    darkVariant: "phosphor",
  },
  {
    value: "retro",
    label: "Retro",
    lightVariant: "retro",
    darkVariant: "retro-dark",
  },
  // {
  //   value: "doodle",
  //   label: "Doodle",
  //   lightVariant: "doodle",
  //   darkVariant: "doodle-dark",
  // },
] as const;

export const themeColors = {
  paper: "#f7f4ee",
  graphite: "#121214",
  "e-ink": "#f2efe7",
  "e-ink-dark": "#1c1c1a",
  "phosphor-light": "#f0f7ec",
  phosphor: "#0a0f0a",
  retro: "#eef0df",
  "retro-dark": "#222945",
  doodle: "#f8f1df",
  "doodle-dark": "#24211d",
} as const;

export type ThemeFamily = (typeof themeFamilies)[number]["value"];

export const themeModes = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

export type ThemeMode = (typeof themeModes)[number]["value"];

export const THEME_FAMILY_STORAGE_KEY = "theme-family";
export const THEME_MODE_STORAGE_KEY = "theme-mode";
export const LEGACY_THEME_STORAGE_KEY = "theme";

export const defaultThemeFamily: ThemeFamily = "graphite";
export const defaultThemeMode: ThemeMode = "system";

export const isThemeFamily = (
  value: string | null | undefined,
): value is ThemeFamily =>
  themeFamilies.some((option) => option.value === value);

export const isThemeMode = (
  value: string | null | undefined,
): value is ThemeMode => themeModes.some((option) => option.value === value);

export const getThemeVariants = (family: ThemeFamily) => {
  const theme =
    themeFamilies.find((option) => option.value === family) ?? themeFamilies[0];

  return {
    light: theme.lightVariant,
    dark: theme.darkVariant,
  } as const;
};

export const resolveThemeVariant = (
  family: ThemeFamily,
  mode: ThemeMode,
  prefersDark: boolean,
) => {
  const variants = getThemeVariants(family);

  if (mode === "light") return variants.light;
  if (mode === "dark") return variants.dark;

  return prefersDark ? variants.dark : variants.light;
};

export const resolveThemeFamilyFromVariant = (
  variant: string | null | undefined,
) => {
  switch (variant) {
    case "paper":
    case "graphite":
      return "graphite" as const;
    case "e-ink":
    case "e-ink-dark":
      return "e-ink" as const;
    case "phosphor-light":
    case "phosphor":
      return "phosphor" as const;
    case "retro":
    case "retro-dark":
      return "retro" as const;
    case "doodle":
    case "doodle-dark":
      return "doodle" as const;
    default:
      return defaultThemeFamily;
  }
};

export const resolveThemeModeFromVariant = (
  variant: string | null | undefined,
) => {
  switch (variant) {
    case "paper":
    case "e-ink":
    case "phosphor-light":
    case "retro":
    case "doodle":
      return "light" as const;
    case "graphite":
    case "e-ink-dark":
    case "phosphor":
    case "retro-dark":
    case "doodle-dark":
      return "dark" as const;
    default:
      return defaultThemeMode;
  }
};

export const resolveThemeFamilyAndMode = (
  family: string | null | undefined,
  mode: string | null | undefined,
) => {
  const nextFamily = isThemeFamily(family) ? family : defaultThemeFamily;
  const nextMode = isThemeMode(mode) ? mode : defaultThemeMode;

  return {
    family: nextFamily,
    mode: nextMode,
  } as const;
};

export const getThemeColor = (variant: string | null | undefined) =>
  themeColors[variant as keyof typeof themeColors] ?? themeColors.graphite;

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
  if (normalized === "/notes" || normalized.startsWith("/notes/")) {
    return "Notes";
  }
  if (normalized === "/work" || normalized.startsWith("/work/")) {
    return "Work";
  }
  if (normalized === "/now" || normalized.startsWith("/now/")) {
    return "Now";
  }
  if (normalized === "/writing" || normalized.startsWith("/writing/")) {
    return "Writing";
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
