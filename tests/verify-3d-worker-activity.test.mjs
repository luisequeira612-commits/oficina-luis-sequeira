import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("minifigure activity keeps independent posture ranges", () => {
  assert.match(renderer, /legsStart,legsEnd/);
  assert.match(renderer, /bodyStart:legsEnd/);
  assert.match(renderer, /headShift=0,armShift=0/);
});

test("live worker states drive differentiated micro-movements", () => {
  assert.match(renderer, /worker\.state==="st-w"/);
  assert.match(renderer, /worker\.state==="st-t"/);
  assert.match(renderer, /worker\.state==="st-a"/);
  assert.match(renderer, /worker\.state==="st-s"/);
  assert.match(renderer, /worker\.state==="st-f"/);
  assert.match(renderer, /foot=Math\.sin/);
  assert.match(renderer, /body=-Math\.abs/);
});

test("motion remains reduced-motion aware", () => {
  assert.match(renderer, /prefers-reduced-motion/);
  assert.match(renderer, /if\(!reducedMotion\)/);
});
