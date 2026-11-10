import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const renderer=readFileSync(new URL("../assets/office-3d.js",import.meta.url),"utf8");
const page=readFileSync(new URL("../index.html",import.meta.url),"utf8");
test("3D office includes a compact analog wall clock made from shared-buffer geometry",()=>{
 assert.ok(renderer.includes("const clockX=4.65,clockY=2.95,clockFaceZ=-4.69"));
 assert.ok(renderer.includes("for(let mark=0;mark<12;mark++)"));
 assert.ok(renderer.includes("Fixed 10:10 hands are decorative geometry, not a live clock reading."));
 assert.ok(renderer.includes("segment([clockX,clockY,clockFaceZ+.045]"));
 assert.ok(page.includes("office-3d.js?v=72"));
});
