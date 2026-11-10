import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
const js=await readFile(new URL("../assets/github-live.js",import.meta.url),"utf8");
const css=await readFile(new URL("../assets/github-live.css",import.meta.url),"utf8");
test("GitHub Actions requests are conditional and limited to five recent runs",()=>{
 assert.match(js,/actions\/runs\?per_page=5/);
 assert.match(js,/If-None-Match/);
 assert.match(js,/response\.status===304/);
 assert.match(js,/X-RateLimit-Remaining/);
 assert.match(js,/X-RateLimit-Reset/);
});
test("polling is staggered, adaptive, visibility-aware and throttled",()=>{
 assert.match(js,/IDLE_CYCLE=240000/);
 assert.match(js,/ACTIVE_GAP=60000/);
 assert.match(js,/MANUAL_GAP=15000/);
 assert.match(js,/manualAt\.get\(room\.repository\)/);
 assert.match(js,/Array\.from\(new Set\(/);
 assert.match(js,/su estado real no se puede confirmar/);
 assert.match(js,/document\.visibilityState==="hidden"/);
 assert.match(js,/STALE=120000/);
});
test("the separate cache preserves project storage and ETags",()=>{
 assert.match(js,/oficina-luis-sequeira-github-cache-v1/);
 assert.match(js,/e\.etag/);
 assert.match(html,/oficina-luis-sequeira-v1/);
});
test("only GitHub run data controls labels; decoration is disclosed",()=>{
 assert.match(html,/github-activity-list/);
 assert.match(html,/datos reales de ejecuciones públicas/i);
 assert.match(js,/"Trabajando"/);
 assert.match(js,/"Éxito"/);
 assert.match(js,/"Falló"/);
 assert.match(css,/github-walk-to-desk/);
 assert.match(html,/OfficeGitHubLive\.start\(rooms\)/);
 assert.doesNotMatch(html,/Math\.random\(\)<\.35/);
});
