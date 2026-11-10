import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../assets/office-3d.js", import.meta.url), "utf8");

test("project navigation remains available above the shared open-plan office", () => {
  assert.match(renderer, /const accents=/, "project color accents remain in the shared room");
  assert.match(renderer, /roomNav\.className="office-3d-room-nav"/, "the overview keeps room navigation controls");
  assert.match(renderer, /button\.textContent="Entrar · "\+room\.name/, "each project remains directly accessible");
  assert.match(renderer, /onSelectRoom\(room\.id\)/, "navigation selects the corresponding project room");
  assert.match(renderer, /Low partitions and project accent rails/, "low dividers define the open-plan teams");
  assert.match(renderer, /const allWorkers=rooms\.flatMap/, "all project employees share one office floor");
});
