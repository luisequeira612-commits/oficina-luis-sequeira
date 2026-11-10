import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("3D rooms derive a distinct visual identity from their project name", () => {
  assert.match(renderer, /function buildScene\(workers,roomName=/, "detailed rooms receive their project name");
  assert.match(renderer, /projectKey\.includes\("guardi"\)/, "Guardi has a dedicated room theme");
  assert.match(renderer, /projectKey\.includes\("youtube"\)/, "the YouTube room has a dedicated theme");
  assert.match(renderer, /projectKey\.includes\("nova"\)/, "the launcher room has a dedicated theme");
  assert.match(renderer, /projectKey\.includes\("babymonster"\)/, "BABYMONSTER Chart has a dedicated theme");
  assert.match(renderer, /scenes=rooms\.map\(room=>buildScene\(room\.workers\|\|\[\],room\.name\|\|""\)\)/, "the overview passes each room's name into its scene");
  assert.match(renderer, /scene=rooms&&rooms\.length\?buildOfficeScene\(rooms\):buildScene\(workers,roomName\)/, "the individual room view uses the same project identity");
  assert.match(renderer, /projectTheme==="charts"/, "the charts theme creates its own bar and music-note installation");
});
