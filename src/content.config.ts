import { defineCollection } from "astro:content";
import { glob, type Loader, type LoaderContext } from "astro/loaders";
import { z } from "astro/zod";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

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

async function hasMarkdownFiles(path: string): Promise<boolean> {
  const entries = await readdir(path, { withFileTypes: true }).catch(() => []);

  for (const entry of entries) {
    if (entry.isDirectory() && (await hasMarkdownFiles(join(path, entry.name)))) {
      return true;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      return true;
    }
  }

  return false;
}

function optionalMarkdownCollectionLoader(name: string, base: string): Loader {
  const markdownGlobLoader = glob({
    pattern: "**/*.md",
    base,
  });

  return {
    ...markdownGlobLoader,
    name: `${name}-loader`,
    async load(context: LoaderContext) {
    const emptyCollectionKey = `__empty_${name}_collection__`;
    const hasEntries = await hasMarkdownFiles(base);

    if (!hasEntries) {
      context.store.clear();
      context.store.set({
        id: emptyCollectionKey,
        data: {},
        body: "",
        filePath: "",
        digest: emptyCollectionKey,
      });
      context.store.delete(emptyCollectionKey);
      return;
    }

    await markdownGlobLoader.load(context);
    },
  };
}

const references = defineCollection({
  loader: optionalMarkdownCollectionLoader("references", "./src/content/references"),
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

const notes = defineCollection({
  loader: optionalMarkdownCollectionLoader("notes", "./src/content/notes"),
  schema: z.object({}),
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

export const collections = { projects, writing, now, references, notes, work };
