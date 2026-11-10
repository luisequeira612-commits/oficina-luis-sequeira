import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer=readFileSync(new URL("../assets/office-3d.js",import.meta.url),"utf8");
const page=readFileSync(new URL("../index.html",import.meta.url),"utf8");

test("monitor header color reflects the live worker state",()=>{
 assert.ok(renderer.includes('worker.state==="st-w"?[0.12,0.62,0.46]'));
 assert.ok(renderer.includes('worker.state==="st-t"?[0.20,0.49,0.74]'));
 assert.ok(renderer.includes('worker.state==="st-a"?[0.91,0.67,0.18]'));
 assert.ok(renderer.includes('worker.state==="st-s"?[0.14,0.68,0.42]'));
 assert.ok(renderer.includes('worker.state==="st-f"?[0.78,0.18,0.22]:[0.40,0.46,0.52]'));
 assert.ok(renderer.includes("box(x,1.92,z-.245,.76,.028,.012,monitorStatusColor)"));
 assert.match(page,/office-3d\.js\?v=72/);
});
