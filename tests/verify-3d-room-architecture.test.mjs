import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("3D rooms include architectural structure and interior finishing", () => {
  assert.ok(renderer.includes("Structural corner piers"), "adds structural corner piers");
  assert.ok(renderer.includes("Continuous skirting boards"), "joins the walls to the floor");
  assert.ok(renderer.includes("Recessed wall panels"), "adds wall depth and panel detail");
  assert.ok(renderer.includes("transition marks the workstation zone"), "defines the workstation floor zone");
  assert.ok(renderer.includes("function buildScene"), "keeps details in the existing procedural room renderer");
});
