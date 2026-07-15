import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const source = resolve("dist/client");
const destination = resolve("dist/github-pages");
const basePath = (process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? "/imd-exam-studio").replace(/\/$/, "");

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
      .replaceAll('href="/', `href="${basePath}/`)
      .replaceAll('src="/', `src="${basePath}/`)
      .replaceAll('import("/', `import("${basePath}/`)
      .replaceAll('url("/', `url("${basePath}/`)
      .replaceAll('\\"/', `\\"${basePath}/`);

    if (rewritten !== content) await writeFile(filePath, rewritten);
  }
}

await rewriteTextFiles(destination);
