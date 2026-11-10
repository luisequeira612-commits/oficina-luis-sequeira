import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

const mustContain = (text, label) => {
  assert.ok(html.includes(text), "missing " + label + ": " + text);
};

test("default projects and role assignment rules are present", () => {
  mustContain('name:"App Guardi"', "App Guardi");
  mustContain('name:"Canal de YouTube"', "Canal de YouTube");
  mustContain('name:"Tema Nova Launcher"', "Tema Nova Launcher");
  mustContain('["Desarrollo","Revisión","Diseño"]', "App Guardi roles");
  mustContain('["Escritor","Diseño"]', "YouTube roles");
  mustContain('["Diseño"]', "Nova role");
  mustContain('["Desarrollo","Diseño"].map', "new-project roles");
  mustContain("room.agents.length<6", "six-agent limit");
  mustContain("ROLES.find(item=>!used.has(item))||ROLES[0]", "unused-role selection");
});

test("persisted data is validated and corrupted storage falls back to defaults", () => {
  mustContain("const STORAGE_KEY=\"oficina-luis-sequeira-v1\"", "storage key");
  mustContain("value.version!==1", "version validation");
  mustContain("!Array.isArray(value.rooms)", "rooms validation");
  mustContain("room.agents.length<=6", "stored agent limit");
  mustContain("ROLES.includes(agent.role)", "stored role validation");
  mustContain("try{const raw=localStorage.getItem(STORAGE_KEY)", "storage read");
  mustContain("catch(_){return initialRooms()}", "corrupt-storage fallback");
});

test("state probabilities, timing, and singular/plural wording match the specification", () => {
  mustContain('x<.45?"w":x<.7?"t":x<.85?"a":"r"', "state picker");
  mustContain("Math.random()<.35", "state-change probability");
  mustContain("reducedMotion?5200:2600", "state interval");
  mustContain('working===1?"personaje":"personajes"', "working singular/plural");
  mustContain('waiting===1?"espera":"esperan"', "waiting singular/plural");
  mustContain("Todos descansan por ahora.", "resting summary");
});

test("accessibility and user-input protections remain wired", () => {
  mustContain('aria-live="polite"', "live region");
  mustContain('aria-atomic="true"', "atomic summary");
  mustContain('aria-hidden="true"', "decorative SVG");
  mustContain('setAttribute("aria-label","Quitar personaje ', "character label");
  mustContain('setAttribute("aria-label","Eliminar proyecto ', "project label");
  mustContain("maxlength=\"40\"", "project length limit");
  mustContain("title.textContent=room.name", "literal project rendering");
  assert.doesNotMatch(html, /innerHTML\\s*=\\s*name/);
});

test("public GitHub Actions integration keeps project links local and configurable", () => {
  mustContain('name:"App Guardi",repository:null', "unknown project remains unlinked");
  mustContain('repository:"luisequeira612-commits/capi-aventuras"', "Capi Aventuras mapping");
  mustContain('repository:"luisequeira612-commits/jennie-ruby"', "Nova Launcher mapping");
  mustContain('https://api.github.com/repos/"+requestedRepository+"/actions/runs?per_page=1', "public Actions endpoint");
  mustContain('response.status===403||response.status===429', "GitHub rate-limit handling");
  mustContain('response.status===404', "missing/private repository handling");
  mustContain('function migrateRooms(savedRooms)', "legacy localStorage migration");
  mustContain('room.repository===undefined', "migration preserves explicit disconnections");
  mustContain('textContent=result.message', "safe status rendering");
  mustContain('textContent="Actualizar"', "manual refresh control");
  mustContain('room.repository=value||null', "disconnect support");
  mustContain('run.conclusion==="success"', "successful workflow state");
  mustContain('run.conclusion==="failure"', "failed workflow state");
});
