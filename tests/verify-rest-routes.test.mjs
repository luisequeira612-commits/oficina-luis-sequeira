import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const renderer=readFileSync(new URL("../assets/office-3d.js",import.meta.url),"utf8");
const css=readFileSync(new URL("../assets/office-view.css",import.meta.url),"utf8");
test("resting employees no longer leave their desks",()=>{
 assert.doesNotMatch(renderer,/sampleRoute/);
 assert.doesNotMatch(renderer,/restZ:2.0+row/);
 assert.doesNotMatch(renderer,/speed=1.0,dwell=3.8/);
 assert.doesNotMatch(renderer,/Math.atan2\(route/);
});
test("seated workers keep the monitor fixed while their body animates",()=>{
 assert.ok(renderer.includes("for(let i=worker.monitorStart;i<worker.monitorEnd;i+=3)"));
 assert.ok(renderer.includes("scene.basePositions[i]"));
 assert.match(renderer,/monitorShift/);
 assert.match(renderer,/worker.renderX=worker.x;worker.renderZ=worker.z/);
});
test("employee focus and details sheet remain unchanged",()=>{
 assert.match(renderer,/target=\[worker\.x,1\.12,worker\.z-1\.05\]/);
 assert.ok(css.includes(".office-employee-card{left:8px;right:8px;bottom:calc(132px + env(safe-area-inset-bottom));max-height:28vh;overflow:auto"));
});
test("custom WebGL renderer retains view-dependent plastic highlights",()=>{
 assert.match(renderer,/vViewPosition/);
 assert.match(renderer,/pow\(max\(dot\(reflect\(-keyLight,n\),viewDir\),0.0\),48.0\)/);
});
