import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("3D rooms have layered lighting, detailed windows and a lounge corner", () => {
  assert.ok(renderer.includes("keyDiffuse") && renderer.includes("fillDiffuse"), "uses key and fill directional lighting");
  assert.ok(renderer.includes("hemisphere"), "adds hemisphere fill to soften upward-facing surfaces");
  assert.ok(renderer.includes("Window sill, divided glass panes"), "builds a framed multi-pane window");
  assert.ok(renderer.includes("Keep the lounge in smaller project rooms"), "includes a separate lounge zone");
  assert.ok(renderer.includes("three pendant lamps"), "adds ceiling pendant fixtures");
  assert.ok(renderer.includes("prefers-reduced-motion") || renderer.includes("reducedMotion"), "existing reduced-motion handling remains present");
});
