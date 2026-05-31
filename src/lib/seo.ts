export type SeoMeta = {
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  canonical?: string;
  noindex?: boolean;
};

export function withAutoOgImage(seo: SeoMeta | undefined, fallbackImage: string): SeoMeta {
  const image = seo?.image?.trim() ? seo.image.trim() : fallbackImage;
  const hasFallbackImage = !seo?.image?.trim();

  return {
    ...(seo ?? {}),
    image,
    ...(hasFallbackImage
      ? {
          imageWidth: 1200,
          imageHeight: 630,
        }
      : {}),
  };
}
