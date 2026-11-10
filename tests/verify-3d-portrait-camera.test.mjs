import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");
test("portrait camera distance fits the full room width with side margin",()=>{
 assert.match(renderer,/12\/\(2\*Math\.tan\(\.86\/2\)\*aspect\*\.88\)/);
 assert.match(renderer,/if\(wasAtFit\|\|overviewMode\)radius=initialRadius/);
 assert.match(renderer,/Math\.abs\(aspect-cameraAspect\)>\.025/);
});
test("home restores the room framing",()=>{
 assert.match(renderer,/radius=initialRadius;target=\[0,1\.65,0\]/);
 assert.match(renderer,/minRadius=5\.5/);
});
test("employee focus brings the whole figure into view",()=>{
 assert.match(renderer,/target=\[worker\.x,1\.12,worker\.z\+1\.05\]/);
 assert.match(renderer,/radius=clamp\(5\.6,minRadius,maxRadius\)/);
});
