import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("office scripts load synchronously in dependency order", () => {
  const workers = html.indexOf('src="assets/human-workers.js?v=41"');
  const engine = html.indexOf('src="assets/office-3d.js?v=50"');
  const view = html.indexOf('src="assets/office-view.js?v=46"');
  assert.ok(workers >= 0 && engine > workers && view > engine);
  const tags = [
    html.slice(html.lastIndexOf("<script", workers), html.indexOf(">", workers) + 1),
    html.slice(html.lastIndexOf("<script", engine), html.indexOf(">", engine) + 1),
    html.slice(html.lastIndexOf("<script", view), html.indexOf(">", view) + 1),
  ];
  assert.ok(tags.every(tag => !/\sdefer(?:\s|>)/i.test(tag)));
});

test("3D engine download failure has a distinct visible diagnostic", () => {
  assert.match(html, /onerror="[^"]*office-3d-status/);
  assert.match(html, /No se pudo descargar assets\/office-3d\.js/);
});
