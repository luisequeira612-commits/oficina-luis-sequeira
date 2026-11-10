import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("3D overview includes a reception atrium and visitor entrance", () => {
  assert.ok(renderer.includes("widened entrance atrium"), "builds a widened lobby at the corridor end");
  assert.ok(renderer.includes("Reception desk"), "includes a dedicated reception counter");
  assert.ok(renderer.includes("visible terminal"), "adds a visible reception computer terminal");
  assert.ok(renderer.includes("Tall welcome wall"), "adds a welcome wall and wayfinding sign");
  assert.ok(renderer.includes("visitor seating"), "adds seating and planters at the entrance");
  assert.ok(renderer.includes("Ceiling canopy"), "frames the public entrance with a canopy and downlights");
});
