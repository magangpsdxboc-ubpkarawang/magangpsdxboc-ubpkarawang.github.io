/*
=========================================================
CONFIG.JS
WEBSITE PROFILE MAGANG PUSDATIN X BOC
UBP KARAWANG
=========================================================

File ini menjadi konfigurasi utama frontend GitHub Pages.

Berisi:
- URL Google Apps Script API
- Nama aplikasi
- Lokasi halaman
- Lokasi aset
- Pengaturan timeout dan cache

Jangan menyimpan password, token admin, atau data rahasia
di file frontend karena semua kode GitHub Pages bersifat
publik dan dapat dilihat pengunjung.
=========================================================
*/

(function initializeP3RConfig() {
  "use strict";

  /*
  =======================================================
  API GOOGLE APPS SCRIPT
  =======================================================
  */

  const API_URL =
    "https://script.google.com/macros/s/AKfycbw5gj5Tpo2mVeJ18CgwE1OvdPCC3A7A7rdq7UnX8tKJ0p1SR7842Ir_mDphEVEh95Vc/exec";


  /*
  =======================================================
  HELPER PATH
  =======================================================

  Fungsi ini membuat URL berdasarkan folder website saat
  ini, bukan berdasarkan root domain.

  Karena itu, website tetap dapat berjalan pada:

  https://username.github.io/

  maupun:

  https://username.github.io/nama-repository/
  =======================================================
  */

  function getSiteBaseUrl() {
    return new URL("./", window.location.href);
  }


  function resolveSiteUrl(relativePath) {
    const cleanPath = String(relativePath || "")
      .trim()
      .replace(/^\/+/, "");

    return new URL(
      cleanPath,
      getSiteBaseUrl()
    ).href;
  }


  function buildPageUrl(pageName, parameters) {
    const url = new URL(
      String(pageName || "index.html"),
      getSiteBaseUrl()
    );

    const params = parameters || {};

    Object.keys(params).forEach(function (key) {
      const value = params[key];

      if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
      ) {
        return;
      }

      url.searchParams.set(
        key,
        String(value)
      );
    });

    return url.href;
  }


  /*
  =======================================================
  KONFIGURASI APLIKASI
  =======================================================
  */

  const config = {
    APP_NAME:
      "PUSDATIN X BOC — UBP Karawang",

    APP_SHORT_NAME:
      "PUSDATIN X BOC",

    APP_DESCRIPTION:
      "Website profil anggota magang Pusdatin dan BOC Universitas Buana Perjuangan Karawang.",

    APP_VERSION:
      "1.0.0",

    API_URL:
      API_URL,

    API_ACTIONS: Object.freeze({
      PING:
        "ping",

      HOME:
        "home",

      MEMBERS:
        "members",

      MEMBER:
        "member",

      ALTERS:
        "alters",

      ALTER:
        "alter",

      DIVISIONS:
        "divisions"
    }),

    PAGES: Object.freeze({
      HOME:
        "index.html",

      PROFILE:
        "profile.html",

      ALTER:
        "alter.html",

      NOT_FOUND:
        "404.html"
    }),

    ASSETS: Object.freeze({
      LOGO:
        "assets/img/logo.png",

      PLACEHOLDER:
        "assets/img/placeholder.png",

      BASE_CSS:
        "assets/css/p3r.css"
    }),

    REQUEST_TIMEOUT_MS:
      20000,

    CACHE: Object.freeze({
      ENABLED:
        true,

      HOME_KEY:
        "p3r_home_data_v1",

      HOME_TIMESTAMP_KEY:
        "p3r_home_data_timestamp_v1",

      TTL_MS:
        5 * 60 * 1000
    }),

    DEBUG:
      true,

    getSiteBaseUrl:
      getSiteBaseUrl,

    resolveSiteUrl:
      resolveSiteUrl,

    buildPageUrl:
      buildPageUrl
  };


  /*
  =======================================================
  GLOBAL CONFIG
  =======================================================
  */

  window.P3R_CONFIG =
    Object.freeze(config);


  /*
  =======================================================
  GLOBAL ASSET URL
  =======================================================

  Dipertahankan agar kompatibel dengan:
  - p3r-home.js
  - p3r-profile.js
  - p3r-alterprofile.js
  =======================================================
  */

  window.P3R_PLACEHOLDER_IMG =
    resolveSiteUrl(
      config.ASSETS.PLACEHOLDER
    );

  window.P3R_LOGO_IMG =
    resolveSiteUrl(
      config.ASSETS.LOGO
    );


  /*
  =======================================================
  GLOBAL PAGE URL HELPERS
  =======================================================
  */

  window.P3R_PAGE_URLS =
    Object.freeze({
      home: function homeUrl() {
        return buildPageUrl(
          config.PAGES.HOME
        );
      },

      profile: function profileUrl(memberId) {
        return buildPageUrl(
          config.PAGES.PROFILE,
          {
            id: memberId
          }
        );
      },

      alter: function alterUrl(memberId, alterId) {
        return buildPageUrl(
          config.PAGES.ALTER,
          {
            memberId: memberId,
            id: alterId
          }
        );
      },

      notFound: function notFoundUrl() {
        return buildPageUrl(
          config.PAGES.NOT_FOUND
        );
      }
    });


  /*
  =======================================================
  DEBUG
  =======================================================
  */

  if (config.DEBUG) {
    console.info(
      "[P3R CONFIG] Konfigurasi frontend berhasil dimuat.",
      {
        app:
          config.APP_NAME,

        version:
          config.APP_VERSION,

        api:
          config.API_URL,

        baseUrl:
          getSiteBaseUrl().href,

        placeholder:
          window.P3R_PLACEHOLDER_IMG
      }
    );
  }
})();