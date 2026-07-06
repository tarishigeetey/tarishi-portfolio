/**
 * Render layer.
 * Reads the content config and paints the DOM. No content lives here —
 * only the logic that turns config into markup and wires interactivity.
 */
import { config as CONFIG } from "./config/portfolio.config.js";

const $ = (s, r = document) => r.querySelector(s);
const el = (t, c) => {
  const e = document.createElement(t);
  if (c) e.className = c;
  return e;
};

const ICONS = {
  email: '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
  github:
    '<path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.3 3.3 5.3 3.6 5.3 3.6a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 10c0 4.5 2.7 5.6 5.5 6-.6.6-.6 1.2-.5 2V22"/>',
  linkedin:
    '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 11v5M8 8v0M12 16v-3a2 2 0 0 1 4 0v3"/>',
  resume: '<path d="M6 3h9l5 5v13H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  code: '<path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.3 3.3 5.3 3.6 5.3 3.6a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 10c0 4.5 2.7 5.6 5.5 6-.6.6-.6 1.2-.5 2V22"/>',
  demo: '<path d="M7 17 17 7M9 7h8v8"/>',
};

/** Head + hero + brand text. */
function renderIdentity() {
  document.title = CONFIG.tabTitle || CONFIG.name;
  $("#brand-name").textContent = CONFIG.name;
  if (CONFIG.avatar) {
    const ba = $("#brand-avatar");
    ba.src = CONFIG.avatar;
    ba.alt = CONFIG.name;
    ba.style.display = "block";
  }
  $("#hero-eyebrow").innerHTML = "<span></span>" + CONFIG.role;
  $("#hero-title").innerHTML = CONFIG.heroTitleHTML;
  $("#hero-lede").textContent = CONFIG.lede;
  $("#hero-status").textContent = CONFIG.status;
  $("#foot-line").textContent = CONFIG.footLine;
  $("#copyright").textContent = `© ${new Date().getFullYear()} ${CONFIG.name} · built by hand`;

  // Bot avatar: robot icon, custom image, or initials monogram.
  const botAv = $("#bot-initials");
  if (CONFIG.botAvatar === "robot") {
    botAv.textContent = "";
    botAv.innerHTML =
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="4" y="8" width="16" height="12" rx="2"/>' +
      '<path d="M12 8V4M9 4h6"/>' +
      '<circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/>' +
      '<path d="M9 17h6M2 12v3M22 12v3"/>' +
      "</svg>";
  } else if (CONFIG.botAvatar) {
    botAv.textContent = "";
    botAv.style.padding = "0";
    botAv.innerHTML = `<img src="${CONFIG.botAvatar}" alt="Portfolio bot" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" />`;
  } else {
    botAv.textContent = CONFIG.initials;
  }
}

function renderAbout() {
  const modal = $("#about-modal");
  if (!modal || !CONFIG.about) return;

  // Populate modal content
  const paras = (CONFIG.about.paragraphs || []).map((p) => `<p>${p}</p>`).join("");
  $("#about-modal-body").innerHTML = paras;
  $("#about-modal-name").textContent = CONFIG.name;
  $("#about-modal-role").textContent = CONFIG.role;

  const photo = $("#about-modal-photo");
  if (CONFIG.avatar) {
    photo.src = CONFIG.avatar;
    photo.alt = CONFIG.name;
  } else {
    photo.style.display = "none";
  }

  // Contact links inside the modal
  const linksWrap = $("#about-modal-links");
  const link = (href, key, label) => {
    if (!href) return;
    const url = key === "email" ? "mailto:" + href : href;
    const ext = /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "";
    return `<a href="${url}"${ext}><svg class="ic" viewBox="0 0 24 24">${ICONS[key]}</svg>${label}</a>`;
  };
  linksWrap.innerHTML = [
    link(CONFIG.email, "email", "Email"),
    link(CONFIG.github, "github", "GitHub"),
    link(CONFIG.linkedin, "linkedin", "LinkedIn"),
  ]
    .filter(Boolean)
    .join("");

  // Move the modal to be a direct child of <body> so no parent's stacking
  // context or overflow can trap it — guarantees it overlays the whole page.
  if (modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }

  // Open / close wiring
  const openModal = (e) => {
    if (e) e.preventDefault();

    modal.hidden = false;
    modal.classList.add("open");

    document.body.style.overflow = "hidden";

    $("#about-close").focus();
};

const closeModal = () => {
    modal.classList.remove("open");

    modal.hidden = true;

    document.body.style.overflow = "";
};

  $("#nav-brand").addEventListener("click", openModal);
  $("#about-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
}

function renderFooterLinks() {
  const wrap = $("#foot-links");
  const add = (href, key, label) => {
    if (!href) return;
    const a = el("a");
    a.href = key === "email" ? "mailto:" + href : href;
    a.setAttribute("aria-label", label);
    a.innerHTML = `<svg class="ic" viewBox="0 0 24 24">${ICONS[key]}</svg>`;
    if (/^https?:/.test(a.href)) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    wrap.appendChild(a);
  };
  add(CONFIG.email, "email", "Email");
  add(CONFIG.github, "github", "GitHub");
  add(CONFIG.linkedin, "linkedin", "LinkedIn");
  add(CONFIG.resumeUrl, "resume", "Resume");
}

function renderProjects() {
  const grid = $("#proj-grid");
  CONFIG.projects.forEach((p) => {
    const soon = p.status === "soon";
    const card = el(
      "div",
      "proj reveal" + (p.status === "feature" ? " feature" : "") + (soon ? " placeholder" : "")
    );
    let tag = "";
    if (p.status === "feature") tag = '<div class="proj-tag">Headline project</div>';
    else if (soon) tag = '<div class="proj-tag soon">Coming soon</div>';

    const links = [];
    if (p.repo)
      links.push(
        `<a href="${p.repo}" target="_blank" rel="noopener"><svg class="ic" viewBox="0 0 24 24">${ICONS.code}</svg>Code</a>`
      );
    if (p.demo)
      links.push(
        `<a href="${p.demo}" target="_blank" rel="noopener"><svg class="ic" viewBox="0 0 24 24">${ICONS.demo}</svg>Live demo</a>`
      );

    card.innerHTML =
      tag +
      `<h3>${p.title}</h3>` +
      (p.role ? `<div class="role">${p.role}</div>` : "") +
      `<p>${p.desc}</p>` +
      `<div class="stack">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div>` +
      (links.length ? `<div class="proj-links">${links.join("")}</div>` : "");
    grid.appendChild(card);
  });
}

function renderSkills() {
  const rows = $("#skill-rows");
  CONFIG.skills.forEach((s) => {
    const d = el("div", "skill reveal");
    d.innerHTML = `<div class="k">${s.k}</div><div><div class="b">${s.b}</div><div class="n">${s.n}</div></div>`;
    rows.appendChild(d);
  });
  const tags = $("#skill-tags");
  CONFIG.skillTags.forEach((t) => {
    const s = el("span");
    s.textContent = t;
    tags.appendChild(s);
  });
}

/**
 * Common words that carry no topic signal. Filtered out before matching so
 * a query like "what is your favorite pizza" doesn't spuriously match an
 * answer just because it contains "your" or "what".
 */
const STOPWORDS = new Set([
  "what",
  "when",
  "where",
  "which",
  "your",
  "you",
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "have",
  "has",
  "are",
  "was",
  "were",
  "can",
  "could",
  "would",
  "should",
  "about",
  "tell",
  "does",
  "did",
  "how",
  "why",
  "who",
  "from",
  "into",
  "they",
  "them",
  "their",
  "she",
  "her",
  "his",
  "him",
  "its",
  "our",
  "any",
  "all",
  "some",
  "more",
]);

const keywords = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));

/**
 * Offline answer resolver for the portfolio bot. Exported for unit testing.
 * 1) exact chip-question match (case-insensitive)
 * 2) otherwise, the chip whose answer shares the most meaningful keywords,
 *    requiring at least one overlap; ties keep the earliest chip.
 * 3) otherwise, the fallback answer.
 */
export function localAnswer(q) {
  const query = (q || "").trim();
  if (!query) return CONFIG.fallbackAnswer;

  const hit = CONFIG.cannedChips.find((c) => c.q.toLowerCase() === query.toLowerCase());
  if (hit) return hit.a;

  const qWords = new Set(keywords(query));
  if (qWords.size === 0) return CONFIG.fallbackAnswer;

  let best = null;
  let bestScore = 0;
  for (const c of CONFIG.cannedChips) {
    const haystack = new Set(keywords(c.q + " " + c.a));
    let score = 0;
    for (const w of qWords) if (haystack.has(w)) score++;
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return bestScore > 0 && best ? best.a : CONFIG.fallbackAnswer;
}

function renderBot() {
  const log = $("#bot-log");
  const field = $("#bot-field");
  const send = $("#bot-send");
  const chips = $("#bot-chips");
  const live = !!CONFIG.botEndpoint;
  $("#bot-mode").textContent = live
    ? "● live — answered by an LLM"
    : "○ offline demo — quick answers, no API needed yet";
  const history = [];

  const bubble = (text, who) => {
    const m = el("div", "msg " + who);
    m.textContent = text;
    log.appendChild(m);
    m.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return m;
  };

  bubble(CONFIG.botIntro, "bot");
  CONFIG.cannedChips.forEach((c) => {
    const b = el("div", "chip");
    b.textContent = c.q;
    b.onclick = () => ask(c.q);
    chips.appendChild(b);
  });

  async function ask(q) {
    q = (q || "").trim();
    if (!q) return;
    bubble(q, "me");
    field.value = "";
    history.push({ role: "user", content: q });

    if (!live) {
      const t = bubble("typing…", "bot typing");
      setTimeout(() => {
        t.classList.remove("typing");
        t.textContent = localAnswer(q);
      }, 420);
      return;
    }

    const t = bubble("typing…", "bot typing");
    try {
      const r = await fetch(CONFIG.botEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const data = await r.json();
      const answer = data.reply || localAnswer(q);
      t.classList.remove("typing");
      t.textContent = answer;
      history.push({ role: "assistant", content: answer });
    } catch {
      t.classList.remove("typing");
      t.textContent = localAnswer(q);
    }
  }

  send.onclick = () => ask(field.value);
  field.addEventListener("keydown", (e) => {
    if (e.key === "Enter") ask(field.value);
  });
}

function wireChrome() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

  const bar = $("#topbar");
  addEventListener("scroll", () => bar.classList.toggle("scrolled", scrollY > 20), {
    passive: true,
  });

  const btn = $("#theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      document.cookie = `theme=${next};path=/;max-age=31536000;samesite=lax`;
    });
  }
}

/** Entry point — call once on DOMContentLoaded. */
export function mount() {
  renderIdentity();
  renderAbout();
  renderFooterLinks();
  renderProjects();
  renderSkills();
  renderBot();
  wireChrome();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
}