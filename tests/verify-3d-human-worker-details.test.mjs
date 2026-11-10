import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const renderer=readFileSync(new URL("../assets/office-3d.js",import.meta.url),"utf8");
const styles=readFileSync(new URL("../assets/office-view.css",import.meta.url),"utf8");
const page=readFileSync(new URL("../index.html",import.meta.url),"utf8");

test("3D workers keep the approved minifigure construction",()=>{
 assert.ok(renderer.includes("Classic minifigure proportions"));
 assert.ok(renderer.includes("taperBox(x,1.29"));
 assert.ok(renderer.includes("taperBox(x,1.30"));
 assert.match(renderer,/workerRanges.push/);
 assert.ok(renderer.includes("for(let sx=-5;sx<=5;sx+=1.25)"));
});
test("worker animation separates head arms and typing hands",()=>{
 assert.match(renderer,/const headStart=positions.length/);
 assert.match(renderer,/const handsStart=positions.length/);
 assert.match(renderer,/headStart,headEnd,armsStart,armsEnd,handsStart,handsEnd/);
 assert.ok(renderer.includes("Math.abs(Math.sin(seconds*16+worker.index))*.055"));
 assert.ok(renderer.includes("worker.headStart+1"));
 assert.ok(renderer.includes("worker.handsStart+1"));
 assert.match(renderer,/prefers-reduced-motion/);
 assert.match(renderer,/worker.state==="st-s"/);
 assert.match(renderer,/worker.state==="st-f"/);
});
test("shared overview preserves worker ranges",()=>{
 assert.match(renderer,/const allWorkers=rooms.flatMap/);
 assert.match(renderer,/const workerRanges=scene.workerRanges/);
 assert.match(renderer,/workerRanges,count:positions.length\/3/);
});
test("camera remains bounded and deliberate",()=>{
 assert.match(renderer,/target\[0\]=clamp\(target\[0\]-dx\*\.018,-4\.8,4\.8\)/);
 assert.match(renderer,/target\[2\]=clamp\(target\[2\]\+dy\*\.018,-7\.5,7\.5\)/);
 assert.ok(renderer.includes("theta=clamp(theta+.14,-.35,1.78)"));
 assert.match(renderer,/Centrar oficina/);
});
test("minifigures keep face prints hands and glossy finish",()=>{
 assert.match(renderer,/faceCanvas.width=64;faceCanvas.height=48/);
 assert.ok(renderer.includes("const printFaceCanvas=(x,z,index,skin)=>"));
 assert.ok(renderer.includes("const segment=(a,b,r,color,seg=8)=>"));
 assert.ok(renderer.includes("pow(max(dot(reflect(-keyLight,n),viewDir),0.0),48.0)*0.28"));
});
test("3D worker activity is seated and route-free",()=>{
 assert.doesNotMatch(renderer,/function sampleRoute/);
 assert.doesNotMatch(renderer,/walkX|walkZ|walkLift/);
 assert.match(renderer,/worker.renderX=worker.x;worker.renderZ=worker.z/);
 assert.match(renderer,/monitorShift/);
});
test("workstation monitors have compact editor chrome above animated code rows",()=>{
 assert.ok(renderer.includes("Compact editor chrome makes each animated display read as a real work interface."));
 assert.ok(renderer.includes("box(x,1.92,z-.245,.76,.028,.012,monitorStatusColor)"));
 assert.ok(renderer.includes("box(x-.405,1.63,z-.245,.07,.43,.012,stationAccent)"));
 assert.ok(renderer.includes("x-.27+codeWidth/2"));
});
test("workstation keyboard has a compact two-row key layout and mouse wheel",()=>{
 assert.ok(renderer.includes("for(let row=0;row<2;row++)for(let key=0;key<5;key++)"));
 assert.ok(renderer.includes("box(x+.62,1.052,z+.12,.014,.006,.035"));
});
test("FPS meter remains measured and cache versions are current",()=>{
 assert.match(renderer,/className="office-3d-fps"/);
 assert.ok(renderer.includes("fpsFrames++"));
 assert.ok(renderer.includes("fpsFrames*1000/Math.max(1,timestamp-fpsWindowStart)"));
 assert.match(styles,/\.office-3d-fps\{[^}]*z-index:10/);
 assert.match(page,/office-view\.css\?v=50/);
 assert.match(page,/office-3d\.js\?v=77/);
});

test("3D renderer pauses while the document is hidden and resumes when visible",()=>{
 assert.match(renderer,/function render\(timestamp=0\)\{if\(disposed\|\|contextLost\)return;raf=0;if\(document\.hidden\)return;/);
 assert.match(renderer,/const onVisibilityChange=\(\)=>\{if\(document\.hidden\)\{if\(raf\)cancelAnimationFrame\(raf\);raf=0;fpsFrames=0;fpsWindowStart=0\}else if\(!disposed&&!contextLost&&!raf\)\{raf=requestAnimationFrame\(render\)\}\}/);
 assert.match(renderer,/document\.addEventListener\("visibilitychange",onVisibilityChange\)/);
 assert.match(renderer,/document\.removeEventListener\("visibilitychange",onVisibilityChange\)/);
});

test("worker nameplate layout is throttled independently from the 30 FPS renderer",()=>{
 assert.match(renderer,/lastFrame=0,lastTagUpdate=0/);
 assert.match(renderer,/if\(workerTags&&timestamp-lastTagUpdate>=100\)\{lastTagUpdate=timestamp;/);
});

test("WebGL context loss shows a safe recovery message and stops rendering",()=>{
 assert.match(renderer,/const onContextLost=event=>\{event\.preventDefault\(\);contextLost=true/);
 assert.match(renderer,/Tus proyectos siguen guardados/);
 assert.match(renderer,/Cierra esta escena y vuelve a entrar/);
 assert.match(renderer,/webglcontextlost/);
 assert.match(renderer,/webglcontextrestored/);
 assert.match(renderer,/canvas\.removeEventListener\("webglcontextlost",onContextLost\)/);
 assert.match(renderer,/canvas\.removeEventListener\("webglcontextrestored",onContextRestored\)/);
 assert.match(renderer,/if\(!contextLost\)gl\.getExtension\("WEBGL_lose_context"\)/);
});
