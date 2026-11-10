import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const rolePalettes = [
  ["#534AB7", "#3C3489", "#AFA9EC"],
  ["#D4537E", "#993556", "#F4C0D1"],
  ["#1D9E75", "#0F6E56", "#9FE1CB"],
  ["#BA7517", "#854F0B", "#FAC775"],
  ["#D85A30", "#993C1D", "#F5C4B3"],
];
const approvedTemplate = `<svg viewBox="0 0 64 70" width="64" height="70" aria-hidden="true">
<ellipse cx="32" cy="33" rx="19" ry="21" fill="{D}"/>
<g class="body">
<ellipse cx="32" cy="30" rx="19" ry="21" fill="{C}"/>
<ellipse cx="32" cy="40" rx="11" ry="8" fill="{L}"/>
<g class="eyes">
<circle cx="25" cy="26" r="6" fill="#fff"/>
<circle cx="39" cy="26" r="6" fill="#fff"/>
<g class="pup">
<circle cx="25.5" cy="27" r="3" fill="#111827"/>
<circle cx="39.5" cy="27" r="3" fill="#111827"/>
<circle cx="26.5" cy="25.8" r="1" fill="#fff"/>
<circle cx="40.5" cy="25.8" r="1" fill="#fff"/>
</g>
</g>
<g class="ce"><path d="M20 27Q25 31 30 27M34 27Q39 31 44 27" fill="none" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/></g>
<path d="M28 33Q32 31 36 33Q35 38 32 39Q29 38 28 33Z" fill="#2D3748"/>
</g>
<rect x="5" y="50" width="54" height="13" rx="3" fill="#A07A52"/>
<rect x="5" y="50" width="54" height="4" rx="2" fill="#8B5E3C"/>
<rect x="23" y="42" width="18" height="9" rx="2" fill="#4B5563"/>
<circle cx="32" cy="46.5" r="1.6" fill="#9CA3AF"/>
<ellipse class="hl" cx="25" cy="52" rx="4" ry="3" fill="{C}"/>
<ellipse class="hr" cx="39" cy="52" rx="4" ry="3" fill="{C}"/>
<g class="ft">
<circle cx="45" cy="16" r="1.6" fill="#fff" stroke="#94A3B8" stroke-width=".8"/>
<ellipse cx="53" cy="9" rx="9" ry="6" fill="#fff" stroke="#94A3B8" stroke-width=".8"/>
<circle cx="49" cy="9" r="1.3" fill="#64748B"/>
<circle cx="53" cy="9" r="1.3" fill="#64748B"/>
<circle cx="57" cy="9" r="1.3" fill="#64748B"/>
</g>
<g class="fa">
<circle cx="53" cy="11" r="8" fill="#EF9F27"/>
<rect x="52" y="6" width="2" height="6" rx="1" fill="#fff"/>
<circle cx="53" cy="14.5" r="1.2" fill="#fff"/>
</g>
<g class="zz"><path d="M46 6h7l-7 7h7" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
</svg>`;

test("the five role SVGs match the approved 64x70 template exactly", () => {
  const svgs = [...html.matchAll(/<svg viewBox="0 0 64 70"[\\s\\S]*?<\\/svg>/g)].map(match => match[0]);
  assert.equal(svgs.length, 5, "expected one character template for each role");
  for (const [index, svg] of svgs.entries()) {
    assert.ok(svg.startsWith("<svg") && svg.endsWith("</svg>"));
    let normalized = svg;
    const [main, dark, light] = rolePalettes[index];
    for (const [color, marker] of [[main, "{C}"], [dark, "{D}"], [light, "{L}"]]) {
      normalized = normalized.split(color).join(marker);
    }
    assert.equal(normalized, approvedTemplate, `role SVG ${index + 1} differs from the approved template`);
  }
});

test("all four visual states retain their approved animation selectors", () => {
  for (const state of ["st-w", "st-t", "st-a", "st-r"]) {
    assert.ok(html.includes("." + state), `missing ${state} state`);
  }
  for (const animation of ["@keyframes bb", "@keyframes tp", "@keyframes pu", "@keyframes sw", "@keyframes fz"]) {
    assert.ok(html.includes(animation), `missing animation ${animation}`);
  }
});

test("mobile and reduced-motion requirements remain present", () => {
  assert.match(html, /min-height:44px/);
  assert.match(html, /\.ag\{width:76px/);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.match(html, /reducedMotion\?5200:2600/);
});

test("user-entered project names are rendered as text, not HTML", () => {
  assert.match(html, /title\.textContent=room\.name/);
  assert.match(html, /nameInput\.value\.trim\(\)/);
  assert.match(html, /maxlength="40"/);
  assert.doesNotMatch(html, /innerHTML\s*=\s*name/);
});
