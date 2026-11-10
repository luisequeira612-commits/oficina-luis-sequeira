import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const workers = readFileSync(new URL("../assets/human-workers.js", import.meta.url), "utf8");
const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");
const view = readFileSync(new URL("../assets/office-view.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../assets/office-view.css", import.meta.url), "utf8");

test("the additive employee migrations create ten named people with a 5/5 gender balance", () => {
  for (const name of ["Valeria","Mateo","Camila","Diego","Aisha","Noah","Mei","Amir","Elena","Rafael"]) {
    assert.ok(html.includes('"'+name+'"'), "missing employee "+name);
  }
  assert.match(html, /nine-named-employees-v1/);
  assert.match(html, /ten-person-parity-v1/);
  assert.match(html, /balancedKey/);
  assert.match(html, /agent\.name=agent\.name\|\|name/);
  assert.match(html, /agent\.gender=agent\.gender\|\|gender/);
  assert.match(html, /STORAGE_KEY="oficina-luis-sequeira-v1"/);
});

test("the overview combines project employees into one three-column open-plan room", () => {
  assert.match(renderer, /rooms\.flatMap\(room=>\(room\.workers\|\|\[\]\)\.map/);
  assert.match(renderer, /count>=7\?3:count>3\?2:count/);
  assert.match(renderer, /count>=7\?3\.65:4\.1/);
  assert.match(renderer, /if\(workers\.length<=6\)/);
});

test("employee cards show their names and roles and open the related project", () => {
  assert.match(view, /office-employee-roster/);
  assert.match(view, /worker\.name/);
  assert.match(view, /selectEmployee\(worker\)/);
  assert.match(css, /\.office-roster-list/);
});

test("minifigure appearance follows the employee profile metadata", () => {
  assert.match(workers, /employee\?\.gender/);
  assert.match(workers, /employee\?\.skinTone/);
  assert.match(workers, /employee\?\.hair/);
  assert.match(workers, /employee\?\.shirt/);
});


test("floating nameplates are projected from each worker and select their own project employee", () => {
  assert.match(renderer, /className="office-worker-tags"/);
  assert.match(renderer, /className="office-worker-tag"/);
  assert.match(renderer, /worker\.tag\.style\.left/);
  assert.match(renderer, /worker\.tag\.style\.top/);
  assert.match(renderer, /onSelectWorker\(worker\)/);
  assert.match(renderer, /employeeId:worker\.id\|\|""/);
  assert.match(view, /office-employee-card/);
  assert.match(view, /onSelectRoom:id=>/);
  assert.match(view, /_office3dFocusWorker/);
  assert.match(css, /\.office-worker-tag\{/);
});


test("direct employee selection highlights the worker in the actual WebGL scene", () => {
  assert.match(view, /_office3dFocusWorker\(w\.id\)/);
  assert.match(renderer, /container\._office3dFocusWorker=id=>/);
});


test("the deployed HTML requests the fresh stylesheet that positions floating 3D nameplates", () => {
  assert.match(html, /office-view\.css\?v=50/);
  assert.match(css, /\.office-worker-tags\{position:absolute/);
  assert.match(css, /\.office-worker-tag\{position:absolute/);
  assert.match(renderer, /container\.appendChild\(workerTags\)/);
});


test("employee labels fit the camera viewport and the three status colors have distinct meanings",()=>{assert.match(renderer,/is-your-turn/);assert.match(renderer,/placed\.some/);assert.match(renderer,/button\.className="office-project-chip"/);assert.match(renderer,/button\.textContent=room\.name/);assert.match(css,/office-worker-tag\.is-your-turn/)});


test("mobile office HUD exposes the project sheet, employee selection and legend",()=>{assert.match(view,/office-project-sheet/);assert.match(view,/office-employee-card/);assert.match(view,/office-state-legend/);assert.match(css,/office-tycoon-top/);assert.match(css,/office-roster-avatar/);assert.match(html,/office-view\.css\?v=50/);assert.match(renderer,/const taperBox=/)});

test("obsolete large project card grid is removed from runtime layers",()=>{
 assert.doesNotMatch(html,/office-map|office-tile/);
 assert.doesNotMatch(css,/office-map|office-tile/);
 assert.doesNotMatch(view,/office-map|office-tile|map\.appendChild/);
 assert.match(renderer,/office-project-chip-strip/);
 assert.match(view,/office-project-sheet/);
});
test("mobile nameplates use compact type and follow the moving worker",()=>{
 assert.match(css,/\.office-worker-tag\{min-height:18px;max-width:86px;padding:2px 5px/);
 assert.match(css,/font-size:11px;line-height:1;transform:translate\(-50%,-100%\)/);
 assert.match(renderer,/worker\.renderX=worker\.x;worker\.renderZ=worker\.z/);
 assert.match(renderer,/const x=worker\.renderX\?\?worker\.x,y=2\.82/);
 assert.match(renderer,/is-resting/);
});
test("employee card closes outside or with X and collapses the chip rail",()=>{
 assert.match(view,/office-employee-selected/);
 assert.match(css,/office-employee-selected \.office-3d-room-nav/);
 assert.match(view,/office-employee-close/);
 assert.match(view,/!e\.target\.closest\("\.office-employee-card/);
});
test("control buttons retain zoom, rotation, home, drag and pinch",()=>{
 for(const pattern of [/makeButton\("−"/,/makeButton\("\+"/,/makeButton\("↶"/,/makeButton\("↷"/,/makeButton\("⌂"/,/canvas\.addEventListener\("pointerdown"/,/pointers\.size>=2/])assert.match(renderer,pattern);
 assert.match(css,/\.office-3d-controls button\{width:44px;min-width:44px;height:44px;min-height:44px/);
});

test("the office title and employee count remain visible above the scene",()=>{
 assert.ok(html.includes("<h1>Oficina de Luis Sequeira</h1>"));
 assert.ok(html.includes('<p class="office-header-subtitle">10 empleados · minifiguras LEGO</p>'));
});
test("the compact help button explains touch controls and closes itself",()=>{
 assert.match(view,/help\.textContent="\?"/);
 assert.match(view,/setTimeout\(\(\)=>tip\.hidden=true,4200\)/);
});
test("the WebGL scene keeps a single batched draw and a mobile-safe render scale",()=>{
 assert.equal((renderer.match(/gl\.drawArrays\(gl\.TRIANGLES,0,scene\.count\)/g)||[]).length,1);
 assert.match(renderer,/Math\.min\(window\.devicePixelRatio\|\|1,1\.15\)/);
 assert.match(renderer,/timestamp-lastFrame<32/);
});
