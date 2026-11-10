import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("connected 3D rooms have distinct corridor-facing entrances", () => {
  assert.match(renderer, /roomAccentPalette/, "project rooms receive a repeatable accent palette");
  assert.match(renderer, /boxDetail\(portalX,1\.34,zCenter-1\.08/, "each entrance has a first structural post");
  assert.match(renderer, /boxDetail\(portalX,2\.78,zCenter/, "each entrance has a visible header");
  assert.match(renderer, /boxDetail\(portalX,3\.12,zCenter/, "each entrance has a project marker");
  assert.match(renderer, /boxDetail\(portalX-side\*\.54/, "each entrance has a floor runner into the room");
  assert.match(renderer, /side=col===0\?1:-1/, "left and right room rows face the central corridor");
});
