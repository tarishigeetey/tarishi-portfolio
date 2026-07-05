# Tarishi Geetey — Portfolio

A fast, accessible portfolio for a Data + AI Engineer, with an interactive
**portfolio bot** that answers recruiter questions — offline out of the box, or
backed by a real LLM when you add a free API key.

No framework, no bundler. Content is cleanly separated from presentation, the
render layer is unit-tested, and CI runs formatting + tests on every push. It's
deliberately small — but structured like a real project, because the repo itself
is a work sample.

**Live:** _add your Vercel URL here after deploying_

---

## Highlights

- **Interactive portfolio bot** — visitors ask about projects, skills, and fit.
  Works instantly in offline mode (keyword-matched canned answers); upgrades to a
  real LLM via a serverless function that keeps your API key server-side.
- **Light / dark theme** — respects the visitor's OS preference, remembers their
  choice, no flash on load.
- **Content-as-data** — everything shown on the page lives in one typed config
  object. Edit content without touching markup.
- **Tested + CI** — the bot's answer logic has unit tests; GitHub Actions runs
  format-check, tests, and build on every push.
- **Zero runtime dependencies** — plain ES modules and CSS. Loads fast, ages well.

## Tech

Vanilla ES modules · CSS custom properties · Node test runner · Prettier ·
GitHub Actions · Vercel (static hosting + serverless function) · Groq (free LLM).

---

## Project structure

```
.
├── api/
│   └── chat.js                 # serverless bot backend (hides the API key)
├── public/
│   ├── index.html              # page markup (structure only)
│   └── assets/
│       └── avatar.png          # profile image → logo, bot face, favicon
├── src/
│   ├── config/
│   │   └── portfolio.config.js # ← ALL content lives here (edit this)
│   ├── styles/
│   │   └── main.css            # theme tokens + component styles
│   ├── theme-init.js           # sets theme before paint (no flash)
│   ├── render.js               # reads config, paints DOM, wires the bot
│   └── render.test.js          # unit tests for the bot logic
├── scripts/
│   ├── build.mjs               # copies src/ modules into public/
│   └── serve.mjs               # tiny local dev server
├── .github/workflows/ci.yml    # format-check + test + build on push/PR
├── vercel.json                 # build command + clean URLs
├── package.json
└── .env.example
```

Source lives in `src/`; the deployable output is `public/`. The build step copies
the JS/CSS modules into `public/` so the browser can load them with relative
imports. `public/index.html` and `public/assets/` are authored directly.

---

## Quick start

```bash
npm install        # installs Prettier (only dev dependency)
npm run build      # assemble public/
npm run dev        # build + serve at http://localhost:3000
npm test           # run the unit tests
npm run format     # format all source files
```

No Node? You can still preview by opening `public/index.html` after a build —
but the dev server is one command and avoids browser module/CORS quirks.

---

## Editing your content

Open `src/config/portfolio.config.js`. It's the single source of truth:

- **Identity** — `name`, `role`, `heroTitleHTML`, `lede`, `status`, `avatar`
- **Links** — `email`, `github`, `linkedin`, optional `resumeUrl`
- **Projects** — `projects[]`, each with `status: "feature" | "live" | "soon"`,
  title, one-line role, description, `stack[]`, and `repo` / `demo` URLs
- **Skills** — `skills[]` (each with a one-line proof) and `skillTags[]`
- **Bot** — `botIntro`, `cannedChips[]` (question + answer), `fallbackAnswer`

Change the avatar by replacing `public/assets/avatar.png`.

> When your three in-progress projects ship, replace the `"soon"` entries and
> demote or remove Muzik / Lexa — it's one array edit.

---

## The portfolio bot

**Offline (default).** With `botEndpoint: ""`, the bot answers from `cannedChips`
using keyword matching (see `localAnswer` in `render.js`, covered by tests). No
API key, no cost. Ship like this if you want.

**Live (free).** Point it at the serverless function for real LLM answers:

1. Get a free Groq key — no credit card — at <https://console.groq.com/keys>.
2. In Vercel → Project → Settings → Environment Variables, add
   `GROQ_API_KEY = gsk_...`.
3. Set `botEndpoint: "/api/chat"` in `src/config/portfolio.config.js`.
4. Redeploy.

The browser never sees the key — it calls `/api/chat`, which calls the LLM
server-side. Groq's free limits (~30 req/min, ~14,400 req/day) are far beyond
what a portfolio needs. Prefer Google Gemini? See the note at the bottom of
`api/chat.js` and use `GEMINI_API_KEY` instead.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. <https://vercel.com> → New Project → import the repo → Deploy.
   Vercel runs `npm run build`, serves `public/`, and deploys `api/chat.js` as a
   function automatically.
3. (Optional) Add `GROQ_API_KEY` and flip `botEndpoint` to turn the live bot on.

Hosting and the bot are both free.

---

## License

MIT — see [LICENSE](./LICENSE).
