import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const atmosphere=readFileSync(new URL("../assets/office-3d-atmosphere.css",import.meta.url),"utf8");
const view=readFileSync(new URL("../assets/office-view.css",import.meta.url),"utf8");
const page=readFileSync(new URL("../index.html",import.meta.url),"utf8");
test("3D office atmosphere uses layered ambient light without scene animation",()=>{
 assert.ok(atmosphere.includes("radial-gradient(ellipse at 18% 12%"));
 assert.ok(atmosphere.includes("radial-gradient(ellipse at 82% 18%"));
 assert.ok(atmosphere.includes("inset 0 -24px 42px"));
 assert.ok(view.includes("office-3d-atmosphere.css?v=2"));
 assert.ok(page.includes("office-view.css?v=50"));
 assert.equal(/@keyframes/.test(atmosphere),false);
});
