// public/assets/js/p3r-admin-member-form.js
// UI builder untuk JSON fields di admin members form.
// Output tetap dikirim sebagai JSON string melalui textarea hidden:
// stats, skills, expertise, gallery, alter.

(function () {
  const $ = (selector) => document.querySelector(selector);

  const els = {
    form: document.querySelector("form"),

    statsJson: $("#statsJson"),
    statRank: $("#statRankInput"),
    statLevel: $("#statLevelInput"),
    statWinrate: $("#statWinrateInput"),

    alterJson: $("#alterJson"),
    alterEnabled: $("#alterEnabledInput"),
    alterId: $("#alterIdInput"),
    alterLabel: $("#alterLabelInput"),
    alterHint: $("#alterHintInput"),

    skillsJson: $("#skillsJson"),
    skillsBuilder: $("#skillsBuilder"),
    addSkill: $("#addSkillBtn"),

    expertiseJson: $("#expertiseJson"),
    expertisePlaystyle: $("#expertisePlaystyleInput"),
    expertiseAchievement: $("#expertiseAchievementInput"),
    strengthBuilder: $("#strengthBuilder"),
    rolePoolBuilder: $("#rolePoolBuilder"),
    mainsBuilder: $("#mainsBuilder"),
    addStrength: $("#addStrengthBtn"),
    addRolePool: $("#addRolePoolBtn"),
    addMain: $("#addMainBtn"),

    galleryJson: $("#galleryJson"),
    galleryBuilder: $("#galleryBuilder"),
    addGallery: $("#addGalleryBtn"),
  };

  if (!els.form || !els.statsJson || !els.skillsJson || !els.expertiseJson || !els.galleryJson) {
    return;
  }

  function parseJson(text, fallback) {
    try {
      const raw = String(text || "").trim();
      if (!raw) return structuredCloneSafe(fallback);

      const parsed = JSON.parse(raw);
      return parsed ?? structuredCloneSafe(fallback);
    } catch {
      return structuredCloneSafe(fallback);
    }
  }

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function pretty(value) {
    return JSON.stringify(value, null, 2);
  }

  function normalizeNumber(value, min, max, fallback = 0) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;

    return Math.max(min, Math.min(max, number));
  }

  function createInput({ value = "", placeholder = "", type = "text", min = null, max = null }) {
    const input = document.createElement("input");
    input.className = "form-control";
    input.type = type;
    input.value = value ?? "";
    input.placeholder = placeholder;

    if (min !== null) input.min = min;
    if (max !== null) input.max = max;

    input.addEventListener("input", syncAll);

    return input;
  }

  function createRemoveButton(onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "p3r-builder-remove";
    button.textContent = "Remove";
    button.addEventListener("click", onClick);
    return button;
  }

  function createFieldWrap(labelText, input) {
    const wrap = document.createElement("div");

    const label = document.createElement("label");
    label.className = "form-label";
    label.textContent = labelText;

    wrap.appendChild(label);
    wrap.appendChild(input);

    return wrap;
  }

  /* ======================================================
     STATS
     ====================================================== */

  function initStats() {
    const stats = parseJson(els.statsJson.value, {
      rank: "1",
      level: 1,
      winrate: 0,
    });

    els.statRank.value = stats.rank ?? "";
    els.statLevel.value = stats.level ?? "";
    els.statWinrate.value = stats.winrate ?? "";

    [els.statRank, els.statLevel, els.statWinrate].forEach((input) => {
      input?.addEventListener("input", syncStats);
    });

    syncStats();
  }

  function syncStats() {
    const stats = {
      rank: String(els.statRank?.value || "").trim(),
      level: normalizeNumber(els.statLevel?.value, 0, 999, 0),
      winrate: normalizeNumber(els.statWinrate?.value, 0, 100, 0),
    };

    els.statsJson.value = pretty(stats);
  }

  /* ======================================================
     ALTER TRIGGER
     ====================================================== */

  function initAlter() {
    if (!els.alterJson) return;

    const alter = parseJson(els.alterJson.value, {
      enabled: false,
      alterId: "",
      label: "ALTER",
      hint: "Open alter profile",
    });

    if (els.alterEnabled) els.alterEnabled.checked = !!alter.enabled;
    if (els.alterId) els.alterId.value = alter.alterId || "";
    if (els.alterLabel) els.alterLabel.value = alter.label || "ALTER";
    if (els.alterHint) els.alterHint.value = alter.hint || "Open alter profile";

    [els.alterEnabled, els.alterId, els.alterLabel, els.alterHint].forEach((input) => {
      input?.addEventListener("input", syncAlter);
      input?.addEventListener("change", syncAlter);
    });

    syncAlter();
  }

  function syncAlter() {
    if (!els.alterJson) return;

    const alter = {
      enabled: !!els.alterEnabled?.checked,
      alterId: String(els.alterId?.value || "").trim(),
      label: String(els.alterLabel?.value || "ALTER").trim(),
      hint: String(els.alterHint?.value || "Open alter profile").trim(),
    };

    els.alterJson.value = pretty(alter);
  }

  /* ======================================================
     SKILLS
     ====================================================== */

  function addSkillRow(skill = {}) {
    const row = document.createElement("div");
    row.className = "p3r-builder-row";

    const nameInput = createInput({
      value: skill.name || "",
      placeholder: "contoh: Editing",
    });

    const valueInput = createInput({
      value: skill.value ?? "",
      placeholder: "0 - 100",
      type: "number",
      min: 0,
      max: 100,
    });

    const remove = createRemoveButton(() => {
      row.remove();
      syncSkills();
    });

    row.appendChild(createFieldWrap("Skill Name", nameInput));
    row.appendChild(createFieldWrap("Value", valueInput));
    row.appendChild(remove);

    els.skillsBuilder.appendChild(row);
    syncSkills();
  }

  function initSkills() {
    const skills = parseJson(els.skillsJson.value, []);

    els.skillsBuilder.innerHTML = "";

    if (Array.isArray(skills) && skills.length) {
      skills.forEach((skill) => addSkillRow(skill));
    } else {
      addSkillRow({ name: "Aim", value: 80 });
    }

    els.addSkill?.addEventListener("click", () => {
      addSkillRow({ name: "", value: 0 });
    });

    syncSkills();
  }

  function syncSkills() {
    const rows = els.skillsBuilder.querySelectorAll(".p3r-builder-row");

    const skills = [...rows]
      .map((row) => {
        const inputs = row.querySelectorAll("input");

        return {
          name: String(inputs[0]?.value || "").trim(),
          value: normalizeNumber(inputs[1]?.value, 0, 100, 0),
        };
      })
      .filter((skill) => skill.name);

    els.skillsJson.value = pretty(skills);
  }

  /* ======================================================
     EXPERTISE LIST HELPERS
     ====================================================== */

  function addSingleValueRow(container, value = "", syncCallback = syncExpertise) {
    const row = document.createElement("div");
    row.className = "p3r-builder-row one-field";

    const input = createInput({
      value,
      placeholder: "Isi value",
    });

    const remove = createRemoveButton(() => {
      row.remove();
      syncCallback();
    });

    row.appendChild(input);
    row.appendChild(remove);

    container.appendChild(row);
    syncCallback();
  }

  function getSingleValues(container) {
    return [...container.querySelectorAll("input")]
      .map((input) => String(input.value || "").trim())
      .filter(Boolean);
  }

  function initExpertise() {
    const expertise = parseJson(els.expertiseJson.value, {
      playstyle: "",
      strength: [],
      rolePool: [],
      mains: [],
      achievement: "",
    });

    els.expertisePlaystyle.value = expertise.playstyle || "";
    els.expertiseAchievement.value = expertise.achievement || "";

    els.strengthBuilder.innerHTML = "";
    els.rolePoolBuilder.innerHTML = "";
    els.mainsBuilder.innerHTML = "";

    const strength = Array.isArray(expertise.strength) ? expertise.strength : [];
    const rolePool = Array.isArray(expertise.rolePool) ? expertise.rolePool : [];
    const mains = Array.isArray(expertise.mains) ? expertise.mains : [];

    if (strength.length) {
      strength.forEach((value) => addSingleValueRow(els.strengthBuilder, value));
    } else {
      addSingleValueRow(els.strengthBuilder, "");
    }

    if (rolePool.length) {
      rolePool.forEach((value) => addSingleValueRow(els.rolePoolBuilder, value));
    } else {
      addSingleValueRow(els.rolePoolBuilder, "");
    }

    if (mains.length) {
      mains.forEach((value) => addSingleValueRow(els.mainsBuilder, value));
    } else {
      addSingleValueRow(els.mainsBuilder, "");
    }

    els.expertisePlaystyle.addEventListener("input", syncExpertise);
    els.expertiseAchievement.addEventListener("input", syncExpertise);

    els.addStrength?.addEventListener("click", () => {
      addSingleValueRow(els.strengthBuilder, "");
    });

    els.addRolePool?.addEventListener("click", () => {
      addSingleValueRow(els.rolePoolBuilder, "");
    });

    els.addMain?.addEventListener("click", () => {
      addSingleValueRow(els.mainsBuilder, "");
    });

    syncExpertise();
  }

  function syncExpertise() {
    const expertise = {
      playstyle: String(els.expertisePlaystyle?.value || "").trim(),
      strength: getSingleValues(els.strengthBuilder),
      rolePool: getSingleValues(els.rolePoolBuilder),
      mains: getSingleValues(els.mainsBuilder),
      achievement: String(els.expertiseAchievement?.value || "").trim(),
    };

    els.expertiseJson.value = pretty(expertise);
  }

  /* ======================================================
     GALLERY
     ====================================================== */

  function addGalleryRow(item = {}) {
    const row = document.createElement("div");
    row.className = "p3r-builder-row";

    const srcInput = createInput({
      value: item.src || "",
      placeholder: "uploads/gallery/foto.png atau URL",
    });

    const captionInput = createInput({
      value: item.caption || "",
      placeholder: "Caption",
    });

    const remove = createRemoveButton(() => {
      row.remove();
      syncGallery();
    });

    row.appendChild(createFieldWrap("Image Source", srcInput));
    row.appendChild(createFieldWrap("Caption", captionInput));
    row.appendChild(remove);

    els.galleryBuilder.appendChild(row);
    syncGallery();
  }

  function initGallery() {
    const gallery = parseJson(els.galleryJson.value, []);

    els.galleryBuilder.innerHTML = "";

    if (Array.isArray(gallery) && gallery.length) {
      gallery.forEach((item) => addGalleryRow(item));
    } else {
      addGalleryRow({ src: "", caption: "" });
    }

    els.addGallery?.addEventListener("click", () => {
      addGalleryRow({ src: "", caption: "" });
    });

    syncGallery();
  }

  function syncGallery() {
    const rows = els.galleryBuilder.querySelectorAll(".p3r-builder-row");

    const gallery = [...rows]
      .map((row) => {
        const inputs = row.querySelectorAll("input");

        return {
          src: String(inputs[0]?.value || "").trim(),
          caption: String(inputs[1]?.value || "").trim(),
        };
      })
      .filter((item) => item.src);

    els.galleryJson.value = pretty(gallery);
  }

  /* ======================================================
     SYNC ALL
     ====================================================== */

  function syncAll() {
    syncStats();
    syncAlter();
    syncSkills();
    syncExpertise();
    syncGallery();
  }

  function init() {
    initStats();
    initAlter();
    initSkills();
    initExpertise();
    initGallery();

    els.form.addEventListener("submit", () => {
      syncAll();
    });
  }

  init();
})();