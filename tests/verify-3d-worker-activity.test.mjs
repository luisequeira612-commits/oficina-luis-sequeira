import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("minifigure activity keeps independent posture ranges", () => {
  assert.match(renderer, /legsStart,legsEnd/);
  assert.match(renderer, /bodyStart:legsEnd/);
  assert.match(renderer, /headShift=0,armShift=0/);
});

test("live worker states drive differentiated micro-movements", () => {
  assert.match(renderer, /worker\.state==="st-w"/);
  assert.match(renderer, /worker\.state==="st-t"/);
  assert.match(renderer, /worker\.state==="st-a"/);
  assert.match(renderer, /worker\.state==="st-s"/);
  assert.match(renderer, /worker\.state==="st-f"/);
  assert.match(renderer, /foot=route\.away&&!route\.paused\?Math\.sin/);
  assert.match(renderer, /body=-Math\.abs/);
});

test("motion remains reduced-motion aware", () => {
  assert.match(renderer, /prefers-reduced-motion/);
  assert.match(renderer, /if\(!reducedMotion\)/);
});


test("worker states map to visible behavior",()=>{assert.match(renderer,/worker\.state==="st-r"\)\{const route=sampleRoute/);assert.match(renderer,/worker\.state==="st-a"\)\{bob=/);assert.match(renderer,/office-worker-typing-bubble/);assert.match(renderer,/worker\.state!=="st-w"/)});


test("resting workers follow an aisle route while desk monitors stay fixed and animate code",()=>{assert.match(renderer,/function sampleRoute\(worker,seconds\)/);assert.match(renderer,/laneX/);assert.match(renderer,/restZ:3\.2/);assert.match(renderer,/worker\.monitorStart/);assert.match(renderer,/monitorShift/);assert.match(renderer,/codeRow<7/);assert.doesNotMatch(renderer,/axis===2\?walkZ:0\)\}\)for\(let i=worker\.monitorStart/)});


test("thinking workers receive their own visual marker, not the awaiting-approval marker",()=>{
 assert.match(renderer,/else if\(worker\.state==="st-t"\)\{sphere\(x,2\.62,z\+\.96,\.11,\.11,\.11,\[\.24,\.78,\.88\]/);
 assert.match(renderer,/else if\(worker\.state==="st-a"\)\{sphere\(x\+\.44,2\.55,z\+\.95,\.13,\.13,\.13,\[\.98,\.78,\.25\]/);
});
