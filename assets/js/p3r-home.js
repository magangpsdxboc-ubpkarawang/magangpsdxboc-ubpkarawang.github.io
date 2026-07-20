// assets/js/p3r-home.js
// HOME logic only
// Data dari Laravel Blade:
// window.MEMBERS
// window.ALTERS
// window.DIVISIONS

let activeDivision = "all";

const PLACEHOLDER_IMG = window.P3R_PLACEHOLDER_IMG || "/assets/img/placeholder.png";
const $ = (selector) => document.querySelector(selector);

function escapeHTML(value) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function setText(selector, value) {
  const el = $(selector);
  if (!el) return;
  el.textContent = value ?? "—";
}

function profileUrl(id) {
  return `/profile/${encodeURIComponent(String(id ?? ""))}`;
}

function toPublicUrl(src) {
  if (!src || typeof src !== "string") return PLACEHOLDER_IMG;

  const s = src.trim();
  if (!s) return PLACEHOLDER_IMG;

  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;

  return `/${s}`;
}

function safePhoto(src) {
  return toPublicUrl(src);
}

function imageHTML(src, alt, className = "", extra = "") {
  return `
    <img
      class="${escapeHTML(className)}"
      src="${escapeHTML(safePhoto(src))}"
      alt="${escapeHTML(alt || "Foto member")}"
      onerror="this.onerror=null;this.src='${escapeHTML(PLACEHOLDER_IMG)}';"
      ${extra}
    >
  `;
}

function getMembers() {
  return Array.isArray(window.MEMBERS) ? window.MEMBERS : [];
}

function getRawDivisions() {
  return Array.isArray(window.DIVISIONS) ? window.DIVISIONS : [];
}

function normalizeDivisionCss(key, css) {
  if (css) return css;

  const k = String(key || "").toLowerCase();

  if (k.includes("core")) return "p3r-div-core";
  if (k.includes("flex")) return "p3r-div-flex";
  if (k.includes("ops")) return "p3r-div-ops";
  if (k.includes("inf")) return "p3r-div-inf";
  if (k.includes("library")) return "p3r-div-inf";
  if (k.includes("marketing")) return "p3r-div-flex";
  if (k.includes("pusdatin")) return "p3r-div-core";
  if (k.includes("boc")) return "p3r-div-ops";

  return "p3r-div-core";
}

function getDivisions() {
  const raw = getRawDivisions();

  const normalized = raw
    .filter(Boolean)
    .map((division) => {
      const key = String(division.key ?? division.division_key ?? division.slug ?? division.name ?? "division")
        .toLowerCase()
        .replaceAll(" ", "_");

      return {
        key,
        name: division.name ?? division.division ?? key,
        sub: division.sub ?? division.description ?? "Division filter",
        css: normalizeDivisionCss(key, division.css),
      };
    });

  const hasAll = normalized.some((d) => d.key === "all");

  return [
    ...(hasAll
      ? []
      : [
          {
            key: "all",
            name: "ALL MEMBERS",
            sub: "Tampilkan semua data",
            css: "p3r-div-core",
          },
        ]),
    ...normalized,
  ];
}

function getStats(member) {
  return member?.stats && typeof member.stats === "object" ? member.stats : {};
}

function getWinrate(member) {
  const stats = getStats(member);
  return toNumber(stats.winrate, 0);
}

function getDivisionKey(member) {
  return String(
    member?.divisionKey ??
      member?.division_key ??
      member?.division_slug ??
      member?.division ??
      "core"
  )
    .toLowerCase()
    .replaceAll(" ", "_");
}

function uniqueRoles(data) {
  return [...new Set(data.map((m) => m?.role).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b))
  );
}

function divisionBadge(member) {
  const key = getDivisionKey(member);
  const label = member?.division || "DIVISION";

  return `
    <span class="p3r-div-badge ${escapeHTML(normalizeDivisionCss(key, ""))}">
      ${escapeHTML(label)}
    </span>
  `;
}

/* ======================================================
   DECORATION INJECTION
   Tidak menyentuh database. Hanya tambah elemen visual.
   ====================================================== */

function injectP3RDecor() {
  document.body.classList.add("p3r");

  const hero = document.querySelector(".p3r-hero");
  if (!hero) return;

  if (!document.querySelector(".p3r-corner-hud")) {
    hero.insertAdjacentHTML(
      "beforeend",
      `
        <div class="p3r-corner-hud" aria-hidden="true">
          <div class="p3r-hud-face"></div>
          <div class="p3r-hud-face"></div>
          <div class="p3r-hud-face"></div>
        </div>
      `
    );
  }

  if (!document.querySelector(".p3r-command-hud")) {
    hero.insertAdjacentHTML(
      "beforeend",
      `
        <div class="p3r-command-hud" aria-hidden="true">
          <div class="cmd-title">Open Profile</div>
          <div class="cmd-sub">Command</div>
          <div class="cmd-buttons">
            <span><span class="cmd-key">A</span> Confirm</span>
            <span><span class="cmd-key">B</span> Back</span>
          </div>
        </div>
      `
    );
  }
}

/* ======================================================
   MVP
   ====================================================== */

function renderMVP() {
  const members = getMembers();
  if (!members.length) return;

  const sorted = [...members].sort((a, b) => getWinrate(b) - getWinrate(a));

  const mvp = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  if (!mvp) return;

  const mvpStats = getStats(mvp);

  const mvpPhoto = $("#mvpPhoto");
  if (mvpPhoto) {
    mvpPhoto.src = safePhoto(mvp.photo);
    mvpPhoto.alt = `Foto ${mvp.name || "MVP"}`;
    mvpPhoto.onerror = () => {
      mvpPhoto.onerror = null;
      mvpPhoto.src = PLACEHOLDER_IMG;
    };
  }

  setText("#mvpName", mvp.name);
  setText("#mvpRole", mvp.role);
  setText("#mvpDivision", mvp.division);
  setText("#mvpTagline", mvp.tagline);

  setText("#mvpRank", mvpStats.rank ?? "—");
  setText("#mvpWr", mvpStats.winrate ?? "—");
  setText("#mvpLvl", mvpStats.level ?? "—");
  setText("#mvpStatus", mvp.status ?? "—");

  const reason =
    mvp?.expertise?.achievement ||
    mvp?.tagline ||
    "Member dengan performa paling menonjol berdasarkan success rate tertinggi.";

  setText("#mvpReason", reason);

  const mvpLink = $("#mvpLink");
  if (mvpLink) {
    mvpLink.href = profileUrl(mvp.id);
  }

  renderRunnerUps([second, third]);
  renderTopPerformers(sorted.slice(0, 5));
}

function renderRunnerUps(list) {
  const wrap = $("#mvpRunnerUps");
  if (!wrap) return;

  const cards = list
    .filter(Boolean)
    .map((member, index) => {
      const rank = index === 0 ? 2 : 3;
      const stats = getStats(member);

      return `
        <a class="p3r-mvp-mini" href="${profileUrl(member.id)}">
          <div class="p3r-mvp-mini-rank rank-${rank}">#${rank}</div>

          ${imageHTML(member.photo, `Foto ${member.name}`, "p3r-mvp-mini-img")}

          <div class="flex-grow-1">
            <div class="p3r-mvp-mini-name">${escapeHTML(member.name)}</div>
            <div class="p3r-mvp-mini-sub">
              ${escapeHTML(member.role)} • ${escapeHTML(member.division)}
            </div>
          </div>

          <div class="p3r-mvp-mini-chip">
            SR <b>${escapeHTML(stats.winrate ?? "—")}%</b>
          </div>
        </a>
      `;
    });

  wrap.innerHTML = cards.length
    ? `<div class="p3r-mvp-ups">${cards.join("")}</div>`
    : "";
}

function renderTopPerformers(topMembers) {
  const topList = $("#topList");
  if (!topList) return;

  topList.innerHTML = topMembers
    .map((member, index) => {
      const stats = getStats(member);

      return `
        <a
          class="p3r-panel"
          style="text-decoration:none;color:inherit;padding:14px 16px"
          href="${profileUrl(member.id)}"
        >
          <div class="d-flex align-items-center gap-2">
            <div class="p3r-chip" style="min-width:58px;text-align:center">
              #${index + 1}
            </div>

            ${imageHTML(
              member.photo,
              `Foto ${member.name}`,
              "",
              'style="width:48px;height:48px;object-fit:cover;border:3px solid rgba(255,255,255,.35);transform:skewX(-8deg)"'
            )}

            <div class="flex-grow-1">
              <div style="font-family:var(--font-head);font-weight:1000;letter-spacing:1px;font-size:1.2rem;line-height:.95;text-transform:uppercase">
                ${escapeHTML(member.name)}
              </div>
              <div class="p3r-muted small">
                ${escapeHTML(member.role)} • ${escapeHTML(member.division)} • SR ${escapeHTML(stats.winrate ?? "—")}%
              </div>
            </div>
          </div>
        </a>
      `;
    })
    .join("");
}

/* ======================================================
   DIVISION SWITCHER
   ====================================================== */

function renderDivisionSwitch() {
  const wrap = $("#divisionSwitch");
  if (!wrap) return;

  const divisions = getDivisions();

  wrap.innerHTML = divisions
    .map((division) => {
      const key = String(division.key ?? "all");
      const active = key === activeDivision ? "is-active" : "";

      return `
        <button
          class="p3r-div-btn ${escapeHTML(division.css)} ${active}"
          data-div="${escapeHTML(key)}"
          type="button"
        >
          <span class="p3r-div-accent"></span>
          <div>
            <div class="p3r-div-name">${escapeHTML(division.name ?? key)}</div>
            <div class="p3r-div-sub">${escapeHTML(division.sub ?? "Division filter")}</div>
          </div>
        </button>
      `;
    })
    .join("");

  wrap.querySelectorAll("[data-div]").forEach((button) => {
    button.addEventListener("click", () => {
      activeDivision = button.getAttribute("data-div") || "all";
      renderDivisionSwitch();
      window.__applyRosterFilters?.();
    });
  });
}

/* ======================================================
   ROSTER
   ====================================================== */

function memberCard(member) {
  const stats = getStats(member);

  return `
    <div class="col-12 col-md-6 col-xl-4 p3r-reveal">
      <div class="p3r-card">
        <div class="p3r-card-body">

          <a class="p3r-btn p3r-status-open" href="${profileUrl(member.id)}">
            OPEN
          </a>

          <div class="p3r-status-card-main">
            <div>
              ${imageHTML(member.photo, `Foto ${member.name}`, "p3r-avatar")}
            </div>

            <div class="min-w-0">
              <div class="p3r-status-name">
                ${escapeHTML(member.name)}
              </div>

              <div class="d-flex flex-wrap gap-2 align-items-center mt-2">
                <div class="p3r-role">${escapeHTML(member.role)}</div>
                ${divisionBadge(member)}
              </div>

              <div class="p3r-status-tagline">
                ${escapeHTML(member.tagline ?? "—")}
              </div>

              <div class="p3r-status-stats">
                <div class="p3r-chip">Rank: <b>${escapeHTML(stats.rank ?? "—")}</b></div>
                <div class="p3r-chip">SR: <b>${escapeHTML(stats.winrate ?? "—")}%</b></div>
                <div class="p3r-chip">Lv: <b>${escapeHTML(stats.level ?? "—")}</b></div>
                <div class="p3r-chip">Status: <b>${escapeHTML(member.status ?? "—")}</b></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

let revealObserver = null;

function initRevealObserver() {
  const nodes = document.querySelectorAll(".p3r-reveal:not(.is-ready)");

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => {
      node.classList.add("is-ready", "is-in");
    });
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
  }

  nodes.forEach((node) => {
    node.classList.add("is-ready");
    revealObserver.observe(node);
  });
}

function renderRoster() {
  const members = getMembers();

  const roleFilter = $("#roleFilter");
  const grid = $("#memberGrid");
  const countLabel = $("#countLabel");
  const searchInput = $("#searchInput");

  if (!roleFilter || !grid || !countLabel || !searchInput) return;

  if (roleFilter.options.length <= 1) {
    const roles = uniqueRoles(members);

    roleFilter.insertAdjacentHTML(
      "beforeend",
      roles
        .map((role) => `<option value="${escapeHTML(role)}">${escapeHTML(role)}</option>`)
        .join("")
    );
  }

  function apply() {
    const q = String(searchInput.value || "").trim().toLowerCase();
    const selectedRole = roleFilter.value;

    const filtered = members.filter((member) => {
      const searchable = [
        member.name,
        member.role,
        member.division,
        member.mainRole,
        member.main_role,
        member.tagline,
        member.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchSearch = !q || searchable.includes(q);
      const matchRole = selectedRole === "all" || member.role === selectedRole;
      const matchDivision = activeDivision === "all" || getDivisionKey(member) === activeDivision;

      return matchSearch && matchRole && matchDivision;
    });

    grid.innerHTML = filtered.length
      ? filtered.map(memberCard).join("")
      : `
        <div class="col-12">
          <div class="p3r-panel text-center">
            <div class="p3r-panel-title justify-content-center">
              <span class="p3r-panel-title-dot"></span>
              DATA NOT FOUND
            </div>
            <div class="p3r-muted mt-2">
              Tidak ada member yang cocok dengan filter saat ini.
            </div>
          </div>
        </div>
      `;

    countLabel.textContent = String(filtered.length);
    initRevealObserver();
  }

  window.__applyRosterFilters = apply;

  searchInput.addEventListener("input", apply);
  roleFilter.addEventListener("change", apply);

  apply();
}

/* ======================================================
   INIT
   ====================================================== */

(function initHome() {
  injectP3RDecor();

  if (!Array.isArray(window.MEMBERS)) {
    console.warn("Data MEMBERS belum tersedia. Pastikan data dari Blade dimuat sebelum p3r-home.js");
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  renderMVP();
  renderDivisionSwitch();
  renderRoster();
  initRevealObserver();
})();