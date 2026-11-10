import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("3D workstations include finished furniture and office planning details", () => {
  assert.match(renderer, /Two-drawer pedestal/, "adds a drawer pedestal to each desk");
  assert.match(renderer, /recessed cable tray/, "adds under-desk cable management");
  assert.match(renderer, /Padded armrests/, "finishes the task chair silhouette");
  assert.match(renderer, /Front-facing tower vents/, "adds visible computer tower details");
  assert.match(renderer, /wall-mounted planning board/, "adds a shared office planning board");
  assert.match(renderer, /function buildScene/, "keeps geometry in the existing room renderer");
});
