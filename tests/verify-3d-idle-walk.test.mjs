import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");
test("waiting workers use a bounded ambient walk cycle", () => {
  assert.match(renderer, /worker\.state==="st-r"/);
  assert.match(renderer, /route=sampleRoute\(worker,seconds\)/);
  assert.match(renderer, /walkZ=route\.z-worker\.z/);
  assert.match(renderer, /speed=1\.0,dwell=3\.8/);
  assert.match(renderer, /worker\.index\*2\.7/);
});
test("walking stays inside inter-column aisles and keeps equipment separate", () => {
  assert.match(renderer, /const stationX=col===0\?-1\.82:col===1\?1\.82:5\.48/);
  assert.match(renderer, /leftLaneX=col===0\?-5\.48:col===1\?-1\.82:1\.82/);
  assert.match(renderer, /rightLaneX=col===0\?-1\.82:col===1\?1\.82:5\.48/);
  assert.match(renderer, /armScale=worker\.state==="st-r"\?\.72:1/);
  assert.match(renderer, /handScale=worker\.state==="st-r"\?\.72:1/);
  assert.match(renderer, /prefers-reduced-motion/);
  assert.doesNotMatch(renderer, /axis===2\?walkZ:0\)\}\)for\(let i=worker\.monitorStart/);
});
