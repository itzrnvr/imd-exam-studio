import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished study dashboard", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Start Here \| IMD Exam Studio<\/title>/i);
  assert.match(html, /Understand it visually/);
  assert.match(html, /6-7 hour rescue plan/);
  assert.match(html, /Interactive labs/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("all core study routes render meaningful content", async () => {
  const expectations = [
    ["/guide", /Complete Intelligent Model Design guide/],
    ["/labs", /Interactive numerical tutorials/],
    ["/practice", /Numerical workbook/],
    ["/mocks", /Three complete 100-mark mock papers/],
    ["/formulas", /Formula and symbol sheet/],
  ];

  for (const [pathname, pattern] of expectations) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    assert.match(html, pattern, pathname);
  }
});

test("the finished source is light-mode, interactive, and starter-free", async () => {
  const [css, labs, packageJson] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/InteractiveLabs.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(css, /color-scheme:\s*light/);
  assert.match(css, /\.pixel-grid/);
  assert.match(css, /\.memory-flow/);
  assert.match(css, /\.attention-bars/);
  assert.match(labs, /N_out = floor/);
  assert.match(labs, /Every symbol/);
  assert.match(labs, /x_adv = clip/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
