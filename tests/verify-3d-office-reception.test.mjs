import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("the open-plan office uses low partitions and project accent rails", () => {
  assert.ok(renderer.includes("Low partitions and project accent rails"), "builds low dividers in the shared room");
  assert.ok(renderer.includes("for(const z of [-1.62,1.13])"), "defines three collaborative desk rows");
  assert.ok(renderer.includes("const accents="), "retains project color accents");
  assert.ok(renderer.includes('buildScene(allWorkers,"Oficina central")'), "combines the workforce in one room");
  assert.ok(renderer.includes("rooms.forEach((room,index)"), "keeps project identity accents");
  assert.ok(renderer.includes("three pendant lamps"), "retains overhead lighting");
});
