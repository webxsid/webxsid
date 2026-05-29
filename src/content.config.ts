import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(["active", "building", "maintained", "archived"]).default("active"),
    stack: z.array(z.string()).default([]),
    order: z.number().default(0),
    updatedAt: z.coerce.date(),
    featured: z.boolean().default(false),
    source: z.url().optional(),
    live: z.url().optional(),
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
    kind: z.enum(["blog", "note"]).default("blog"),
    publishedAt: z.coerce.date(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const now = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/now",
  }),
  schema: z.object({
    title: z.string().default("Current focus"),
    summary: z.string(),
    updatedAt: z.coerce.date(),
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
    role: z.string(),
    period: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = { projects, writing, now, references, work };
