import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("room renderer keeps explicit architectural lighting geometry", () => {
  assert.match(renderer, /Ceiling fixtures create a visible overhead light source/);
  assert.match(renderer, /box\(-3\.0,3\.68,-1\.05,2\.15/);
  assert.match(renderer, /box\(1\.45,3\.68,-1\.05,2\.15/);
  assert.match(renderer, /Light bands on the ceiling\/floor axis/);
});

test("fragment lighting keeps key, fill and rim depth cues", () => {
  assert.match(renderer, /vec3 rimLight=normalize/);
  assert.match(renderer, /rimDiffuse/);
  assert.match(renderer, /float cavity=/);
  assert.match(renderer, /keyDiffuse\*0\.39/);
});
