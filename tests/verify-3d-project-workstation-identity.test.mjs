import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer=readFileSync(new URL("../assets/office-3d.js",import.meta.url),"utf8");
const page=readFileSync(new URL("../index.html",import.meta.url),"utf8");

test("open-plan monitor accents follow the owning project",()=>{
 assert.ok(renderer.includes('projectName:room.name||"Proyecto"'));
 assert.ok(renderer.includes('String(worker.projectName||roomName||"").toLowerCase()'));
 assert.ok(renderer.includes('stationProjectKey.includes("guardi")?[0.20,0.48,0.72]'));
 assert.ok(renderer.includes('stationProjectKey.includes("capi")||stationProjectKey.includes("youtube")?[0.82,0.22,0.25]'));
 assert.ok(renderer.includes('stationProjectKey.includes("nova")||stationProjectKey.includes("launcher")?[0.37,0.48,0.76]'));
 assert.ok(renderer.includes('stationProjectKey.includes("babymonster")||stationProjectKey.includes("monstie")||stationProjectKey.includes("chart")?[0.70,0.38,0.66]'));
 assert.ok(renderer.includes("box(x-.405,1.63,z-.245,.07,.43,.012,stationAccent)"));
 assert.ok(renderer.includes("codeRow%3===0?stationAccent:[0.63,0.91,1]"));
 assert.match(page,/office-3d\.js\?v=75/);
});
