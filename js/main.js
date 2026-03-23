/* ═══════════════════════════════════════════════
   NutriFacts v2 — main.js  (shared utilities)
   ═══════════════════════════════════════════════ */

/* ── NAV inject ─────────────────────────────────── */
function injectNavbar(activePage) {
  const links = [
    { href: "index.html", label: "Home" },
    { href: "scan.html", label: "📷 Scan" },
    { href: "harmful-list.html", label: "Harmful List" },
    { href: "health-alerts.html", label: "Alerts" },
    { href: "alternatives.html", label: "Alternatives" },
    { href: "ai-diet.html", label: "AI & Kids" },
  ];

  const linksHtml = links
    .map(
      (l) =>
        `<a href="${l.href}" class="nav-link${l.href === activePage ? " active" : ""}">${l.label}</a>`,
    )
    .join("");

  const nav = document.createElement("nav");
  nav.className = "navbar";
  nav.innerHTML = `
    <a href="index.html" class="nav-logo">
      <div class="nav-logo-mark">🥦</div>
      <span class="nav-logo-text">Nutri<em>Facts</em></span>
    </a>
    <div class="nav-links" id="navLinks">${linksHtml}</div>
    <a href="scan.html" class="nav-scan-btn">Scan Food →</a>
    <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="navLinks">
      <span></span><span></span><span></span>
    </button>
  `;
  document.body.prepend(nav);

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const closeMenu = () => {
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  };

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeMenu();
  });
}

/* ── FOOTER inject ──────────────────────────────── */
function injectFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo-text">Nutri<em>Facts</em></div>
        <p>AI-powered packaged food scanner & harmful ingredient detector. Know exactly what you're eating.</p>
      </div>
      <nav class="footer-nav">
        <a href="index.html">Home</a>
        <a href="scan.html">Scan Food</a>
        <a href="harmful-list.html">Harmful List</a>
        <a href="health-alerts.html">Alerts</a>
        <a href="alternatives.html">Alternatives</a>
        <a href="ai-diet.html">AI Diet</a>
      </nav>
    </div>
    <div class="footer-bottom">
      ⚠️ For educational purposes only · Not a substitute for medical advice ·
      NutriFacts — Full Stack Development I, College Project
    </div>
  `;
  document.body.appendChild(footer);
}

/* ── TOAST ──────────────────────────────────────── */
function showToast(msg, type = "success") {
  document.querySelector(".toast")?.remove();
  const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || "✅"}</span> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity .4s";
    setTimeout(() => t.remove(), 400);
  }, 3500);
}

/* ── COUNT-UP ───────────────────────────────────── */
function animateCount(el, target, dur = 1600) {
  const step = target / (dur / 16);
  let cur = 0;
  const id = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.round(cur);
    if (cur >= target) clearInterval(id);
  }, 16);
}

/* ── SCORE HELPERS ──────────────────────────────── */
function scoreLevel(score) {
  return score >= 70 ? "safe" : score >= 40 ? "moderate" : "risky";
}
function scoreLabel(score) {
  return score >= 70
    ? "✅ Safe"
    : score >= 40
      ? "⚠️ Moderate Risk"
      : "❌ High Risk";
}
function scoreBadgeClass(score) {
  return score >= 70
    ? "badge-safe"
    : score >= 40
      ? "badge-warn"
      : "badge-danger";
}

/* ── SAFETY HELPERS ────────────────────────────── */
function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ── localStorage ───────────────────────────────── */
function saveResult(d) {
  localStorage.setItem("nf_result", JSON.stringify(d));
}
function loadResult() {
  try {
    return JSON.parse(localStorage.getItem("nf_result")) || null;
  } catch {
    return null;
  }
}

/* ── DEMO DATA ──────────────────────────────────── */
const demoProducts = {
  oreo: {
    name: "Oreo Cookies",
    ingredients:
      "Sugar, Enriched Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Palm and/or Canola Oil, Cocoa (Processed with Alkali), High Fructose Corn Syrup, Leavening (Baking Soda and/or Calcium Phosphate), Salt, Soy Lecithin (Emulsifier), Vanillin - An Artificial Flavor, Chocolate",
  },
  lays: {
    name: "Lay's Classic Chips",
    ingredients:
      "Potatoes, Vegetable Oil (Sunflower, Corn, and/or Canola Oil), Salt, Dextrose, Sodium Diacetate, Monosodium Glutamate (MSG), Artificial Flavor, Yeast Extract",
  },
  nutella: {
    name: "Nutella Hazelnut Spread",
    ingredients:
      "Sugar, Palm Oil, Hazelnuts (13%), Skim Milk Powder (8.7%), Fat-Reduced Cocoa (7.4%), Lecithin as Emulsifier (Soy), Vanillin: an Artificial Flavor",
  },
  yogurt: {
    name: "Strawberry Flavored Yogurt",
    ingredients:
      "Cultured Pasteurized Grade A Nonfat Milk, Sugar, Water, Modified Cornstarch, Natural Flavor, Carmine (for color), Potassium Sorbate, Malic Acid, Aspartame, Acesulfame Potassium, Vitamin D3",
  },
};

/* ── SCROLL REVEAL ──────────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}
document.addEventListener("DOMContentLoaded", () => setTimeout(initReveal, 80));
