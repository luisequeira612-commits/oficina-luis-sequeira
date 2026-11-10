import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const renderer=readFileSync(new URL("../assets/office-3d.js",import.meta.url),"utf8");
const css=readFileSync(new URL("../assets/office-view.css",import.meta.url),"utf8");
test("resting workers use clear inter-column aisles and return to their own desk",()=>{
 assert.match(renderer,/const laneX=col===0\?-1\.82:col===1\?1\.82:5\.48/);
 assert.match(renderer,/restZ:-3\.2/);
 assert.match(renderer,/rest=\[worker\.laneX,worker\.restZ\],path=\[start,lane,rest\]/);
 assert.match(renderer,/const returning=phase>=oneWay\+dwell/);
 assert.match(renderer,/const speed=\.82,dwell=3\.8/);
 assert.match(renderer,/for\(const stationX of \[-1\.82,1\.82,5\.48\]\)/);
});
test("resting workers pause at the break point and animate their legs",()=>{
 assert.match(renderer,/paused:true/);
 assert.match(renderer,/route\.paused\?\.012/);
 assert.match(renderer,/Math\.sin\(stridePhase\)\*\.085/);
});
test("monitor remains attached to the desk while the employee moves",()=>{
 assert.match(renderer,/worker\.monitorStart;i<worker\.monitorEnd;i\+=3/);
 assert.doesNotMatch(renderer,/axis===2\?walkZ:0\)\}\)for\(let i=worker\.monitorStart/);
 assert.match(renderer,/worker\.monitorStart\+1;i<worker\.monitorEnd;i\+=3\)scene\.data\[i\]=scene\.basePositions\[i\]/);
});
test("employee focus places the figure higher and leaves a scrollable details sheet",()=>{
 assert.match(renderer,/target=\[worker\.x,1\.12,worker\.z\+1\.05\]/);
 assert.match(css,/\.office-employee-card\{bottom:calc\(132px \+ env\(safe-area-inset-bottom\)\);max-height:27vh;overflow:auto/);
});
test("custom WebGL renderer adds view-dependent highlights to the plastic finish",()=>{
 assert.match(renderer,/vViewPosition/);
 assert.match(renderer,/pow\(max\(dot\(reflect\(-keyLight,n\),viewDir\),0\.0\),48\.0\)/);
});

test("resting employees stand to leave the chair and sit back at their workstation",()=>{
 assert.match(renderer,/away:travel>\.08/);
 assert.match(renderer,/walkLift=route\.away\?\.14:0/);
 assert.match(renderer,/liftFactor=Math\.max\(0,Math\.min\(1,\(baseY-\.35\)\/\.53\)\)/);
 assert.match(renderer,/route\.away\?Math\.sin\(seconds\*2\.2\+worker\.index\)\*\.008:0/);
});
