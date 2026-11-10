import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("project-specific visual identity remains in individual project rooms", () => {
  assert.match(renderer, /function buildScene\(workers,roomName=/);
  assert.match(renderer, /projectKey\.includes\("guardi"\)/);
  assert.match(renderer, /projectKey\.includes\("youtube"\)/);
  assert.match(renderer, /projectKey\.includes\("nova"\)/);
  assert.match(renderer, /projectKey\.includes\("babymonster"\)/);
  assert.match(renderer, /rooms\.flatMap\(room=>\(room\.workers\|\|\[\]\)\.map/);
  assert.match(renderer, /projectName:room\.name\|\|"Proyecto"/);
  assert.match(renderer, /scene=rooms&&rooms\.length\?buildOfficeScene\(rooms\):buildScene\(workers,roomName\)/);
  assert.match(renderer, /projectTheme==="charts"/);
});
