import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const renderer=readFileSync(new URL("../assets/office-3d.js",import.meta.url),"utf8");
test("resting workers remain seated and use only lightweight ambient motion",()=>{
 assert.match(renderer,/worker.state==="st-r"/);
 assert.match(renderer,/bob=Math.sin\(seconds\*1.8\+worker.index\)\*.008/);
 assert.match(renderer,/body=Math.sin\(seconds\*1.4\+worker.index\)\*.006/);
 assert.doesNotMatch(renderer,/sampleRoute/);
 assert.doesNotMatch(renderer,/walkX|walkZ|walkLift/);
});
test("desk animation does not translate the workstation or monitor",()=>{
 assert.match(renderer,/worker.renderX=worker.x;worker.renderZ=worker.z/);
 assert.match(renderer,/worker.monitorStart/);
 assert.match(renderer,/scene.basePositions[i]/);
 assert.doesNotMatch(renderer,/axis===2?walkZ/);
});
