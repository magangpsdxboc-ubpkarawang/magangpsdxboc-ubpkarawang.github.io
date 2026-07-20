// public/assets/js/p3r-profile.js
// Profile normal logic untuk Laravel Blade
// Data utama: window.MEMBER
// Optional: window.ALTER

const P3R_PLACEHOLDER_IMG = window.P3R_PLACEHOLDER_IMG || "/assets/img/placeholder.png";
const $ = (selector) => document.querySelector(selector);

function escapeHTML(value) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeEmpty(value) {
  if (value === null || value === undefined) return "";
  const s = String(value).trim();
  if (!s) return "";

  const invalid = ["-", "n/a", "na", "none", "null", "undefined"];
  if (invalid.includes(s.toLowerCase())) return "";

  return s;
}

function clampNumber(value, min = 0, max = 100) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = normalizeEmpty(value) || "—";
}

function toPublicUrl(src) {
  const s = normalizeEmpty(src);
  if (!s) return P3R_PLACEHOLDER_IMG;

  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;

  return `/${s}`;
}

function safePhoto(src) {
  return toPublicUrl(src);
}

function profileUrl(id) {
  return `/profile/${encodeURIComponent(String(id ?? ""))}`;
}

function alterUrl(memberId) {
  return `/profile/${encodeURIComponent(String(memberId ?? ""))}/alter`;
}

function getStats(data) {
  return data?.stats && typeof data.stats === "object" ? data.stats : {};
}

function normalizeMember(member) {
  if (!member || typeof member !== "object") return null;

  return {
    ...member,
    mainRole: member.mainRole ?? member.main_role,
    joinDate: member.joinDate ?? member.join_date,
    videoCV: member.videoCV ?? member.video_cv,
    divisionKey: member.divisionKey ?? member.division_key,
  };
}

/* ======================================================
   COPY / SHARE
   ====================================================== */

async function copyLink(button) {
  const text = window.location.href;

  try {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (!ok) throw new Error("Fallback copy failed");
    }

    if (button) {
      const oldText = button.textContent;
      button.textContent = "COPIED";
      setTimeout(() => {
        button.textContent = oldText;
      }, 1200);
    }
  } catch {
    window.prompt("Copy link manual:", text);
  }
}

/* ======================================================
   VIDEO
   ====================================================== */

function toYouTubeEmbed(url) {
  const s = normalizeEmpty(url);
  if (!s) return null;

  try {
    const u = new URL(s);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : null;
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.includes("/embed/")) return s;

      if (u.pathname.includes("/shorts/")) {
        const id = u.pathname.split("/shorts/")[1]?.split("/")[0];
        return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : null;
      }

      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : null;
    }
  } catch {}

  return null;
}

function getVideoType(url) {
  const lower = String(url || "").toLowerCase();

  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".ogg") || lower.endsWith(".ogv")) return "video/ogg";
  return "video/mp4";
}

function renderVideoCV(videoUrl) {
  const wrap = document.getElementById("videoWrap");
  const note = document.getElementById("videoNote");
  if (!wrap || !note) return;

  const panel = wrap.closest(".p3r-panel");
  const url = normalizeEmpty(videoUrl);

  if (!url) {
    if (panel) panel.style.display = "none";
    wrap.innerHTML = "";
    note.textContent = "—";
    return;
  }

  if (panel) panel.style.display = "";

  const youtube = toYouTubeEmbed(url);

  if (youtube) {
    note.textContent = "Embedded video dari YouTube.";
    wrap.innerHTML = `
      <iframe
        src="${escapeHTML(youtube)}"
        title="Video CV"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    `;
    return;
  }

  note.textContent = "Local video file.";
  wrap.innerHTML = `
    <video controls preload="metadata">
      <source src="${escapeHTML(toPublicUrl(url))}" type="${escapeHTML(getVideoType(url))}">
      Browser kamu tidak mendukung video tag.
    </video>
  `;
}

/* ======================================================
   SKILLS
   ====================================================== */

function renderSkills(skills) {
  const wrap = document.getElementById("skillsWrap");
  if (!wrap) return;

  const list = Array.isArray(skills) ? skills.filter(Boolean) : [];

  if (!list.length) {
    wrap.innerHTML = `
      <div class="p3r-skill">
        <div class="p3r-skill-top">
          <div>NO DATA</div>
          <div>0/100</div>
        </div>
        <div class="p3r-bar"><span style="width:0%"></span></div>
      </div>
    `;
    setText("skillHint", "Overall: 0/100");
    return;
  }

  wrap.innerHTML = list
    .map((skill) => {
      const name = escapeHTML(skill.name ?? "Skill");
      const value = clampNumber(skill.value ?? 0);

      return `
        <div class="p3r-skill">
          <div class="p3r-skill-top">
            <div>${name}</div>
            <div>${value}/100</div>
          </div>
          <div class="p3r-bar">
            <span data-bar="${value}"></span>
          </div>
        </div>
      `;
    })
    .join("");

  requestAnimationFrame(() => {
    document.querySelectorAll("[data-bar]").forEach((bar) => {
      const value = clampNumber(bar.getAttribute("data-bar"));
      bar.style.width = `${value}%`;
    });
  });

  const total = list.reduce((sum, skill) => sum + clampNumber(skill.value ?? 0), 0);
  const overall = Math.round(total / Math.max(1, list.length));
  setText("skillHint", `Overall: ${overall}/100`);
}

/* ======================================================
   TAGS / EXPERTISE
   ====================================================== */

function renderTags(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const items = Array.isArray(list) ? list.filter(Boolean) : [];

  if (!items.length) {
    el.innerHTML = `<span class="p3r-tag">NO DATA</span>`;
    return;
  }

  el.innerHTML = items.map((tag) => `<span class="p3r-tag">${escapeHTML(tag)}</span>`).join("");
}

/* ======================================================
   GALLERY
   ====================================================== */

function renderGallery(gallery) {
  const panel = document.getElementById("galleryPanel");
  const track = document.getElementById("gTrack");
  const dots = document.getElementById("gDots");
  const cap = document.getElementById("gCap");
  const prev = document.getElementById("gPrev");
  const next = document.getElementById("gNext");
  const viewport = document.getElementById("gViewport");

  if (!panel || !track || !dots || !cap || !prev || !next || !viewport) return;

  const items = Array.isArray(gallery)
    ? gallery.filter((item) => item && normalizeEmpty(item.src))
    : [];

  if (!items.length) {
    panel.style.display = "none";
    track.innerHTML = "";
    dots.innerHTML = "";
    cap.textContent = "";
    return;
  }

  panel.style.display = "";

  let index = 0;

  function clampIndex(i) {
    if (i < 0) return items.length - 1;
    if (i >= items.length) return 0;
    return i;
  }

  function go(to) {
    index = clampIndex(to);
    track.style.transform = `translateX(-${index * 100}%)`;
    cap.textContent = items[index]?.caption || "";

    dots.querySelectorAll(".p3r-g-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-on", dotIndex === index);
    });
  }

  track.innerHTML = items
    .map((item) => {
      const src = escapeHTML(toPublicUrl(item.src));
      const alt = escapeHTML(item.caption || "Gallery");

      return `
        <div class="p3r-g-slide">
          <img
            src="${src}"
            alt="${alt}"
            onerror="this.onerror=null;this.src='${escapeHTML(P3R_PLACEHOLDER_IMG)}';"
          >
        </div>
      `;
    })
    .join("");

  dots.innerHTML = items
    .map((_, dotIndex) => {
      const active = dotIndex === 0 ? "is-on" : "";
      return `<button class="p3r-g-dot ${active}" type="button" data-dot="${dotIndex}" aria-label="Go to slide ${dotIndex + 1}"></button>`;
    })
    .join("");

  dots.querySelectorAll("[data-dot]").forEach((dot) => {
    dot.addEventListener("click", () => {
      go(Number(dot.getAttribute("data-dot")) || 0);
    });
  });

  prev.onclick = () => go(index - 1);
  next.onclick = () => go(index + 1);

  let startX = null;

  viewport.ontouchstart = (event) => {
    startX = event.touches?.[0]?.clientX ?? null;
  };

  viewport.ontouchend = (event) => {
    if (startX === null) return;

    const endX = event.changedTouches?.[0]?.clientX ?? startX;
    const diff = endX - startX;
    startX = null;

    if (Math.abs(diff) < 40) return;
    if (diff > 0) go(index - 1);
    else go(index + 1);
  };

  go(0);
}

/* ======================================================
   ALTER BUTTON
   ====================================================== */

function renderAlterButton(member) {
  const button = document.getElementById("alterBtn");
  if (!button || !member) return;

  const hasAlter =
    !!window.ALTER ||
    !!member.alter ||
    !!member.has_alter ||
    !!member.hasAlter;

  if (!hasAlter) {
    button.style.display = "none";
    button.removeAttribute("href");
    return;
  }

  button.style.display = "";
  button.href = alterUrl(member.id);
  button.textContent = "ALTER";
  button.title = "Buka alter profile";
}

/* ======================================================
   RENDER
   ====================================================== */

function renderProfile(member) {
  document.title = `PUSDATIN X BOC — ${member.name || "Profile"}`;

  const photo = document.getElementById("photo");
  if (photo) {
    photo.src = safePhoto(member.photo);
    photo.alt = `Foto ${member.name || "Player"}`;
    photo.onerror = () => {
      photo.onerror = null;
      photo.src = P3R_PLACEHOLDER_IMG;
    };
  }

  const stats = getStats(member);

  setText("name", member.name);
  setText("role", member.role);
  setText("division", member.division);
  setText("mainRole", member.mainRole);
  setText("tagline", member.tagline);
  setText("bio", member.bio);

  setText("rank", stats.rank);
  setText("level", stats.level);
  setText("winrate", stats.winrate);
  setText("status", member.status);

  setText("joinDate", member.joinDate);
  setText("signature", member.signature);

  renderAlterButton(member);
  renderSkills(member.skills);
  renderVideoCV(member.videoCV);
  renderGallery(member.gallery);

  const expertise = member.expertise && typeof member.expertise === "object" ? member.expertise : {};

  setText("playstyle", expertise.playstyle);
  renderTags("strengthTags", expertise.strength);
  renderTags("rolePool", expertise.rolePool);
  renderTags("mains", expertise.mains);
  setText("achievement", expertise.achievement);
}

function renderNotFound() {
  setText("name", "PLAYER NOT FOUND");
  setText("bio", "Data profile tidak tersedia atau parameter URL tidak valid.");

  const videoPanel = document.getElementById("videoWrap")?.closest(".p3r-panel");
  if (videoPanel) videoPanel.style.display = "none";

  const galleryPanel = document.getElementById("galleryPanel");
  if (galleryPanel) galleryPanel.style.display = "none";
}

/* ======================================================
   REVEAL
   ====================================================== */

function initReveal() {
  const nodes = document.querySelectorAll(".p3r-reveal");

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  nodes.forEach((node) => observer.observe(node));
}

/* ======================================================
   INIT
   ====================================================== */

(function initProfile() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const copyBtn = document.getElementById("copyLinkBtn");
  const shareBtn = document.getElementById("shareBtn");

  copyBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    copyLink(copyBtn);
  });

  shareBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    copyLink(shareBtn);
  });

  const member = normalizeMember(window.MEMBER || null);

  if (!member) {
    renderNotFound();
    initReveal();
    return;
  }

  renderProfile(member);
  initReveal();
})();