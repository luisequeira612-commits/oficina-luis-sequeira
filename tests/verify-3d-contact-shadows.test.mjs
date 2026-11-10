import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("procedural floor shadows use layered rings and upward-facing geometry", () => {
  assert.match(renderer, /Layered opaque floor shadows add contact and visual grounding/);
  assert.match(renderer, /const shadow=\(cx,cz,rx,rz\)=>/);
  assert.match(renderer, /bands=\[\{r:1\.00,c:/);
  assert.match(renderer, /addTri\(\[cx,y,cz\]/);
});

test("workstations, chairs and lounge receive contact shadows", () => {
  assert.match(renderer, /shadow\(x,z\+\.18,1\.78,1\.12\);shadow\(x,z\+1\.55,\.78,\.72\)/);
  assert.match(renderer, /shadow\(4\.45,1\.70,1\.62,\.92\)/);
});
