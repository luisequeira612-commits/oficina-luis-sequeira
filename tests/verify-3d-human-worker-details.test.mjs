import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("3D workers use original brick-built minifigure proportions", () => {
  assert.ok(renderer.includes("Original brick-built minifigure proportions"), "uses compact, readable minifigure geometry");
  assert.ok(renderer.includes("Hair pieces are compact block-compatible caps"), "supports varied hair and accessories");
  assert.ok(renderer.includes("Rectangular torso with broad shoulders"), "keeps a block-built torso");
  assert.ok(renderer.includes("small role badge"), "retains a role marker");
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
  assert.match(renderer, /worker\.state==="st-s"/);
  assert.match(renderer, /worker\.state==="st-f"/);
});


test("connected overview offsets head and hand ranges with each room geometry", () => {
  assert.match(renderer, /headStart:worker\.headStart\+posStart/);
  assert.match(renderer, /headEnd:worker\.headEnd\+posStart/);
  assert.match(renderer, /handsStart:worker\.handsStart\+posStart/);
  assert.match(renderer, /handsEnd:worker\.handsEnd\+posStart/);
});

test("camera uses bounded drag navigation and deliberate limited rotation", () => {
  assert.match(renderer, /target\[0\]=clamp\(target\[0\]-dx\*\.018,-4\.8,4\.8\)/);
  assert.match(renderer, /target\[2\]=clamp\(target\[2\]\+dy\*\.018,-7\.5,7\.5\)/);
  assert.match(renderer, /theta=clamp\(theta\+\.14,-\.35,1\.78\)/);
  assert.match(renderer, /Centrar oficina/);
});
