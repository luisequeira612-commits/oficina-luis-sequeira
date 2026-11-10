import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const renderer = read("assets/office-3d.js");

test("3D workstations include finished furniture and office planning details", () => {
  assert.match(renderer, /Two-drawer pedestal/, "adds a drawer pedestal to each desk");
  assert.match(renderer, /recessed cable tray/, "adds under-desk cable management");
  assert.match(renderer, /Padded armrests/, "finishes the task chair silhouette");
  assert.match(renderer, /Front-facing tower vents/, "adds visible computer tower details");
  assert.match(renderer, /wall-mounted planning board/, "adds a shared office planning board");
  assert.match(renderer, /function buildScene/, "keeps geometry in the existing room renderer");
});

test("3D building overview defines its own reception metal material", () => {
  const overview = renderer.slice(renderer.indexOf("function buildOfficeScene"), renderer.indexOf("function open("));
  assert.ok(overview.includes("const metal=["), "prevents an out-of-scope material reference from aborting the overview");
});

test("3D startup failures remain visible outside the hidden overview canvas",()=>{
 const renderer=read("assets/office-3d.js");
 const view=read("assets/office-view.js");
 const html=read("index.html");
 assert.match(renderer,/window\.Office3D\.lastError=null/);
 assert.match(renderer,/El navegador no proporcionó un contexto WebGL 2/);
 assert.match(view,/overviewStatus\.textContent=renderedOverview\?"":\(window\.Office3D\?/);
 assert.match(html,/id="office-3d-status"[^>]*role="status"/);
 assert.match(html,/office-3d\.js\?v=\d+/);
 assert.match(html,/office-view\.js\?v=34/);
});
