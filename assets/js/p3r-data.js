// assets/js/p3r-data.js
// Single source of truth untuk semua halaman (home + profile + alter).

const MEMBERS = [
  {
    profile_type: "normal",

    id: "faisalalrico",
    name: "Faisal Alrico",
    role: "Video Editor",
    division: "BOC",
    divisionKey: "flex",
    mainRole: "All-Rounder",
    tagline: "Beyond the Starburst",
    bio: "Memimpin strategi, memastikan koordinasi tim rapi, dan jadi pengambil keputusan saat war. Fokus pada rotasi objektif, komunikasi cepat, dan pembacaan map yang presisi.",
    photo: "",
    videoCV: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    gallery: [
      { src: "assets/img/gallery/zen-01.jpg", caption: "Scrim night — map control" },
      { src: "assets/img/gallery/zen-02.jpg", caption: "Tournament day" },
      { src: "assets/img/gallery/zen-03.jpg", caption: "Aftermatch vibes" }
    ],
    status: "Active",
    joinDate: "2024-08-01",
    signature: "Nonexistent Reality",
    stats: { level: 50, rank: "Silver", winrate: 10 },
    skills: [
      { name: "OPERATOR", value: 100 },
      { name: "CAMERAMAN", value: 70 },
      { name: "VIDEO EDITING", value: 90 },
      { name: "GAME DEVELOPING", value: 95 },
      { name: "ON-FIELD OPERATIVE", value: 84 }
    ],
    expertise: {
      playstyle: "Controller — mengatur, menganalisa, dan menyelesaikan semuanya",
      strength: ["Creativity", "Out of the Box", "Silent Reader", "MadMan"],
      rolePool: ["Frontline", "Support", "BOC Operator"],
      mains: ["Davinci Resolve", "Unity", "Blender"],
      achievement: "2x War Crime"
    },

    // pointer ke alter (kalau enabled true => tombol lock muncul)
    alter: {
      enabled: true,
      alterId: "faisalalrico_aigis",
      label: "ALTER VERSION",
      hint: "Episode Aigis mode"
    }
  },

  {
    profile_type: "normal",

    id: "rayhanfadhillah",
    name: "Muhammad Rayhan Fadhillah",
    role: "Programmer",
    division: "PUSDATIN",
    divisionKey: "core",
    mainRole: "Mood Booster",
    tagline: "Weird and Tactics",
    bio: "Backup leader, handle rekrutmen, dan jadi penghubung antar divisi. Fokus analisa, evaluasi VOD, dan perbaikan pola teamfight.",
    photo: "https://images.unsplash.com/photo-1520975958225-588b65f5f4a5?auto=format&fit=crop&w=900&q=80",
    status: "Active",
    joinDate: "2025-08-10",
    signature: "Utility & Crusher",
    stats: { level: 30, rank: "Non-partisipant", winrate: 66 },
    skills: [
      { name: "PROGRAMMING", value: 80 },
      { name: "CAMERAMAN", value: 88 },
      { name: "UI / UX DESIGN", value: 92 },
      { name: "GAME DEVELOPING", value: 86 },
      { name: "OFF-FIELD OPERATIVE", value: 76 }
    ],
    expertise: {
      playstyle: "Support/Analyst — kontrol info, set up fight, dan jaga tempo.",
      strength: ["Power Backup", "WIT Drainer", "Mood Booster", "Adaptive Reaction"],
      rolePool: ["Support", "Programmer", "Flex"],
      mains: ["PHP", "Visual Studio Code", "Unity"],
      achievement: "3x AIC Integrator"
    },

    alter: { enabled: false }
  },

  {
    profile_type: "normal",

    id: "rasyid",
    name: "Rasyid Nugroho",
    role: "Administrator",
    division: "PUSDATIN",
    divisionKey: "core",
    mainRole: "IT Administrator",
    tagline: "Safe and Secure",
    bio: "Ngurus roster, jadwal latihan, dan dokumentasi. Jadi 'backbone' operasional biar tim tetap jalan rapi.",
    photo: "",
    status: "Active",
    joinDate: "Unknown",
    signature: "Network Discipline",
    stats: { level: 999, rank: "Unbound Parameter", winrate: 99 },
    skills: [
      { name: "DISCIPLINE", value: 90 },
      { name: "COMMUNICATION", value: 78 },
      { name: "NETWORKING", value: 100 },
      { name: "IT SUPPORT", value: 100 },
      { name: "PROGRAMMING", value: 80 }
    ],
    expertise: {
      playstyle: "Ops — maintain jadwal, data, dan flow latihan.",
      strength: ["Schedule", "Documentation", "Roster upkeep", "Anti-chaos"],
      rolePool: ["Ops", "Admin"],
      mains: ["Utility", "Support"],
      achievement: "Merapikan sistem roster & scrim weekly."
    },

    alter: { enabled: false }
  },

  {
    profile_type: "normal",

    id: "haririzky",
    name: "Hari Rizky Ardiantoro",
    role: "Programmer",
    division: "PUSDATIN",
    divisionKey: "core",
    mainRole: "AI Specialist",
    tagline: "Adapt, Adapt, Adapt!.",
    bio: "Fleksibel di role dan cepat adapt meta. Cocok buat ngisi komposisi tim sesuai kebutuhan match.",
    photo: "",
    status: "Active",
    joinDate: "2024-08-01",
    signature: "Meta Adapter",
    stats: { level: 50, rank: "Legend", winrate: 95 },
    skills: [
      { name: "PROGRAMMING", value: 100 },
      { name: "CAMERAMAN", value: 95 },
      { name: "UI / UX DESIGN", value: 75 },
      { name: "ARTIFICIAL INTELLIGENCE", value: 90 },
      { name: "ON-FIELD OPERATIVE", value: 95 }
    ],
    expertise: {
      playstyle: "Flex — isi gap draft dan adapt cepat.",
      strength: ["Role swap", "Meta read", "Tempo adjust"],
      rolePool: ["Flex", "Duelist", "Support"],
      mains: ["Any", "Flex"],
      achievement: "Sering jadi 'patch' saat roster berubah."
    },

    alter: { enabled: false }
  }
];

// ===== ALTER DATA (untuk profile_alter.html) =====
const ALTERS = [
  {
    profile_type: "alter",

    id: "faisalalrico_aigis",
    baseId: "faisalalrico",

    // optional: buat tema merah
    theme: "aigis_red",

    name: "Faisal Alrico — AIGIS",
    role: "Petarung",
    division: "EPISODE AIGIS",
    divisionKey: "alter",
    mainRole: "Frontliner",
    tagline: "Red protocol engaged. No hesitation.",
    bio: "Versi asli yang muncul setelah kunci terbuka. Dia bukan cuma editor—dia operator lapangan yang ngambil keputusan dengan insting tempur. Mode ini mengutamakan eksekusi dan tekanan.",
    photo: "assets/img/players/faisal-aigis.png",

    videoCV: "assets/video/faisal-aigis.mp4",

    gallery: [
      { src: "assets/img/gallery/faisal-aigis-01.jpg", caption: "Sector breach" },
      { src: "assets/img/gallery/faisal-aigis-02.jpg", caption: "Red corridor" }
    ],

    status: "Awakened",
    joinDate: "—",
    signature: "Red Protocol",
    stats: { level: 99, rank: "Aigis", winrate: 88 },

    skills: [
      { name: "PRESSURE", value: 96 },
      { name: "EXECUTION", value: 97 },
      { name: "SITUATIONAL READ", value: 92 },
      { name: "TEMPO BREAK", value: 94 },
      { name: "CLUTCH", value: 93 }
    ],

    expertise: {
      playstyle: "Aggressor — buka fight, pecah formasi, paksa timing lawan hancur.",
      strength: ["Hard engage", "Tempo break", "Duel win", "Threat presence"],
      rolePool: ["Entry", "Frontliner", "Assaulter"],
      mains: ["Blade", "Burst", "Rush"],
      achievement: "Protocol unlocked: 3 flawless pushes."
    }
  }
];

// ===== DIVISIONS =====
const DIVISIONS = [
  { key: "all", name: "ALL DIVISIONS", sub: "Tampilkan semuanya", css: "" },
  { key: "core", name: "PUSDATIN", sub: "Core Team - Primary Unit", css: "p3r-div-core" },
  { key: "flex", name: "BOC", sub: "Flexible Roles - Super Adapt Unit", css: "p3r-div-flex" },
  { key: "ops", name: "MARKETING", sub: "Secondary Admin - High Support Unit", css: "p3r-div-ops" },
  { key: "inf", name: "LIBRARY", sub: "Intelligence - Low Support Unit", css: "p3r-div-inf" }
];

// ===== Helpers =====
function getMemberById(id) {
  return MEMBERS.find((x) => x.id === id) || null;
}
function getAlterById(id) {
  return ALTERS.find((x) => x.id === id) || null;
}
function getAlterByBaseId(baseId) {
  return ALTERS.find((x) => x.baseId === baseId) || null;
}

// Expose global
window.MEMBERS = MEMBERS;
window.ALTERS = ALTERS;
window.DIVISIONS = DIVISIONS;

window.getMemberById = getMemberById;
window.getAlterById = getAlterById;
window.getAlterByBaseId = getAlterByBaseId;