import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const seoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    canonical: z.string().optional(),
    noindex: z.boolean().default(false),
  })
  .optional();

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z
      .enum(["active", "building", "maintained", "archived", "prototype", "experimental"])
      .default("active"),
    stack: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    company: z
      .object({
        name: z.string(),
        slug: z.string(),
      })
      .optional(),
    yearStarted: z.coerce.number().int().optional(),
    yearEnded: z.coerce.number().int().optional(),
    order: z.number().default(0),
    updatedAt: z.coerce.date(),
    featured: z.boolean().default(false),
    source: z.url().optional(),
    website: z.url().optional(),
    demo: z.url().optional(),
    detailsPage: z.boolean().default(false),
    seo: seoSchema,
  }),
});

const writing = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/writing",
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    kind: z.enum(["blog", "note"]).default("blog"),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    seo: seoSchema,
  }),
});

const now = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/now",
  }),
  schema: z.object({
    title: z.string().default("Current focus"),
    summary: z.string(),
    updatedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    links: z
      .array(
        z.object({
          heading: z.string().optional(),
          title: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
    seo: seoSchema,
  }),
});

const references = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/references",
  }),
  schema: z.object({
    title: z.string(),
    type: z.enum([
      "book",
      "article",
      "essay",
      "paper",
      "video",
      "podcast",
      "song",
      "album",
      "movie",
      "other",
    ]),
    creator: z.string().optional(),
    year: z.number().optional(),
    summary: z.string(),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    seo: seoSchema,
  }),
});

const work = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/work",
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    company: z.string(),
    url: z.url(),
    role: z.string(),
    period: z.string(),
    order: z.number().default(0),
    seo: seoSchema,
  }),
});

export const collections = { projects, writing, now, references, work };
