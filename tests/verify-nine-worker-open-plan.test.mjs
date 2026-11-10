import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const workers = readFileSync(new URL("../assets/human-workers.js", import.meta.url), "utf8");
const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");
const view = readFileSync(new URL("../assets/office-view.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../assets/office-view.css", import.meta.url), "utf8");

test("the additive employee migration creates nine named people with a 5/4 gender balance", () => {
  for (const name of ["Valeria","Mateo","Camila","Diego","Aisha","Noah","Mei","Amir","Elena"]) {
    assert.ok(html.includes('"'+name+'"'), "missing employee "+name);
  }
  assert.match(html, /nine-named-employees-v1/);
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
  assert.match(view, /openRoom\(target\)/);
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
  assert.match(renderer, /onSelectRoom\(worker\.roomId,worker\.employeeId\)/);
  assert.match(renderer, /employeeId:worker\.id\|\|""/);
  assert.match(view, /openRoom\(card,selectedEmployeeId=""\)/);
  assert.match(view, /onSelectRoom:\(id,employeeId\)/);
  assert.match(view, /is-selected-worker/);
  assert.match(css, /\.office-worker-tag\{/);
});


test("direct employee selection highlights the worker in the actual WebGL scene", () => {
  assert.match(view, /selected:Boolean\(selectedEmployeeId&&agent\.dataset\.agentId===selectedEmployeeId\)/);
  assert.match(renderer, /if\(worker\.selected\)sphere\(x,\.045,z\+\.84,1\.12,\.035,\.82,\[1,\.76,\.24\]/);
});
