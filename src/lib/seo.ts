type SeoMeta = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
};

export function withAutoOgImage(seo: SeoMeta | undefined, fallbackImage: string): SeoMeta {
  const image = seo?.image?.trim() ? seo.image.trim() : fallbackImage;

  return {
    ...(seo ?? {}),
    image,
  };
}
