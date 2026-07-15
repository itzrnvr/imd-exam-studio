import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const source = resolve("dist/client");
const destination = resolve("dist/github-pages");
const basePath = (process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? "/imd-exam-studio").replace(/\/$/, "");
const baseSegment = basePath.slice(1).replace(/[.*+?^$()|[\]\\]/g, "\\$&");
const notAlreadyPrefixed = `(?!${baseSegment}/)`;

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

async function rewriteTextFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteTextFiles(filePath);
      continue;
    }
    if (!/\.(html|rsc)$/i.test(entry.name)) continue;

    const content = await readFile(filePath, "utf8");
    const rewritten = content
      .replace(new RegExp(`href="/${notAlreadyPrefixed}`, "g"), `href="${basePath}/`)
      .replace(new RegExp(`src="/${notAlreadyPrefixed}`, "g"), `src="${basePath}/`)
      .replace(new RegExp(`import\\("/${notAlreadyPrefixed}`, "g"), `import("${basePath}/`)
      .replace(new RegExp(`url\\("/${notAlreadyPrefixed}`, "g"), `url("${basePath}/`)
      .replace(new RegExp(`\\\\\\"/${notAlreadyPrefixed}`, "g"), `\\\"${basePath}/`);

    if (rewritten !== content) await writeFile(filePath, rewritten);
  }
}

await rewriteTextFiles(destination);
