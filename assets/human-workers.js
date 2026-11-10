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

  function makePerson(index) {
    const gender = index % 2 === 0 ? "woman" : "man";
    const tone = tones[index % tones.length];
    const hair = hairStyles[Math.floor(index / 2) % hairStyles.length];
    const shirt = shirts[Math.floor(index / 3) % shirts.length];
    const svg = shape("svg", {
      viewBox: "0 0 64 70",
      width: "64",
      height: "70",
      class: "human-worker",
      "aria-hidden": "true",
      focusable: "false",
      "data-gender": gender,
      "data-skin-tone": tone,
      "data-hair": hair,
      "data-shirt": shirt
    });

    // Back hair and neck.
    if (hair === "long" || hair === "tied") {
      shape("path", { d: hair === "long" ? "M18 18 Q12 34 17 46 L23 43 L23 24 Z M46 18 Q52 34 47 46 L41 43 L41 24 Z" : "M18 17 Q13 27 18 39 L23 35 L23 22 Z M46 17 Q51 27 46 39 L41 35 L41 22 Z", class: "hw-hair" }, svg);
    }
    shape("rect", { x: 27, y: 34, width: 10, height: 10, rx: 4, class: "hw-skin" }, svg);
    // Torso, jacket/shirt and arms.
    shape("path", { d: "M18 48 Q20 41 27 40 L37 40 Q44 41 46 48 L50 65 L14 65 Z", class: "hw-shirt" }, svg);
    shape("path", { d: "M20 45 Q15 48 14 57 L12 62 Q13 65 17 63 L24 51 Z M44 45 Q49 48 50 57 L52 62 Q51 65 47 63 L40 51 Z", class: "hw-shirt hw-arms" }, svg);
    shape("path", { d: "M27 41 L32 47 L37 41", fill: "none", stroke: "#FFFFFF", "stroke-width": "2", "stroke-linecap": "round" }, svg);
    // Face.
    shape("ellipse", { cx: 32, cy: 25, rx: 14, ry: 16, class: "hw-skin hw-head" }, svg);
    // Hairline and hairstyle variation.
    const hairPaths = {
      short: "M18 25 Q16 8 32 9 Q48 8 46 25 L42 20 Q36 15 31 17 Q25 15 21 22 Z",
      long: "M18 26 Q15 8 32 9 Q49 8 46 26 L42 21 Q36 15 31 17 Q25 15 21 22 L21 39 L17 40 Z",
      curly: "M18 24 Q12 19 17 14 Q16 7 24 10 Q28 4 34 9 Q43 5 45 14 Q51 19 46 26 L42 20 Q36 15 31 17 Q25 15 21 22 Z",
      tied: "M18 25 Q16 8 32 9 Q48 8 46 25 L42 20 Q36 15 31 17 Q25 15 21 22 Z M43 14 Q54 11 51 22 Q49 27 45 25 Z"
    };
    shape("path", { d: hairPaths[hair], class: "hw-hair" }, svg);
    shape("path", { d: "M25 26 Q27 24 29 26 M35 26 Q37 24 39 26", fill: "none", stroke: "#342B2B", "stroke-width": "1.7", "stroke-linecap": "round" }, svg);
    shape("path", { d: "M29 33 Q32 35 35 33", fill: "none", stroke: "#713F37", "stroke-width": "1.5", "stroke-linecap": "round" }, svg);
    // Simple shoes anchor the figure on the desk scene.
    shape("ellipse", { cx: 24, cy: 66, rx: 7, ry: 2.5, class: "hw-shoes" }, svg);
    shape("ellipse", { cx: 40, cy: 66, rx: 7, ry: 2.5, class: "hw-shoes" }, svg);
    return svg;
  }

  function decorate() {
    const workers = Array.from(root.querySelectorAll(".ag[data-agent-id]"));
    workers.forEach((worker, index) => {
      const oldAvatar = worker.querySelector(".human-worker");
      if (oldAvatar) oldAvatar.remove();
      const legacy = worker.querySelector(":scope > svg");
      if (legacy) legacy.classList.add("legacy-bird-avatar");
      const role = worker.querySelector(".agent-role");
      const status = worker.querySelector(".agent-state");
      const avatar = makePerson(index);
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
