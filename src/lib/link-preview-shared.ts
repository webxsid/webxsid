export type LinkPreviewKind =
  | "internal"
  | "external"
  | "youtube"
  | "image"
  | "video"
  | "generic";

export type LinkPreviewRecord = {
  href: string;
  title: string;
  origin: string;
  displayUrl: string;
  kind: LinkPreviewKind;
  image?: string;
  siteName?: string;
  description?: string;
  isInternal: boolean;
};
