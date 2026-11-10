import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const officeScript = readFileSync(new URL("../assets/office-view.js", import.meta.url), "utf8");
const humanWorkersScript = readFileSync(new URL("../assets/human-workers.js", import.meta.url), "utf8");
const rendererScript = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

const mustContain = (text, label) => {
  assert.ok(html.includes(text), "missing " + label + ": " + text);
};

test("Phase A footer and Guardi mark placement match the approved specification", () => {
  assert.equal(html.split("assets/guardi-mark.svg").length - 1, 1, "Guardi mark appears exactly once");
  mustContain('<img src="assets/guardi-mark.svg" alt="" aria-hidden="true">', "decorative Guardi mark beside summary");
  assert.ok(!html.split("</header>")[0].includes("guardi-mark.svg"), "header does not duplicate the mark");
  mustContain("<footer>Simulación. En la versión real, los estados vendrán de GitHub.</footer>", "exact Phase A footer");
});

test("BABYMONSTER Chart is added once through a versioned local migration", () => {
  mustContain('const MIGRATION_KEY="oficina-luis-sequeira-migrations-v1"', "separate migration marker");
  mustContain('localStorage.getItem(MIGRATION_KEY)==="babymonster-chart-v1"', "idempotent migration guard");
  mustContain('name==="BABYMONSTER Chart"||room.repository==="luisequeira612-commits/monstie-charts."', "existing project detection");
  mustContain('name:"BABYMONSTER Chart",repository:"luisequeira612-commits/monstie-charts."', "BABYMONSTER Chart mapping");
  mustContain('localStorage.setItem(MIGRATION_KEY,"babymonster-chart-v1")', "migration completion marker");
  mustContain('if(!exists)', "do not duplicate an existing project");
});

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

test("GitHub Actions status refreshes periodically without a backend", () => {
  mustContain('window.setInterval(()=>rooms.filter(room=>room.repository).forEach(room=>refreshRepo(room.id)),300000)', "five-minute real activity polling");
  mustContain('textContent="Actualizar"', "manual refresh remains available");
  mustContain('https://api.github.com/repos/"+requestedRepository+"/actions/runs?per_page=1', "public GitHub Actions API");
});

test("BABYMONSTER Chart appears in required published project content", () => {
  mustContain('name:"BABYMONSTER Chart",repository:"luisequeira612-commits/monstie-charts."', "BABYMONSTER Chart migration");
});

test("isometric office overview explores existing projects without changing persisted data", () => {
  mustContain('href="assets/office-view.css"', "isometric office styles");
  mustContain('src="assets/office-view.js" defer', "isometric office interaction");
  mustContain('id="office-map"', "office map container");
  mustContain('id="office-3d-overview"', "connected 3D office overview container");
  mustContain('card.dataset.roomId=room.id', "stable room identity for map");
  assert.ok(officeScript.includes('selectedCard.scrollIntoView({behavior:reduced?"auto":"smooth",block:"center"})'), "missing explore project navigation");
  assert.ok(officeScript.includes("aria-pressed"), "missing accessible selected room state");
  assert.ok(officeScript.includes("dialog.showModal"), "room opens in an accessible dialog");
  assert.ok(officeScript.includes("room-desk"), "room scene includes desk furniture");
  assert.ok(officeScript.includes("selectedCard.scrollIntoView"), "room dialog links back to project details");
  assert.doesNotMatch(html, /office-view.*localStorage|STORAGE_KEY.*office-view/i, "overview does not add persisted state");
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
  mustContain('element.dataset.repoStatus===roomId', "safe status lookup");
  assert.doesNotMatch(html, /querySelector\(.*data-repo-status=.*roomId/);
  mustContain('textContent="Actualizar"', "manual refresh control");
  mustContain('room.repository=value||null', "disconnect support");
  mustContain('run.conclusion==="success"', "successful workflow state");
  mustContain('run.conclusion==="failure"', "failed workflow state");
});

test("explorable room stations show the same human workers as the project cards", () => {
  assert.ok(officeScript.includes('card.querySelectorAll(".ag")'), "room scene reads the existing worker nodes");
  assert.ok(officeScript.includes('querySelector(".human-worker")'), "room scene reuses the human avatar");
  assert.ok(officeScript.includes('person.classList.add("room-worker-avatar")'), "room scene marks the decorative avatar");
  assert.ok(officeScript.includes("station.appendChild(person)"), "worker is placed at its desk");
});

test("room workers inherit the current card state and its matching human animation", () => {
  assert.ok(officeScript.includes('find(className=>/^st-[wtar]$/.test(className))'), "room station copies the current worker state");
  assert.ok(officeScript.includes('station.classList.add(stateClass)'), "room station exposes the copied state class");
  const roomCss = readFileSync(new URL("../assets/office-view.css", import.meta.url), "utf8");
  for (const state of ["st-w", "st-t", "st-a", "st-r"]) {
    assert.ok(roomCss.includes(".room-station." + state + " .room-worker-avatar"), "missing room animation for " + state);
  }
});

test("public GitHub pull requests are visible without credentials or background polling", () => {
  mustContain('const repoPullResults=new Map()', "ephemeral pull request results");
  mustContain('https://api.github.com/repos/"+requestedRepository+"/pulls?state=open&per_page=3&sort=updated&direction=desc', "public pull request endpoint");
  mustContain('textContent="Pull requests abiertas"', "open pull request section");
  mustContain('item.html_url.startsWith("https://github.com/")', "GitHub-only safe PR links");
  mustContain('link.textContent=label', "PR titles are rendered as text");
  mustContain('refreshRepo(room.id,true)', "initial and manual refresh includes pull requests");
  mustContain('window.setInterval(()=>rooms.filter(room=>room.repository).forEach(room=>refreshRepo(room.id)),300000)', "background polling remains Actions-only");
  assert.doesNotMatch(html, /pulls\?state=open[^\n]*setInterval/, "pull request requests are not polled in the background");
  assert.doesNotMatch(html, /Authorization\s*:/i, "no GitHub token is added");
});


test("real 3D room prototype uses WebGL2 locally and preserves the CSS fallback", () => {
  mustContain('src="assets/office-3d.js" defer', "local WebGL2 room renderer");
  mustContain('id="office-3d"', "3D room canvas container");
  const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");
  assert.ok(renderer.includes('getContext("webgl2"'), "uses an actual WebGL2 context");
  assert.ok(renderer.includes("uProjection") && renderer.includes("uView"), "uses perspective and view matrices");
  assert.ok(renderer.includes("pointerdown") && renderer.includes("lastPinch"), "supports touch camera controls");
  assert.ok(renderer.includes("Alejar cámara") && renderer.includes("Acercar cámara"), "provides accessible zoom controls");
  assert.ok(renderer.includes("box(x,1.65,z-.36,1.12,.78,.14,metal)"), "scene geometry includes visible computer monitors");
  assert.ok(officeScript.includes("window.Office3D.open"), "room dialog opens the 3D scene");
  assert.ok(officeScript.includes("window.Office3D.openOverview"), "office overview opens the connected 3D building");
  assert.ok(officeScript.includes("roomData=cards.map"), "overview uses every current project room");
  assert.ok(officeScript.includes("room-scene-fallback-hidden"), "keeps the CSS room as a fallback");
  assert.ok(officeScript.includes("threeD._office3dCleanup()"), "stops the WebGL render loop when the room closes");
  assert.doesNotMatch(renderer, /https?:\/\//, "3D renderer has no external runtime requests");
  assert.ok(renderer.includes("workerRanges") && renderer.includes("bufferSubData"), "animates 3D worker poses in the WebGL buffer");
  assert.ok(renderer.includes("gl.DYNAMIC_DRAW"), "uses a dynamic GPU buffer for worker animation");
  assert.ok(renderer.includes("prefers-reduced-motion: reduce"), "disables 3D worker motion when reduced motion is requested");
  assert.ok(renderer.includes("rows===1?-1.55:-2.8+row*2.4"), "keeps a three-row workforce inside the room footprint");
  assert.ok(renderer.includes("function buildOfficeScene(rooms)"), "builds a multi-room 3D office");
  assert.ok(renderer.includes("central hallway"), "connects project rooms with a shared corridor");
  assert.ok(renderer.includes("col===1"), "faces the two room columns toward the shared hallway");
  assert.ok(renderer.includes("overviewRows=overviewMode?Math.ceil(rooms.length/2):1"), "scales the overview for multiple rows on mobile");
  assert.ok(renderer.includes("office-3d-room-nav"), "provides direct entry controls for each 3D room");
});

test("human worker decoration is idempotent and keeps the balanced appearance metadata", () => {
  assert.ok(humanWorkersScript.includes("if (existingAvatar)"), "does not rebuild avatars that already exist");
  assert.ok(humanWorkersScript.includes("return;"), "skips already-decorated workers");
  assert.ok(humanWorkersScript.includes('data-gender": gender'), "preserves gender metadata");
  assert.ok(humanWorkersScript.includes('data-hair": hair'), "preserves hairstyle metadata");
  assert.ok(humanWorkersScript.includes('data-shirt": shirt'), "preserves clothing metadata");
});

test("3D workers reuse the same hairstyle, shirt and live state as their project cards", () => {
  assert.ok(officeScript.includes('hair:avatar?.dataset.hair||"short"'), "passes the existing hairstyle into 3D");
  assert.ok(officeScript.includes('shirt:avatar?.dataset.shirt||"blue"'), "passes the existing shirt into 3D");
  assert.ok(officeScript.includes("stateObserver.observe(rooms"), "observes live card state changes");
  assert.ok(officeScript.includes("threeD._office3dUpdateStates(states)"), "synchronizes live state to the 3D scene");
  assert.ok(rendererScript.includes("shirtByName[worker.shirt]"), "renders the selected shirt color");
  assert.ok(rendererScript.includes("hairStyle==="), "renders distinct hairstyles");
  assert.ok(rendererScript.includes("container._office3dUpdateStates=states=>"), "exposes live 3D state updates");
});

test("connected 3D overview falls back to the accessible project map without WebGL2", () => {
  assert.ok(officeScript.includes("map.hidden=renderedOverview"), "keeps the CSS project map when the 3D overview is unavailable");
  assert.ok(officeScript.includes("overview.hidden=!renderedOverview"), "only shows the 3D overview after successful initialization");
  assert.ok(officeScript.includes("function closeOverview()"), "releases the overview before entering a project room");
  assert.ok(officeScript.includes("renderMap()});"), "restores the connected overview when a room closes");
});
