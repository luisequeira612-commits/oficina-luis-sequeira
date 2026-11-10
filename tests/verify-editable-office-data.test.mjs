import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const agents=JSON.parse(readFileSync(new URL("../data/agentes.json",import.meta.url),"utf8"));
const projects=JSON.parse(readFileSync(new URL("../data/proyectos.json",import.meta.url),"utf8"));
const tasks=JSON.parse(readFileSync(new URL("../data/tareas.json",import.meta.url),"utf8"));
const live=readFileSync(new URL("../assets/github-live.js",import.meta.url),"utf8");

test("editable office data contains the nine named employees and four projects",()=>{
 assert.equal(agents.version,1);assert.equal(agents.employees.length,9);
 assert.equal(projects.version,1);assert.equal(projects.projects.length,4);
 const ids=new Set(agents.employees.map(x=>x.id));
 assert.ok(projects.projects.every(x=>(x.employeeIds||[]).every(id=>ids.has(id))));
 assert.equal(tasks.version,1);
});
test("GitHub live keeps conditional ETag polling and recent commits",()=>{
 assert.match(live,/If-None-Match/);assert.match(live,/commits\?per_page=5/);assert.match(live,/commitsEtag/);assert.match(live,/taskHistory/);
});
