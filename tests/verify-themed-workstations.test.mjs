import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("project themes carry through to desk accessories and floor accents", () => {
  assert.match(renderer, /box\(0,\.056,1\.7,8\.8,\.018,\.10,themeColor\)/, "the room rug carries the project's accent color");
  assert.match(renderer, /Small themed desk objects repeat the room identity/, "every workstation receives a theme detail");
  for (const theme of ["guardi", "video", "launcher", "charts"]) {
    assert.match(renderer, new RegExp('projectTheme==="'+theme+'"'), theme + " has a matching desk accessory");
  }
  assert.match(renderer, /A neutral modular display for user-created projects/, "custom projects keep a neutral wall installation");
  assert.match(renderer, /box\(x-\.78,1\.06,z\+\.12,\.34,\.08,\.30,themeColor\)/, "custom projects receive a neutral modular desk object");
});
