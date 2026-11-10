import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const viewCss = readFileSync(new URL("../assets/office-view.css", import.meta.url), "utf8");
const atmosphereCss = readFileSync(new URL("../assets/office-3d-atmosphere.css", import.meta.url), "utf8");

test("connected 3D overview receives a lightweight visual finish", () => {
  assert.ok(viewCss.startsWith('@import url("./office-3d-atmosphere.css?v=2");'), "atmosphere stylesheet loads before the existing rules");
  assert.match(atmosphereCss, /\.office-3d-overview::before/, "subtle floor-grid overlay is present");
  assert.match(atmosphereCss, /VISTA 3D · EXPLORABLE/, "the scene is clearly labelled as an explorable 3D view");
  assert.match(atmosphereCss, /counter\(room,decimal-leading-zero\)/, "room navigation has ordered visual markers");
  assert.match(atmosphereCss, /button:focus-visible/, "room navigation remains keyboard-focusable");
  assert.match(atmosphereCss, /@media\(max-width:420px\)/, "navigation is tuned for narrow mobile screens");
  assert.match(atmosphereCss, /@media\(prefers-reduced-motion:reduce\)/, "motion-sensitive preferences are respected");
});
