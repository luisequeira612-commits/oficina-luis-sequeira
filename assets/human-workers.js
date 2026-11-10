(function () {
  "use strict";

  const root = document.getElementById("rooms");
  if (!root) return;

  const SVG_NS = "http://www.w3.org/2000/svg";
  const tones = ["light", "medium", "deep"];
  const hairStyles = ["short", "long", "curly", "tied"];
  const shirts = ["blue", "coral", "teal", "mustard", "plum"];

  function shape(name, attrs, parent) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    if (parent) parent.appendChild(node);
    return node;
  }

  function makePerson(index, employee) {
    const gender = employee?.gender==="woman"||employee?.gender==="man" ? employee.gender : (index % 2 === 0 ? "woman" : "man");
    const tone = tones.includes(employee?.skinTone) ? employee.skinTone : tones[index % tones.length];
    const hair = hairStyles.includes(employee?.hair) ? employee.hair : hairStyles[(Math.floor(index / 2) + (gender === "woman" ? 1 : 0)) % hairStyles.length];
    const shirt = shirts.includes(employee?.shirt) ? employee.shirt : shirts[Math.floor(index / 3) % shirts.length];
    const svg = shape("svg", {
      viewBox: "0 0 64 70", width: "64", height: "70", class: "human-worker",
      "aria-hidden": "true", focusable: "false", "data-gender": gender,
      "data-skin-tone": tone, "data-hair": hair, "data-shirt": shirt
    });
    // Original minifigure silhouette: block torso, round head, top stud and separated legs.
    if (hair === "long" || hair === "tied") {
      shape("rect", { x: 17, y: 19, width: 8, height: 25, rx: 3, class: "hw-hair" }, svg);
      shape("rect", { x: 39, y: 19, width: 8, height: 25, rx: 3, class: "hw-hair" }, svg);
    }
    shape("rect", { x: 17, y: 42, width: 13, height: 22, rx: 2, class: "hw-shirt" }, svg);
    shape("rect", { x: 34, y: 42, width: 13, height: 22, rx: 2, class: "hw-shirt" }, svg);
    shape("rect", { x: 15, y: 27, width: 34, height: 20, rx: 4, class: "hw-shirt" }, svg);
    shape("rect", { x: 8, y: 29, width: 9, height: 21, rx: 4, class: "hw-shirt hw-arms" }, svg);
    shape("rect", { x: 47, y: 29, width: 9, height: 21, rx: 4, class: "hw-shirt hw-arms" }, svg);
    shape("circle", { cx: 12.5, cy: 51, r: 4, class: "hw-skin" }, svg);
    shape("circle", { cx: 51.5, cy: 51, r: 4, class: "hw-skin" }, svg);
    shape("rect", { x: 18, y: 7, width: 28, height: 30, rx: 10, class: "hw-skin hw-head" }, svg);
    shape("circle", { cx: 32, cy: 6.5, r: 4, class: "hw-skin" }, svg);
    const hairCaps = {
      short: "M18 17 Q17 7 32 8 Q47 7 46 17 L42 14 L22 14 Z",
      long: "M18 17 Q17 7 32 8 Q47 7 46 17 L43 15 L21 15 Z",
      curly: "M18 17 Q13 13 18 9 Q18 3 25 7 Q31 1 36 7 Q45 3 46 11 Q52 14 46 19 L42 15 L22 15 Z",
      tied: "M18 17 Q17 7 32 8 Q47 7 46 17 L43 15 L21 15 Z"
    };
    shape("path", { d: hairCaps[hair], class: "hw-hair" }, svg);
    if (hair === "tied") shape("circle", { cx: 48, cy: 13, r: 4, class: "hw-hair" }, svg);
    shape("circle", { cx: 26, cy: 22, r: 1.8, fill: "#342B2B" }, svg);
    shape("circle", { cx: 38, cy: 22, r: 1.8, fill: "#342B2B" }, svg);
    shape("path", { d: "M27 29 Q32 32 37 29", fill: "none", stroke: "#713F37", "stroke-width": "1.6", "stroke-linecap": "round" }, svg);
    shape("rect", { x: 29, y: 33, width: 6, height: 3, rx: 1, fill: "#FFFFFF" }, svg);
    shape("rect", { x: 21, y: 47, width: 22, height: 2, rx: 1, fill: "#FFFFFF99" }, svg);
    return svg;
  }

  function decorate() {
    const workers = Array.from(root.querySelectorAll(".ag[data-agent-id]"));
    workers.forEach((worker, index) => {
      const existingAvatar = worker.querySelector(".human-worker");
      const status = worker.querySelector(".agent-state");
      if (existingAvatar) {
        if (status) {
          const genderText = existingAvatar.dataset.gender === "woman" ? "Mujer" : "Hombre";
          status.setAttribute("aria-label", genderText + ", " + status.textContent);
        }
        return;
      }
      const legacy = worker.querySelector(":scope > svg");
      if (legacy) legacy.classList.add("legacy-bird-avatar");
      const role = worker.querySelector(".agent-role");
      const avatar = makePerson(index, worker.dataset);
      if (role) worker.insertBefore(avatar, role);
      else worker.appendChild(avatar);
      if (status) {
        const genderText = avatar.dataset.gender === "woman" ? "Mujer" : "Hombre";
        status.setAttribute("aria-label", genderText + ", " + status.textContent);
      }
    });
  }

  const observer = new MutationObserver(decorate);
  observer.observe(root, { childList: true });
  decorate();
})();
