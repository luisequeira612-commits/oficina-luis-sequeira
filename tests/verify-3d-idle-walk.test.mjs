import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("waiting workers use a bounded ambient walk cycle", () => {
  assert.match(renderer, /worker\.state==="st-a"/);
  assert.match(renderer, /walkX=walk\*\.16/);
  assert.match(renderer, /walkZ=Math\.cos/);
  assert.match(renderer, /axis===0\?walkX/);
});

test("walking stays local to the existing workstation area", () => {
  assert.match(renderer, /walkX\+armShift/);
  assert.match(renderer, /walkX\+headShift/);
  assert.match(renderer, /walkX\+armShift\*\.8/);
  assert.match(renderer, /prefers-reduced-motion/);
});
