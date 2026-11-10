import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const view = readFileSync(new URL("../assets/office-view.js", import.meta.url), "utf8");
const page = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("normal office header shows the dynamic LEGO minifigure count", () => {
  assert.match(view, /const totalWorkers=roomData\.reduce\(\(n,room\)=>n\+room\.workers\.length,0\)/);
  assert.match(view, /headerSubtitle\.textContent=totalWorkers\+" empleados · minifiguras LEGO"/);
  assert.match(page, /office-header-subtitle">10 empleados · minifiguras LEGO</);
  assert.doesNotMatch(page, /0 humanos/);
});
