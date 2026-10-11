import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const portfolioLink = z.object({
  label: z.string(),
  href: z.string().refine((value) => {
    if (value.startsWith("/") && !value.startsWith("//")) return true;
    try {
      return ["https:", "mailto:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Use a site-relative path, HTTPS URL, or email link."),
});

export const portfolioProfile = defineCollection({
  loader: glob({
    pattern: "*.{md,mdx}",
    base: "./src/content/portfolio/profile",
  }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    headline: z.string(),
    summary: z.string(),
    availability: z.string(),
    email: z.email(),
    github: z.url(),
    resume: portfolioLink.optional(),
    focus: z.array(z.string()).min(1),
    seoDescription: z.string(),
  }),
});

export const portfolioExperience = defineCollection({
  loader: glob({
    pattern: "*.{md,mdx}",
    base: "./src/content/portfolio/experience",
  }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    period: z.string(),
    website: z.url(),
    order: z.number().int(),
    highlights: z.array(z.string()).min(1),
  }),
});

export const portfolioProjects = defineCollection({
  loader: glob({
    pattern: "*.{md,mdx}",
    base: "./src/content/portfolio/projects",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["active", "maintained", "archived"]),
    stage: z.string().optional(),
    role: z.string(),
    technologies: z.array(z.string()),
    startedAt: z.coerce.date().optional(),
    links: z.object({
      website: z.url().optional(),
      repository: z.url().optional(),
    }),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    relatedCaseStudies: z.array(reference("portfolioCaseStudies")).default([]),
    screenshots: z
      .array(
        z.object({
          src: z.string().startsWith("/"),
          alt: z.string(),
          caption: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

export const portfolioCaseStudies = defineCollection({
  loader: glob({
    pattern: "*.{md,mdx}",
    base: "./src/content/portfolio/case-studies",
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    organization: z.string().optional(),
    project: reference("portfolioProjects").optional(),
    role: z.string(),
    period: z.string().optional(),
    technologies: z.array(z.string()),
    featured: z.boolean().default(false),
    visibility: z.enum(["public", "unlisted"]).default("public"),
    draft: z.boolean().default(false),
    order: z.number().default(0),
    category: z.string(),
    problem: z.string().optional(),
    contribution: z.string().optional(),
    outcome: z.string().optional(),
    links: z.array(portfolioLink).default([]),
    relatedCaseStudies: z.array(reference("portfolioCaseStudies")).default([]),
  }),
});
