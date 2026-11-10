import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const view = readFileSync(new URL("../assets/office-view.js", import.meta.url), "utf8");

test("immersive Tycoon HUD refreshes its employee count on every map render", () => {
  assert.match(view, /const subtitle=top\.querySelector\("\.office-tycoon-heading span"\);if\(subtitle\)subtitle\.textContent=data\.reduce\(\(n,r\)=>n\+r\.workers\.length,0\)/);
});
