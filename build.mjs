// Ashford Capital — static site build.
// Zero-framework: composes src/pages with partials + generated components,
// bundles/minifies CSS + JS with esbuild, copies assets to ./site
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';
import { icon as vIcon, art as vArt, figureOf as vFigure } from './src/visuals.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'site');
const SITE_NAME = 'Ashford Capital';

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */
const read = (p) => readFileSync(join(SRC, p), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ICONS = {
  arrow: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M13.2 13.2 17 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  check: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="m4.5 10.5 3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  replay: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10a6 6 0 1 0 2-4.5M4 3.5V7h3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* ------------------------------------------------------------------ */
/* Generated component: hero "alignment field"                         */
/* Fragmented marks (knowledge) resolve into one aligned line          */
/* converging on a single decision node (execution).                   */
/* ------------------------------------------------------------------ */
function heroField() {
  const rnd = mulberry32(2026);
  const W = 600, H = 520;
  const F = { x: 520, y: 260 };
  const cols = 11, rows = 9;
  const marks = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = 44 + i * 44.5;
      const y = 40 + j * 55;
      const dist = Math.hypot(F.x - x, F.y - y);
      if (dist < 58) continue;
      const centre = Math.abs(y - F.y) < 8;
      const a1 = (Math.atan2(F.y - y, F.x - x) * 180) / Math.PI;
      const a0 = (rnd() * 180 - 90) | 0;
      const delay = Math.round(i * 70 + j * 18 + rnd() * 90);
      const accent = !centre && rnd() > 0.9;
      const len = centre ? 47 : 20 + rnd() * 6;
      marks.push({ x, y, a0, a1: Math.round(a1 * 10) / 10, delay, centre, accent, len });
    }
  }
  const lines = marks.map((m) => {
    const cls = `mark${m.centre ? ' mark--core' : ''}${m.accent ? ' mark--accent' : ''}`;
    const x1 = (m.x - m.len / 2).toFixed(1), x2 = (m.x + m.len / 2).toFixed(1);
    return `<line class="${cls}" x1="${x1}" y1="${m.y}" x2="${x2}" y2="${m.y}" style="--a0:${m.a0}deg;--a1:${m.a1}deg;--d:${m.delay}ms;--ox:${m.x}px;--oy:${m.y}px"/>`;
  }).join('');
  return `<div class="field" data-field>
  <svg class="field__svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Scattered marks aligning into a single clear line that ends at one decision point.">
    <g class="field__marks">${lines}</g>
    <g class="field__node">
      <circle class="field__ring field__ring--outer" cx="${F.x}" cy="${F.y}" r="30"/>
      <circle class="field__ring" cx="${F.x}" cy="${F.y}" r="15"/>
      <circle class="field__dot" cx="${F.x}" cy="${F.y}" r="4.5"/>
    </g>
  </svg>
  <span class="field__label field__label--start">Fragmented knowledge</span>
  <span class="field__label field__label--end">One clear decision</span>
  <button class="field__replay" type="button" data-field-replay aria-label="Replay the animation">${ICONS.replay}<span>Replay</span></button>
</div>`;
}

/* ------------------------------------------------------------------ */
/* Generated component: the Ashford Method loop                        */
/* One proprietary framework, reused on Home + Method.                 */
/* ------------------------------------------------------------------ */
const LOOP = [
  {
    title: 'Market Intelligence', verb: 'Interpret',
    def: 'Interpret context and identify what matters.',
    points: ['Context and market structure', 'The few variables that matter now', 'Prioritization of information'],
    scenario: 'An index presses against a multi-week range high, with a policy decision two days out. What matters: rate expectations, breadth, and behaviour at the high. What does not: social-media targets.',
  },
  {
    title: 'Decision Quality', verb: 'Decide',
    def: 'Form a clear thesis, evaluate conditions, and define invalidation.',
    points: ['Thesis, conditions and alternatives', 'Conviction, stated honestly', 'Invalidation defined in advance'],
    scenario: 'Thesis: a close above the range, with broad participation, suggests the range is resolving upwards. Invalidation: a close back inside it. Both are written down before entry.',
  },
  {
    title: 'Execution', verb: 'Execute',
    def: 'Translate the decision into disciplined action under uncertainty.',
    points: ['Rule-based action', 'Risk set before entry', 'A plan for the moment of hesitation'],
    scenario: 'Position size comes from the distance to invalidation and a risk limit set in advance. If hesitation appears, the written plan decides, not the feeling.',
  },
  {
    title: 'Review & Refinement', verb: 'Review',
    def: 'Separate decision quality from outcome and improve the process.',
    points: ['Trade reviews and execution audits', 'Poor decision ≠ unfavourable outcome', 'Lessons feed the next decision'],
    scenario: 'Win or lose, reasoning, execution and outcome are judged separately. A loss from a sound decision is not a mistake to fix.',
  },
];

function loopRing(id, { link = true } = {}) {
  const size = 400, c = 200, r = 142;
  const pt = (deg) => [c + r * Math.cos((deg * Math.PI) / 180), c + r * Math.sin((deg * Math.PI) / 180)];
  const gap = 17; // degrees reserved around each node
  const arcs = LOOP.map((_, k) => {
    const a0 = -90 + 90 * k + gap, a1 = -90 + 90 * (k + 1) - gap;
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    // arrow head at end of arc, tangent direction (clockwise)
    const t = ((a1 + 90) * Math.PI) / 180;
    const ax = x1, ay = y1;
    const hx = (d) => ax + Math.cos(t + d) * -9, hy = (d) => ay + Math.sin(t + d) * -9;
    const head = `M${hx(0.45).toFixed(1)} ${hy(0.45).toFixed(1)} L${ax.toFixed(1)} ${ay.toFixed(1)} L${hx(-0.45).toFixed(1)} ${hy(-0.45).toFixed(1)}`;
    return `<g class="loop__arc" data-arc="${k}"><path class="loop__arc-line" d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}"/><path class="loop__arc-head" d="${head}"/></g>`;
  }).join('');
  const nodes = LOOP.map((_, k) => {
    const [x, y] = pt(-90 + 90 * k);
    return `<button class="loop__node" type="button" tabindex="-1" aria-hidden="true" data-i="${k}" style="--x:${((x / size) * 100).toFixed(2)}%;--y:${((y / size) * 100).toFixed(2)}%"><span>${k + 1}</span></button>`;
  }).join('');
  const items = LOOP.map((it, k) => `
      <div class="acc__item${k === 0 ? ' is-open' : ''}" data-i="${k}">
        <h3 class="acc__head"><button class="acc__btn" type="button" id="${id}-t${k}" aria-expanded="${k === 0}" aria-controls="${id}-p${k}">
          <span class="acc__idx">0${k + 1}</span><span class="acc__title">${esc(it.title)}</span><span class="acc__tag">${esc(it.verb)}</span><span class="acc__icon" aria-hidden="true"></span></button></h3>
        <div class="acc__panel" id="${id}-p${k}" role="region" aria-labelledby="${id}-t${k}"><div class="acc__inner">
          <p class="loop__def">${esc(it.def)}</p>
          <ul class="loop__points">${it.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          <p class="loop__scenario"><span class="loop__scenario-tag">In the worked scenario</span>${esc(it.scenario)}</p>
        </div></div>
      </div>`).join('');
  return `<div class="loop" data-loop data-mode="concept">
  <div class="loop__stage">
    <div class="loop__ring">
      <svg class="loop__svg" viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false">
        <circle class="loop__guide" cx="${c}" cy="${c}" r="${r}"/>${arcs}
      </svg>
      ${nodes}
      <div class="loop__core" aria-hidden="true"><span class="loop__core-kicker">The Ashford Method</span><span class="loop__core-title" data-loop-title>${esc(LOOP[0].title)}</span><span class="loop__core-count" data-loop-count>01 / 04</span></div>
    </div>
    <p class="loop__caption">Four elements, one loop. What is learned in review feeds the next read of the market.</p>
  </div>
  <div class="loop__side">
    <div class="loop__mode" role="group" aria-label="Choose a view">
      <button type="button" data-mode-set="concept" aria-pressed="true">The element</button>
      <button type="button" data-mode-set="scenario" aria-pressed="false">In a worked scenario</button>
    </div>
    <div class="acc acc--loop" data-acc data-acc-single data-acc-hover>${items}
    </div>
    ${link ? `<a class="link-arrow loop__more" href="method.html#applied-example">See the full worked example ${ICONS.arrow}</a>` : ''}
  </div>
</div>`;
}

/* ------------------------------------------------------------------ */
/* Generated component: Research Library (static HTML, JS filters it)  */
/* ------------------------------------------------------------------ */
const LIB_ICON = { Concept: 'context', Framework: 'systems', 'Decision Lab': 'lab', 'Trade Autopsy': 'review', Standard: 'accountability' };

function library() {
  const p = join(SRC, 'data/library.json');
  if (!existsSync(p)) return '';
  const items = JSON.parse(readFileSync(p, 'utf8'));
  return `<ol class="lib__list acc" data-acc data-lib-list>` + items.map((it, k) => {
    const search = esc([it.title, it.summary, it.type, it.topicLabel, it.categoryLabel, ...it.body.map((b) => b.text || (b.items || []).join(' '))].join(' ').toLowerCase());
    const body = it.body.map((b) => {
      if (b.items) return `<ul>${b.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
      return `<p>${esc(b.text)}</p>`;
    }).join('');
    return `<li class="lib__item acc__item" data-category="${esc(it.category)}" data-topic="${esc(it.topic)}" data-search="${search}">
  <h3 class="acc__head"><button class="acc__btn lib__btn" type="button" id="lib-t${k}" aria-expanded="false" aria-controls="lib-p${k}">
    <span class="lib__ico">${vIcon(LIB_ICON[it.type] || 'context')}</span>
    <span class="lib__meta"><span class="lib__type">${esc(it.type)}</span><span class="lib__cat">${esc(it.categoryLabel)}</span></span>
    <span class="lib__title">${esc(it.title)}</span>
    <span class="lib__summary">${esc(it.summary)}</span>
    <span class="acc__icon" aria-hidden="true"></span></button></h3>
  <div class="acc__panel" id="lib-p${k}" role="region" aria-labelledby="lib-t${k}"><div class="acc__inner lib__body">${body}</div></div>
</li>`;
  }).join('') + `</ol>`;
}

/* ------------------------------------------------------------------ */
/* Page assembly                                                       */
/* ------------------------------------------------------------------ */
const partials = {};
for (const f of readdirSync(join(SRC, 'partials'))) partials[f.replace('.html', '')] = read(`partials/${f}`);

function parseMeta(src) {
  const m = src.match(/^<!--meta\n([\s\S]*?)-->\n?/);
  const meta = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return { meta, body: m ? src.slice(m[0].length) : src };
}

function render(tpl, meta) {
  let out = tpl;
  out = out.replace(/\{\{> ([\w-]+)\}\}/g, (_, n) => {
    if (!partials[n]) throw new Error(`Missing partial: ${n}`);
    return partials[n];
  });
  out = out.replace(/\{\{icon:(\w+)\}\}/g, (_, n) => {
    if (!ICONS[n]) throw new Error(`Missing icon: ${n}`);
    return ICONS[n];
  });
  out = out.replace(/\{\{ic:([\w-]+)(?::([\w-]+))?\}\}/g, (_, n, v) => vIcon(n, v ? `vi--${v}` : ''));
  out = out.replace(/\{\{art:([\w-]+)\}\}/g, (_, n) => vArt(n));
  out = out.replace(/\{\{fig:([\w-]+)\}\}/g, (_, n) => vFigure(n));
  out = out.replace(/\{\{loop:([\w-]+)(?::(nolink))?\}\}/g, (_, id, nl) => loopRing(id, { link: !nl }));
  out = out.replace(/\{\{hero-field\}\}/g, heroField());
  out = out.replace(/\{\{library\}\}/g, library());
  out = out.replace(/\{\{year\}\}/g, String(new Date().getFullYear()));
  // mark active nav link
  out = out.replace(/data-nav="([\w-]+)"/g, (m, k) => (k === meta.nav ? `${m} aria-current="page"` : m));
  return out;
}

const FONT_PRELOAD = ['manrope-latin-wght-normal.woff2', 'newsreader-latin-wght-normal.woff2']
  .map((f) => `<link rel="preload" href="assets/fonts/${f}" as="font" type="font/woff2" crossorigin>`).join('\n');

function layout(meta, body) {
  const title = meta.home ? meta.title : `${meta.title} — ${SITE_NAME}`;
  const robots = meta.robots ? `<meta name="robots" content="${meta.robots}">` : '';
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta.description)}">
<meta name="theme-color" content="#680C20">
${robots}
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:type" content="website">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
${FONT_PRELOAD}
<link rel="stylesheet" href="assets/css/main.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body class="${meta.body || ''}">
<a class="skip" href="#main">Skip to content</a>
${body}
<script src="assets/js/config.js" defer></script>
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

function build() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(join(OUT, 'assets/css'), { recursive: true });
  mkdirSync(join(OUT, 'assets/js'), { recursive: true });

  // pages
  const pages = readdirSync(join(SRC, 'pages')).filter((f) => f.endsWith('.html'));
  for (const f of pages) {
    const { meta, body } = parseMeta(read(`pages/${f}`));
    const shell = `{{> header}}\n<main id="main" tabindex="-1">\n${body}\n</main>\n{{> footer}}`;
    writeFileSync(join(OUT, f), layout(meta, render(shell, meta)));
  }

  // css (ordered concat → minify)
  const cssFiles = readdirSync(join(SRC, 'css')).filter((f) => f.endsWith('.css')).sort();
  const css = cssFiles.map((f) => read(`css/${f}`)).join('\n');
  writeFileSync(join(OUT, 'assets/css/main.css'), transformSync(css, { loader: 'css', minify: true }).code);

  // js
  const js = read('js/main.js');
  writeFileSync(join(OUT, 'assets/js/main.js'), transformSync(js, { minify: true, target: 'es2019' }).code);

  // assets
  cpSync(join(SRC, 'assets/fonts'), join(OUT, 'assets/fonts'), { recursive: true });
  cpSync(join(SRC, 'assets/favicon.svg'), join(OUT, 'favicon.svg'));
  if (existsSync(join(SRC, 'assets/config.js'))) cpSync(join(SRC, 'assets/config.js'), join(OUT, 'assets/js/config.js'));

  console.log(`Built ${pages.length} pages → site/`);
}

build();
