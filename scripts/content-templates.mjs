const exampleUrl = "https://example.com";

function yamlList(items, indent = 0) {
  const prefix = " ".repeat(indent);

  if (items.length === 0) {
    return `${prefix}[]`;
  }

  return items.map((item) => `${prefix}- ${item}`).join("\n");
}

function commentedBlock(lines) {
  return lines.map((line) => `# ${line}`.trimEnd()).join("\n");
}

function bodyStub(collection) {
  switch (collection) {
    case "projects":
      return "Write the project overview here.\n";
    case "writing":
      return "Start writing here.\n";
    case "notes":
      return "Start noting here.\n";
    case "references":
      return "## What stayed with me\n\nAdd the notes here.\n";
    case "work":
      return "Describe the work here.\n";
    case "now":
      return "## Building\n\n- \n";
    default:
      return "";
  }
}

export function renderTemplate(collection, { slug, date }) {
  const dateOnly = date.slice(0, 10);
  const title = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  switch (collection) {
    case "projects":
      return `---
title: ${JSON.stringify(title || "New Project")}
summary: ${JSON.stringify("Short project summary.")}
status: prototype
stack: ${yamlList([])}
tags: ${yamlList([])}
order: 0
updatedAt: ${dateOnly}
featured: false
detailsPage: true
seo:
  title: ${JSON.stringify(title || "New Project")}
  description: ${JSON.stringify("What this project is and why it exists.")}
${commentedBlock([
  "company:",
  "  name: Company Name",
  "  slug: company-slug",
  "yearStarted: 2026",
  "yearEnded: 2026",
  `source: ${exampleUrl}`,
  `website: ${exampleUrl}`,
  `demo: ${exampleUrl}`,
  "seo:",
  "  canonical: /projects/project-slug",
  "  image: /og-images/projects/project-slug.png",
  "  noindex: false",
])}
---

${bodyStub(collection)}`;
    case "writing":
      return `---
title: ${JSON.stringify(title || "New Writing")}
publishedAt: ${dateOnly}
summary: ${JSON.stringify("Short summary for the writing index and SEO.")}
tags: ${yamlList([])}
featured: false
order: 0
kind: blog
draft: true
seo:
  title: ${JSON.stringify(title || "New Writing")}
  description: ${JSON.stringify("SEO description for this piece.")}
# seo:
#   canonical: /writing/${slug}
#   image: /og-images/writing/${slug}.png
#   noindex: false
---

${bodyStub(collection)}`;
    case "notes":
      return bodyStub(collection);
    case "references":
      return `---
title: ${JSON.stringify(title || "New Reference")}
type: other
summary: ${JSON.stringify("Why this reference matters.")}
featured: false
publishedAt: ${dateOnly}
${commentedBlock([
  "creator: Author Name",
  "year: 2026",
])}
seo:
  title: ${JSON.stringify(title || "New Reference")}
  description: ${JSON.stringify("SEO description for this reference.")}
# seo:
#   canonical: /references/reference-slug
#   image: /og-images/references/reference-slug.png
#   noindex: false
---

${bodyStub(collection)}`;
    case "work":
      return `---
title: ${JSON.stringify(title || "New Work Entry")}
summary: ${JSON.stringify("What this work involved.")}
company: ${JSON.stringify("Company Name")}
url: ${exampleUrl}
role: ${JSON.stringify("Role")}
period: ${JSON.stringify("2026 - present")}
order: 0
seo:
  title: ${JSON.stringify(title || "New Work Entry")}
  description: ${JSON.stringify("SEO description for this work entry.")}
# seo:
#   canonical: /work/work-slug
#   image: /og-images/work/work-slug.png
#   noindex: false
---

${bodyStub(collection)}`;
    case "now":
      return `---
title: ${JSON.stringify("Current focus")}
summary: ${JSON.stringify("Short-form status board for what is active right now.")}
updatedAt: ${dateOnly}
tags: ${yamlList([])}
links: ${yamlList([])}
seo:
  title: ${JSON.stringify(`Now · ${dateOnly}`)}
  description: ${JSON.stringify("The latest snapshot of what currently has my attention.")}
# seo:
#   canonical: /now/${slug}
#   noindex: false
---

${bodyStub(collection)}`;
    default:
      throw new Error(`Unsupported collection: ${collection}`);
  }
}
