# Ashford Capital — website

A static, framework-free website (HTML, CSS, vanilla JS). Everything the browser needs is in `site/`. Upload that folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, an ordinary web server).

```
site/               ← the finished, deployable website (open site/index.html)
src/                ← source: pages, partials, CSS, JS, data, fonts
build.mjs           ← build script (Node 18+): src/ → site/
src/visuals.mjs     ← icon, illustration and figure generator (inline SVG)
package.json
```

## Before it goes live: two settings

Open `site/assets/js/config.js` (source: `src/assets/config.js`):

```js
window.ASHFORD_CONFIG = {
  formEndpoint: "",   // e.g. a Formspree / Getform / Basin / your own endpoint URL
  contactEmail: ""    // e.g. "hello@yourdomain.com" — shown on the Contact page when set
};
```

* **`formEndpoint`** — the readiness assessment and the contact form `POST` JSON to this URL
  (`{ type, submittedAt, page, answers | fields }`). Any service that accepts a JSON POST works.
  **While it is empty, the forms still validate and show the result, but they display a visible
  "Form delivery is not connected" notice and nothing is sent.** This is deliberate, so that no
  enquiry is silently lost. Set the endpoint and the notice disappears.
* **`contactEmail`** — left blank on purpose; no contact details were supplied. The line is hidden until set.

## Running locally

Open `site/index.html` directly, or serve the folder:

```
cd site && python3 -m http.server 8000      # then visit http://localhost:8000
```

(Opened straight from disk, browsers may log harmless warnings about font *preload* hints; the fonts still load.)

## Editing and rebuilding

```
npm install      # one-off; installs esbuild (the fonts are already bundled in src/assets/fonts)
npm run build    # or: node build.mjs — regenerates site/
```

* **Page copy:** `src/pages/*.html` (each starts with a `<!--meta … -->` block for title, description and which nav item is current).
* **Header / footer:** `src/partials/`.
* **Styles:** `src/css/*.css` (concatenated in filename order). Colour and type tokens are at the top of `00-base.css`.
* **Behaviour:** `src/js/main.js`.
* **Icons, illustrations, figures:** drawn in `src/visuals.mjs` and placed in pages with build tokens:
  `{{ic:name}}` / `{{ic:name:sm}}` (line icon), `{{art:about|method|pathways|intelligence|begin|contact}}`
  (page-hero illustration) and `{{fig:readers|operators|thinkers|hesitation|conflict|inconsistent|clarity}}`
  (card figure). Styling lives in `src/css/04-visual.css`. To add an icon, add its paths to `ICON_BODIES` in `visuals.mjs`.
  Icon accent colour is `--vi-a`; icons inherit `currentColor` and adapt on crimson sections automatically.
* **Research Library entries:** `src/data/library.json`. Add an object with `title`, `type` (shown as the
  small label, e.g. Concept, Framework), `category` + `categoryLabel` (`market-intelligence` |
  `decision-execution` | `operator-standards`), `topic` + `topicLabel` (`frameworks` | `intelligence` |
  `behaviour` | `labs` | `standards`), `summary`, and `body` (a list of `{ "text": "…" }` paragraphs and
  `{ "items": ["…"] }` bullet lists). Rebuild and the list, search, filters and topic counts update.
* **Home-page demos:** the Trade Autopsy cases are an inline JSON block in `src/pages/index.html`; the Decision Lab and Frameworks demos are plain markup in the same file.

## What to review before launch

* **Legal pages** (`privacy`, `terms`, `risk`, `disclaimer`) are drafts marked "pending legal review".
  The structure document is explicit that a disclaimer alone does not resolve regulatory obligations;
  the wording must reflect Ashford's actual services and applicable rules. The Privacy Policy says no
  advertising cookies are used — update it if you add analytics or ads.
* **Illustrative content.** The worked scenario, Decision Lab, Trade Autopsy, prioritization demo and
  the Research Library entries are written to demonstrate Ashford's reasoning and are labelled as
  illustrative. Replace or extend them with Ashford's own material.
* **Pathway detail** (how each pathway works, progress indicators, readiness criteria) is drawn from the
  brand document; confirm it matches what is actually delivered.
* **Testimonials / case studies** are intentionally absent: the structure document says to add them
  only when genuine, verified evidence exists. No pricing, session times or contact details were invented.

## Accessibility and behaviour notes

* Works without JavaScript for reading (accordions, tabs and the method loop expand in place); the two
  forms require JavaScript and say so.
* Keyboard operable throughout; visible focus rings; `prefers-reduced-motion` respected; hover reveals
  have tap/click equivalents on touch devices; 44px minimum tap targets.
* Automated axe-core audit (WCAG 2.0/2.1 A and AA plus best practices): no violations on any page at
  390px and 1440px.
