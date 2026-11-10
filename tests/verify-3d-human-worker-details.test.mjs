import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("3D human workers have readable facial and clothing details", () => {
  assert.ok(renderer.includes("Facial features are deliberately simple"), "documents the mobile-scale face detail");
  assert.ok(renderer.includes("Alternating subtle glasses"), "adds deterministic accessory variation");
  assert.ok(renderer.includes("Shirt collar, placket"), "adds tailored clothing detail");
  assert.ok(renderer.includes("role badge"), "adds a small clothing badge");
  assert.ok(renderer.includes("workerRanges.push"), "keeps worker geometry inside the existing animation range");
});


test("worker animation separates head, arms and typing hands by simulated state", () => {
  assert.match(renderer, /const headStart=positions\.length/);
  assert.match(renderer, /const handsStart=positions\.length/);
  assert.match(renderer, /headStart,headEnd,armsStart,armsEnd,handsStart,handsEnd/);
  assert.match(renderer, /Math\.abs\(Math\.sin\(seconds\*16\+worker\.index\)\)\*\.045/);
  assert.match(renderer, /worker\.headStart\+1/);
  assert.match(renderer, /worker\.handsStart\+1/);
  assert.match(renderer, /prefers-reduced-motion/);
});
