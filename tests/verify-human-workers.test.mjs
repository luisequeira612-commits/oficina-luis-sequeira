import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const workerScript = readFileSync(new URL("../assets/human-workers.js", import.meta.url), "utf8");
const workerCss = readFileSync(new URL("../assets/human-workers.css", import.meta.url), "utf8");

test("minifigure Tycoon workers replace bird artwork at runtime without rewriting approved SVG source", () => {
  assert.match(html, /assets\/human-workers\.css/);
  assert.match(html, /assets\/human-workers\.js/);
  assert.match(workerScript, /legacy-bird-avatar/);
  assert.match(workerScript, /\.human-worker/);
  assert.match(workerCss, /\.legacy-bird-avatar\{display:none!important\}/);
  assert.match(workerScript, /new MutationObserver\(decorate\)/);
});

test("the workforce balances women and men globally and cycles through three skin-tone palettes", () => {
  assert.match(workerScript, /index % 2 === 0 \? "woman" : "man"/);
  assert.match(workerScript, /\["light", "medium", "deep"\]/);
  assert.match(workerScript, /\["short", "long", "curly", "tied"\]/);
  assert.match(workerScript, /\["blue", "coral", "teal", "mustard", "plum"\]/);
});

test("minifigure workers retain distinct work, thinking, waiting and resting animations", () => {
  for (const state of ["st-w", "st-t", "st-a", "st-r"]) {
    assert.ok(workerCss.includes(".ag." + state), "missing animation state " + state);
  }
  assert.match(workerCss, /prefers-reduced-motion:reduce/);
});

test("the character visuals are decorative and do not alter persisted agent records", () => {
  assert.match(workerScript, /"aria-hidden": "true"/);
  assert.doesNotMatch(workerScript, /localStorage|STORAGE_KEY|JSON\.stringify/);
  assert.doesNotMatch(workerScript, /fetch\(|XMLHttpRequest/);
});

test("worker avatars use the brick-built minifigure silhouette", () => {
  assert.match(workerScript, /Original minifigure silhouette/);
  assert.match(workerScript, /width: 28, height: 30/);
  assert.match(workerScript, /cx: 32, cy: 6\.5, r: 4/);
  assert.match(workerScript, /\["light", "medium", "deep"\]/);
});
