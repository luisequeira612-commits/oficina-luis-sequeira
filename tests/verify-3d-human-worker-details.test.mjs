import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("3D workers use original brick-built minifigure proportions", () => {
  assert.ok(renderer.includes("Classic minifigure proportions"), "uses compact, readable minifigure geometry");
  assert.ok(renderer.includes("Classic minifigure"), "supports varied hair and accessories");
  assert.ok(renderer.includes("taperBox(x,1.29"), "keeps a block-built torso");
  assert.ok(renderer.includes("taperBox(x,1.30"), "adds a printed vest detail");
  assert.ok(renderer.includes("workerRanges.push"), "keeps worker geometry inside the existing animation range");
  assert.ok(renderer.includes("for(let sx=-5;sx<=5;sx+=1.25)"), "adds visible studs to the grey baseplate");
});


test("worker animation separates head, arms and typing hands by simulated state", () => {
  assert.match(renderer, /const headStart=positions\.length/);
  assert.match(renderer, /const handsStart=positions\.length/);
  assert.match(renderer, /headStart,headEnd,armsStart,armsEnd,handsStart,handsEnd/);
  assert.match(renderer, /Math\.abs\(Math\.sin\(seconds\*16\+worker\.index\)\)\*\.045/);
  assert.match(renderer, /worker\.headStart\+1/);
  assert.match(renderer, /worker\.handsStart\+1/);
  assert.match(renderer, /prefers-reduced-motion/);
  assert.match(renderer, /worker\.state==="st-s"/);
  assert.match(renderer, /worker\.state==="st-f"/);
});


test("the shared overview preserves animation ranges for all workers", () => {
  assert.match(renderer, /const allWorkers=rooms\.flatMap/);
  assert.match(renderer, /const workerRanges=scene\.workerRanges/);
  assert.match(renderer, /workerRanges,count:positions\.length\/3/);
});

test("camera uses bounded drag navigation and deliberate limited rotation", () => {
  assert.match(renderer, /target\[0\]=clamp\(target\[0\]-dx\*\.018,-4\.8,4\.8\)/);
  assert.match(renderer, /target\[2\]=clamp\(target\[2\]\+dy\*\.018,-7\.5,7\.5\)/);
  assert.match(renderer, /theta=clamp\(theta\+\.14,-\.35,1\.78\)/);
  assert.match(renderer, /Centrar oficina/);
});

test("pointer controls do not depend on free-orbit drag state", () => {
  assert.match(renderer, /canvas\.addEventListener\("pointerdown",e=>\{canvas\.setPointerCapture/);
  assert.doesNotMatch(renderer, /last=\{x:e\.clientX,y:e\.clientY\}/);
});


test("minifigures have a visible top stud, molded C-grip hands and vivid glossy plastic",()=>{
  assert.match(renderer,/let studY=2\.49/);
  assert.match(renderer,/cyl\(x,studY,z\+\.99,\.135,\.12,skin,16\)/);
  assert.match(renderer,/for\(let k=0;k<=6;k\+\+\).*250\/6/);
  assert.match(renderer,/const shoulder=\[x\+side\*\.48,1\.49,z\+\.99\]/);
  assert.match(renderer,/shirts=\[\[0\.04,0\.30,0\.86\]/);
  assert.match(renderer,/\),40\.0\)\*0\.24/);
});


test("minifigure faces have distinct printed expressions and arms use articulated molded C-grips",()=>{
  assert.match(renderer,/const segment=\(a,b,r,color,seg=8\)/);
  assert.match(renderer,/const ink=\[\.075,\.055,\.045\]/);
  assert.match(renderer,/const smile=\[\]/);
  assert.match(renderer,/index%5===4/);
  assert.match(renderer,/const shoulder=\[x\+side\*\.48,1\.49,z\+\.99\]/);
  assert.match(renderer,/for\(let k=0;k<=6;k\+\+\).*250\/6/);
  assert.match(renderer,/index===2/);
  assert.match(renderer,/index===4/);
  assert.match(renderer,/index===6/);
});
