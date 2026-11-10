import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("portrait canvases receive a wider initial camera distance", () => {
  assert.match(renderer, /baseRadius\*Math\.max\(1,0\.92\/aspect\)/);
  assert.match(renderer, /initialRadius=baseRadius\*Math\.max/);
  assert.match(renderer, /cameraFitDone=true/);
});

test("recenter restores the aspect-fitted camera and mobile zoom range", () => {
  assert.match(renderer, /radius=initialRadius;target=\[0,1\.15,0\]/);
  assert.match(renderer, /Math\.max\(23,initialRadius\*1\.65\)/);
});
