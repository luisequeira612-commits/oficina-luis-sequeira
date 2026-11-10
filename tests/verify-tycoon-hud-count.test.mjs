import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const view = readFileSync(new URL("../assets/office-view.js", import.meta.url), "utf8");

test("immersive Tycoon HUD labels the counted LEGO minifigures accurately", () => {
  assert.match(view, /data\.reduce\(\(n,r\)=>n\+r\.workers\.length,0\)\+["'] empleados · minifiguras LEGO["']/);
  assert.doesNotMatch(view, /0 humanos/);
});
