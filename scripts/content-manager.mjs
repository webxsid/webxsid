import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { input, select } from "@inquirer/prompts";
import { renderTemplate } from "./content-templates.mjs";

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "src", "content");
const vaultRoot = path.join(
  process.env.HOME ?? "",
  "Library",
  "Mobile Documents",
  "iCloud~md~obsidian",
  "Documents",
  "Webxsid",
  "Portfolio",
);
const collectionNames = ["projects", "writing", "references", "work", "now"];
const collections = new Set(collectionNames);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function getTodayLocalDate() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;

  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

function normalizeSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function ensureCollection(collection) {
  if (!collections.has(collection)) {
    fail(`Unsupported collection "${collection}". Expected one of: ${[...collections].join(", ")}`);
  }
}

function collectionChoices() {
  return collectionNames.map((collection) => ({
    name: collection,
    value: collection,
  }));
}

function getSlugPromptDefault(collection) {
  switch (collection) {
    case "projects":
      return "new-project";
    case "writing":
      return "new-writing";
    case "references":
      return "new-reference";
    case "work":
      return "new-work-entry";
    case "now":
      return getTodayLocalDate();
    default:
      return "";
  }
}

function repoFilePath(collection, slug) {
  return path.join(contentRoot, collection, `${slug}.md`);
}

function vaultFilePath(collection, slug) {
  return path.join(vaultRoot, collection, `${slug}.md`);
}

async function pathExists(targetPath) {
  try {
    await fs.lstat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(targetPath) {
  await fs.mkdir(targetPath, { recursive: true });
}

async function relativeSymlink(target, linkPath) {
  const relativeTarget = path.relative(path.dirname(linkPath), target);
  await fs.symlink(relativeTarget, linkPath);
}

async function safeLstat(targetPath) {
  try {
    return await fs.lstat(targetPath);
  } catch {
    return null;
  }
}

async function resolveSymlinkTarget(linkPath) {
  return fs.realpath(linkPath).catch(() => null);
}

function splitRelativeFile(relFile) {
  const [collection, ...rest] = relFile.split(path.sep);
  const slug = rest.join(path.sep).replace(/\.md$/, "");

  return { collection, slug };
}

async function getRepoEntries() {
  const relFiles = await collectRepoFiles(contentRoot);

  return relFiles.map((relFile) => {
    const { collection, slug } = splitRelativeFile(relFile);

    return {
      collection,
      slug,
      repoPath: repoFilePath(collection, slug),
      vaultPath: vaultFilePath(collection, slug),
    };
  });
}

async function chooseCollection(message = "Choose a collection") {
  return select({
    message,
    choices: collectionChoices(),
  });
}

async function promptForSlug(message, defaultValue = "") {
  return input({
    message,
    default: defaultValue || undefined,
    validate(value) {
      if (!normalizeSlug(value)) {
        return "Enter a valid slug.";
      }

      return true;
    },
  });
}

async function chooseExistingEntry(collection) {
  const entries = (await getRepoEntries())
    .filter((entry) => entry.collection === collection)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  if (entries.length === 0) {
    fail(`No entries found in "${collection}".`);
  }

  return select({
    message: `Choose a ${collection} entry to delete`,
    choices: entries.map((entry) => ({
      name: entry.slug,
      value: entry.slug,
      description: entry.repoPath,
    })),
  });
}

async function inspectEntry(entry) {
  const stat = await safeLstat(entry.vaultPath);

  if (!stat) {
    return {
      ...entry,
      state: "missing-vault-symlink",
      resolvedTarget: null,
    };
  }

  if (!stat.isSymbolicLink()) {
    return {
      ...entry,
      state: "vault-conflict",
      resolvedTarget: null,
    };
  }

  const resolvedTarget = await resolveSymlinkTarget(entry.vaultPath);

  if (!resolvedTarget) {
    return {
      ...entry,
      state: "broken-symlink",
      resolvedTarget: null,
    };
  }

  if (path.resolve(resolvedTarget) !== path.resolve(entry.repoPath)) {
    return {
      ...entry,
      state: "wrong-target-symlink",
      resolvedTarget,
    };
  }

  return {
    ...entry,
    state: "linked",
    resolvedTarget,
  };
}

async function getVaultOnlyIssues() {
  const issues = [];

  for (const collection of collectionNames) {
    const collectionDir = path.join(vaultRoot, collection);
    const collectionStat = await safeLstat(collectionDir);

    if (!collectionStat || !collectionStat.isDirectory()) {
      continue;
    }

    const vaultFiles = await collectRepoFiles(collectionDir);

    for (const relFile of vaultFiles) {
      const slug = relFile.replace(/\.md$/, "");
      const repoPath = repoFilePath(collection, slug);
      const vaultPath = vaultFilePath(collection, slug);
      const repoExists = await pathExists(repoPath);

      if (repoExists) {
        continue;
      }

      const stat = await safeLstat(vaultPath);

      if (stat?.isSymbolicLink()) {
        issues.push({
          collection,
          slug,
          repoPath,
          vaultPath,
          state: "stale-symlink",
        });
      }
    }
  }

  return issues;
}

function formatState(state) {
  switch (state) {
    case "linked":
      return "linked";
    case "missing-vault-symlink":
      return "missing vault symlink";
    case "vault-conflict":
      return "vault conflict";
    case "broken-symlink":
      return "broken symlink";
    case "wrong-target-symlink":
      return "wrong target";
    case "stale-symlink":
      return "stale symlink";
    default:
      return state;
  }
}

async function syncSingleFile(collection, slug) {
  const sourcePath = repoFilePath(collection, slug);
  const targetPath = vaultFilePath(collection, slug);
  await ensureDir(path.dirname(targetPath));

  try {
    const stat = await fs.lstat(targetPath);

    if (stat.isSymbolicLink()) {
      const resolved = await fs.realpath(targetPath).catch(() => null);

      if (resolved && path.resolve(resolved) === path.resolve(sourcePath)) {
        return { status: "ok", targetPath };
      }

      await fs.rm(targetPath);
      await relativeSymlink(sourcePath, targetPath);
      return { status: "relinked", targetPath };
    }

    return { status: "conflict", targetPath };
  } catch {
    await relativeSymlink(sourcePath, targetPath);
    return { status: "created", targetPath };
  }
}

async function collectRepoFiles(dirPath, collection = "") {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const nextRelative = collection ? path.join(collection, entry.name) : entry.name;
    const nextPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectRepoFiles(nextPath, nextRelative)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(nextRelative);
    }
  }

  return files;
}

async function syncAll() {
  await ensureDir(vaultRoot);

  for (const collection of collections) {
    await ensureDir(path.join(vaultRoot, collection));
  }

  const relFiles = await collectRepoFiles(contentRoot);
  const summary = {
    created: 0,
    relinked: 0,
    ok: 0,
    conflicts: 0,
    staleRemoved: 0,
  };

  for (const relFile of relFiles) {
    const { collection, slug } = splitRelativeFile(relFile);
    const result = await syncSingleFile(collection, slug);
    summary[result.status] += 1;

    if (result.status === "conflict") {
      console.warn(`Conflict: ${result.targetPath} exists and is not a managed symlink.`);
    }
  }

  for (const issue of await getVaultOnlyIssues()) {
    await fs.rm(issue.vaultPath);
    summary.staleRemoved += 1;
  }

  console.log(
    [
      `Synced content mirror at ${vaultRoot}`,
      `created=${summary.created}`,
      `relinked=${summary.relinked}`,
      `ok=${summary.ok}`,
      `conflicts=${summary.conflicts}`,
      `staleRemoved=${summary.staleRemoved}`,
    ].join(" | "),
  );
}

async function createNew(collection, slugArg) {
  const resolvedCollection = collection ? normalizeSlug(collection) : await chooseCollection("Create in which collection?");
  ensureCollection(resolvedCollection);
  const rawSlug =
    slugArg ??
    (await promptForSlug(
      resolvedCollection === "now"
        ? "Slug for this now entry"
        : `Slug for the new ${resolvedCollection} entry`,
      getSlugPromptDefault(resolvedCollection),
    ));
  const slug = normalizeSlug(rawSlug ?? getSlugPromptDefault(resolvedCollection));

  if (!slug) {
    fail(`A slug is required for "${resolvedCollection}".`);
  }

  const sourcePath = repoFilePath(resolvedCollection, slug);
  const targetPath = vaultFilePath(resolvedCollection, slug);

  if (await pathExists(sourcePath)) {
    fail(`Repo file already exists: ${sourcePath}`);
  }

  await ensureDir(path.dirname(sourcePath));
  const template = renderTemplate(resolvedCollection, {
    slug,
    date: getTodayLocalDate(),
  });
  await fs.writeFile(sourcePath, template, "utf8");

  const result = await syncSingleFile(resolvedCollection, slug);

  if (result.status === "conflict") {
    fail(
      `Repo file created at ${sourcePath}, but vault path already exists as a non-symlink: ${targetPath}`,
    );
  }

  console.log(`Created repo file: ${sourcePath}`);
  console.log(`Linked in vault: ${targetPath}`);
}

async function deleteEntry(collection, slugArg) {
  const resolvedCollection = collection ? normalizeSlug(collection) : await chooseCollection("Delete from which collection?");
  ensureCollection(resolvedCollection);
  const slug = normalizeSlug(
    slugArg ?? (await chooseExistingEntry(resolvedCollection)),
  );

  if (!slug) {
    fail(`A slug is required for "${resolvedCollection}".`);
  }

  const sourcePath = repoFilePath(resolvedCollection, slug);
  const targetPath = vaultFilePath(resolvedCollection, slug);

  if (!(await pathExists(sourcePath))) {
    fail(`Repo file does not exist: ${sourcePath}`);
  }

  if (await pathExists(targetPath)) {
    const stat = await fs.lstat(targetPath);

    if (!stat.isSymbolicLink()) {
      fail(`Refusing to delete vault file because it is not a symlink: ${targetPath}`);
    }

    const resolved = await fs.realpath(targetPath).catch(() => null);

    if (resolved && path.resolve(resolved) !== path.resolve(sourcePath)) {
      fail(`Refusing to delete vault symlink because it points elsewhere: ${targetPath}`);
    }
  }

  await fs.rm(sourcePath);

  if (await pathExists(targetPath)) {
    await fs.rm(targetPath);
  }

  console.log(`Deleted repo file: ${sourcePath}`);
  console.log(`Removed vault link: ${targetPath}`);
}

async function listEntries() {
  const entries = await getRepoEntries();
  const inspected = await Promise.all(entries.map(inspectEntry));

  for (const collection of collectionNames) {
    const collectionEntries = inspected.filter((entry) => entry.collection === collection);

    if (collectionEntries.length === 0) {
      continue;
    }

    console.log(`${collection.toUpperCase()}`);

    for (const entry of collectionEntries) {
      console.log(`- ${entry.slug}`);
      console.log(`  state: ${formatState(entry.state)}`);
      console.log(`  repo: ${entry.repoPath}`);
      console.log(`  vault: ${entry.vaultPath}`);

      if (entry.resolvedTarget && entry.state !== "linked") {
        console.log(`  points-to: ${entry.resolvedTarget}`);
      }
    }
  }
}

async function doctorEntries() {
  const entries = await getRepoEntries();
  const inspected = await Promise.all(entries.map(inspectEntry));
  const staleIssues = await getVaultOnlyIssues();
  const problems = [
    ...inspected.filter((entry) => entry.state !== "linked"),
    ...staleIssues,
  ];

  if (problems.length === 0) {
    console.log("No content mirror issues found.");
    return;
  }

  const groupedStates = [
    "missing-vault-symlink",
    "broken-symlink",
    "wrong-target-symlink",
    "vault-conflict",
    "stale-symlink",
  ];

  for (const state of groupedStates) {
    const stateProblems = problems.filter((entry) => entry.state === state);

    if (stateProblems.length === 0) {
      continue;
    }

    console.log(`${formatState(state).toUpperCase()} (${stateProblems.length})`);

    for (const entry of stateProblems) {
      console.log(`- ${entry.collection}/${entry.slug}`);
      console.log(`  repo: ${entry.repoPath}`);
      console.log(`  vault: ${entry.vaultPath}`);

      if ("resolvedTarget" in entry && entry.resolvedTarget) {
        console.log(`  points-to: ${entry.resolvedTarget}`);
      }
    }
  }

  process.exitCode = 1;
}

async function main() {
  const [command, collection, slug] = process.argv.slice(2);

  switch (command) {
    case "sync":
      await syncAll();
      break;
    case "new":
      await createNew(collection, slug);
      break;
    case "delete":
      await deleteEntry(collection, slug);
      break;
    case "list":
      await listEntries();
      break;
    case "doctor":
      await doctorEntries();
      break;
    default:
      fail(
        "Usage: node scripts/content-manager.mjs <sync|new|delete|list|doctor> [collection] [slug]",
      );
  }
}

await main();
