import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const renderer=readFileSync(new URL("../assets/office-3d.js",import.meta.url),"utf8");
test("seated workers keep independent geometry ranges",()=>{
 assert.match(renderer,/headStart,headEnd,armsStart,armsEnd,handsStart,handsEnd/);
 assert.match(renderer,/workerRanges.push/);
});
test("worker states drive differentiated lightweight desk activity",()=>{
 for(const state of ["st-w","st-t","st-a","st-s","st-f","st-r"])assert.match(renderer,new RegExp('worker\\.state==="'+state+'"'));
 assert.match(renderer,/arms=Math.sin\(seconds\*12\+worker.index\)\*.085/);
 assert.match(renderer,/hands=Math.abs\(Math.sin\(seconds\*16\+worker.index\)\)\*.055/);
 assert.match(renderer,/monitorShift=/);
});
test("reduced-motion preference slows character animation but never freezes the office",()=>{
 assert.match(renderer,/prefers-reduced-motion/);
 assert.match(renderer,/motionScale=reducedMotion?0.72:1/);
 assert.match(renderer,/const seconds=timestamp*.001*motionScale/);
 assert.doesNotMatch(renderer,/if\(!reducedMotion\)/);
});
test("workers no longer use navigation routes",()=>{
 assert.doesNotMatch(renderer,/function sampleRoute/);
 assert.doesNotMatch(renderer,/route=sampleRoute/);
 assert.doesNotMatch(renderer,/walkX|walkZ|walkLift/);
});
test("thinking and approval states retain distinct visual markers",()=>{
 assert.match(renderer,/worker.state==="st-t"/);
 assert.match(renderer,/worker.state==="st-a"/);
 assert.match(renderer,/office-worker-typing-bubble/);
});
