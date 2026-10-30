/* ============================================================
   Fundaserinco Brand Hub - SPA Router, idioma, tema y utilidades
   ============================================================ */

/* ---------- Router SPA ---------- */
(function () {
  "use strict";

  const DEFAULT_PAGE = "brand-overview-and-logo-anatomy";

  // "component-library-and-ui-specs" comparte sección con typography pero hace scroll al anchor
  const ROUTES = {
    "brand-overview-and-logo-anatomy":  { section: "brand-overview-and-logo-anatomy", anchor: null },
    "colorimetry-and-palettes":         { section: "colorimetry-and-palettes",        anchor: null },
    "typography-and-scale":             { section: "typography-and-scale",            anchor: null },
    "component-library-and-ui-specs":   { section: "typography-and-scale",            anchor: "ui-components" }
  };

  const navLinks = document.querySelectorAll(".nav-link");
  const pages    = document.querySelectorAll("[data-page]");

  function showPage(path, shouldScroll, anchorId) {
    const route = ROUTES[path] || ROUTES[DEFAULT_PAGE];
    const target = document.querySelector('[data-page="' + route.section + '"]');
    if (!target) return;

    pages.forEach(function (p) {
      p.hidden = true;
      p.classList.remove("active");
    });

    target.hidden = false;
    target.classList.add("active");

    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.dataset.path === path);
    });

    const anchor = anchorId || route.anchor;
    requestAnimationFrame(function () {
      if (anchor) {
        const anchorEl = target.querySelector("#" + anchor);
        if (anchorEl) {
          // La animación de entrada desplaza la sección (translateY 10px):
          // se salta al anchor cuando termina para no quedar bajo el header.
          let jumped = false;
          const jump = function () {
            if (jumped) return;
            jumped = true;
            anchorEl.scrollIntoView({ behavior: "smooth", block: "start" });
          };
          target.addEventListener("animationend", function (e) {
            if (e.target === target) jump();
          });
          setTimeout(jump, 400);
          return;
        }
      }
      if (shouldScroll !== false) window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("click", function (e) {
    const link = e.target.closest("[data-path]");
    if (!link) return;
    e.preventDefault();
    const path = link.dataset.path;
    if (!path || !ROUTES[path]) return;
    if (window.location.hash.slice(1) !== path) {
      history.pushState({ path: path }, "", "#" + path);
    }
    showPage(path, true);
  });

  // Un hash puede ser una ruta o el id de un anchor interno de una sección
  function resolveHash(hash) {
    if (ROUTES[hash]) return { path: hash, anchorId: null };
    const anchorEl = hash ? document.getElementById(hash) : null;
    const section = anchorEl && anchorEl.closest("[data-page]");
    if (!section) return { path: DEFAULT_PAGE, anchorId: null };
    const path = Object.keys(ROUTES).find(function (p) {
      return ROUTES[p].section === section.dataset.page;
    });
    return { path: path || DEFAULT_PAGE, anchorId: hash };
  }

  function handleHash() {
    const resolved = resolveHash(window.location.hash.slice(1));
    showPage(resolved.path, false, resolved.anchorId);
  }

  window.addEventListener("popstate", handleHash);
  document.addEventListener("DOMContentLoaded", handleHash);

  window.__navigate = function (path) {
    if (ROUTES[path]) {
      history.pushState({ path: path }, "", "#" + path);
      showPage(path, true);
    }
  };
})();

/* ---------- Toast + portapapeles ---------- */
function showToast(message) {
  const toast = document.getElementById("copy-toast");
  const text  = document.getElementById("toast-text");
  if (!toast || !text) return;
  text.textContent = message;
  toast.classList.remove("translate-y-16", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");
  setTimeout(function () {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-16", "opacity-0");
  }, 2400);
}

function copyToClipboard(text, label) {
  const done = function () {
    showToast(fsT("Copied {label} to clipboard!", { label: label || text }));
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(done).catch(function () {
      showToast(fsT("Could not copy"));
    });
  }
}

/* ---------- Tokens (copiar) ---------- */
function copyTokens(type) {
  let content = "";
  if (type === "css") {
    content = ":root {\n" +
      "  --fundaserinco-tech-blue: #0086C8;\n" +
      "  --fundaserinco-tech-blue-rgb: 0, 134, 200;\n" +
      "  --fundaserinco-solar-coral: #F48A56;\n" +
      "  --fundaserinco-solar-coral-rgb: 244, 138, 86;\n" +
      "  --fundaserinco-digital-sky: #4EA8DE;\n" +
      "  --fundaserinco-digital-sky-rgb: 78, 168, 222;\n" +
      "  --fundaserinco-slate-dark: #0F172A;\n" +
      "  --fundaserinco-canvas: #FAF8FF;\n" +
      "  --fundaserinco-gradient-orbit: linear-gradient(135deg, #0086C8 0%, #4EA8DE 100%);\n" +
      "  --fundaserinco-gradient-solar: linear-gradient(90deg, #F48A56 0%, #F97316 100%);\n" +
      "}";
    copyToClipboard(content, "CSS Variables");
  } else if (type === "tailwind") {
    content = "// tailwind.config.js snippet\n" +
      "module.exports = {\n" +
      "  theme: {\n" +
      "    extend: {\n" +
      "      colors: {\n" +
      "        fundaserinco: {\n" +
      "          blue:  { DEFAULT: '#0086C8', 50:'#EFF8FF', 100:'#DBEAFE', 400:'#4EA8DE', 500:'#0086C8', 600:'#0072B2', 900:'#003154' },\n" +
      "          coral: { DEFAULT: '#F48A56', 50:'#FFF7ED', 500:'#F48A56', 600:'#EA580C', 700:'#C2410C' },\n" +
      "          slate:  '#0F172A',\n" +
      "          canvas: '#FAF8FF'\n" +
      "        }\n" +
      "      }\n" +
      "    }\n" +
      "  }\n" +
      "};";
    copyToClipboard(content, "Tailwind Configuration");
  } else {
    content = JSON.stringify({
      version: "1.0",
      brand: "Fundaserinco",
      tokens: {
        techBlue: "#0086C8",
        solarCoral: "#F48A56",
        digitalSky: "#4EA8DE",
        slateDark: "#0F172A"
      }
    }, null, 2);
    copyToClipboard(content, "JSON Tokens");
  }
}

/* ---------- Idioma ---------- */
(function () {
  "use strict";

  const STORAGE_KEY = "fs-lang";
  const DEFAULT_LANG = "es";
  const SUPPORTED = ["es", "en"];
  const SKIP_TAGS = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, TEXTAREA: 1 };

  const state = { lang: DEFAULT_LANG };
  const textNodes = [];
  const attrNodes = [];
  let originalTitle = "";
  let ready = false;

  function normalize(str) {
    return String(str).replace(/\s+/g, " ").trim();
  }

  function table() {
    return (window.FS_I18N && window.FS_I18N[state.lang]) || {};
  }

  function translate(value, map) {
    const key = normalize(value);
    if (!key || !map[key]) return value;
    const lead = value.match(/^\s*/)[0];
    const trail = value.match(/\s*$/)[0];
    return lead + map[key] + trail;
  }

  function collect() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !normalize(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || SKIP_TAGS[parent.tagName]) return NodeFilter.FILTER_REJECT;
        if (parent.closest("[data-i18n-ignore]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) textNodes.push({ node: node, en: node.nodeValue });

    ["placeholder", "aria-label", "title", "alt"].forEach(function (attr) {
      document.querySelectorAll("[" + attr + "]").forEach(function (el) {
        if (el.closest("[data-i18n-ignore]")) return;
        attrNodes.push({ el: el, attr: attr, en: el.getAttribute(attr) });
      });
    });

    originalTitle = document.title;
    ready = true;
  }

  function apply() {
    const map = table();
    const isEn = state.lang === "en";
    textNodes.forEach(function (item) {
      item.node.nodeValue = isEn ? item.en : translate(item.en, map);
    });
    attrNodes.forEach(function (item) {
      item.el.setAttribute(item.attr, isEn ? item.en : translate(item.en, map));
    });
    document.title = isEn ? originalTitle : translate(originalTitle, map);
  }

  function setLang(lang) {
    state.lang = SUPPORTED.indexOf(lang) !== -1 ? lang : DEFAULT_LANG;
    document.documentElement.lang = state.lang;
    try {
      localStorage.setItem(STORAGE_KEY, state.lang);
    } catch (e) {}
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
      const active = b.dataset.langBtn === state.lang;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    if (ready) apply();
    document.dispatchEvent(new CustomEvent("fs:langchange", { detail: { lang: state.lang } }));
  }

  // Traducción bajo demanda para textos generados por JS
  window.fsT = function (text, vars) {
    const map = table();
    let out = (state.lang !== "en" && map[normalize(text)]) || text;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        out = out.split("{" + k + "}").join(vars[k]);
      });
    }
    return out;
  };
  window.fsLang = function () { return state.lang; };
  window.fsSetLang = setLang;

  document.addEventListener("DOMContentLoaded", function () {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    collect();
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.dataset.langBtn); });
    });
    setLang(saved || DEFAULT_LANG);
  });
})();

/* ---------- Tema claro / oscuro ---------- */
(function () {
  "use strict";

  const root = document.documentElement;
  const btn  = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  if (!btn || !icon) return;
  function labels() {
    const isDark = root.classList.contains("dark");
    const text = fsT(isDark ? "Switch to light mode" : "Switch to dark mode");
    btn.setAttribute("aria-pressed", String(isDark));
    btn.setAttribute("aria-label", text);
    btn.setAttribute("title", text);
    icon.textContent = isDark ? "light_mode" : "dark_mode";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#0f1019" : "#faf8ff");
  }

  btn.addEventListener("click", function () {
    root.classList.toggle("dark");
    try {
      localStorage.setItem("fs-theme", root.classList.contains("dark") ? "dark" : "light");
    } catch (e) {}
    labels();
  });

  labels();
  document.addEventListener("fs:langchange", labels);
})();

/* ---------- Copiar snippet de la fuente ---------- */
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("copySnippetBtn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    const textToCopy = '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">';
    navigator.clipboard.writeText(textToCopy).then(function () {
      const original = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span><span>' + fsT("Copied!") + "</span>";
      setTimeout(function () { btn.innerHTML = original; }, 2000);
    });
  });
});

/* ---------- Alto real del header (fixed) para el padding del main ---------- */
(function () {
  "use strict";
  const header = document.querySelector(".app-header");
  if (!header) return;

  function sync() {
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  sync();
  window.addEventListener("resize", sync);
  document.addEventListener("fs:langchange", sync);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
})();
