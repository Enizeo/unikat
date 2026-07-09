#!/usr/bin/env node
/**
 * visual-review.mjs — stage-7 visual harness.
 *
 * Renders the running site across the Core-3 device matrix, captures full-page
 * and above-the-fold screenshots per route, and runs DOM probes that catch the
 * defects the code/copy review (stage 6) is blind to: horizontal overflow,
 * off-canvas/clipped elements, text collisions, broken images, and crop-risk
 * photos (the off-center-portrait class).
 *
 * The script only REPORTS. It writes screenshots + findings.json and prints a
 * summary; the /visual-review command does the vision judgement and the fixes.
 *
 * Usage:
 *   node scripts/visual-review.mjs [--base-url http://localhost:3000]
 *                                  [--routes /,/ausbildung,...]   (else auto-discovered)
 *                                  [--out ai/_generated/visual-review]
 *
 * Assumes the site is already served at --base-url (the command runs
 * `npm run build && npm run start` first).
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';

// ---- args -------------------------------------------------------------------
const argv = process.argv.slice(2);
function arg(name, fallback) {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
}
const BASE_URL = arg('base-url', 'http://localhost:3000').replace(/\/$/, '');
const OUT_DIR = arg('out', 'ai/_generated/visual-review');
const ROUTES_ARG = arg('routes', '');

// The Core-3 matrix. Mobile is retina (deviceScaleFactor 2) for honest text
// crispness; tablet/desktop stay at 1 to keep full-page PNGs Read-friendly.
const VIEWPORTS = [
  { device: 'mobile', width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { device: 'tablet', width: 768, height: 1024, deviceScaleFactor: 1, isMobile: false, hasTouch: true },
  { device: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
];

// ---- route discovery (Next app router) --------------------------------------
function discoverRoutes() {
  const appDir = existsSync('app') ? 'app' : existsSync('src/app') ? 'src/app' : null;
  if (!appDir) return ['/'];
  const routes = new Set();
  const walk = (dir) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      if (ent.isFile() && /^page\.(t|j)sx?$/.test(ent.name)) {
        const segs = relative(appDir, dir)
          .split('/')
          .filter(Boolean)
          .filter((s) => !(s.startsWith('(') && s.endsWith(')'))); // drop route groups
        // skip private (_x), dynamic ([x]), and the internal design-system page
        if (segs.some((s) => s.startsWith('_') || s.startsWith('[') || s === 'design-system')) continue;
        routes.add('/' + segs.join('/'));
      }
      if (ent.isDirectory() && ent.name !== 'node_modules') walk(join(dir, ent.name));
    }
  };
  walk(appDir);
  const list = [...routes];
  // root first, then alphabetical — stable, readable output order
  return list.sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
}

const ROUTES = ROUTES_ARG ? ROUTES_ARG.split(',').map((r) => r.trim()).filter(Boolean) : discoverRoutes();
const slug = (route) => (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-'));

// ---- the in-page probe (runs in the browser) --------------------------------
/* eslint-disable */
function PROBE() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const cssPath = (el) => {
    if (!el || el === document.body) return 'body';
    const parts = [];
    let cur = el;
    let depth = 0;
    while (cur && cur.nodeType === 1 && cur !== document.body && depth < 4) {
      let s = cur.tagName.toLowerCase();
      if (cur.id) { s += '#' + cur.id; parts.unshift(s); break; }
      const cls = (cur.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
      if (cls.length) s += '.' + cls.join('.');
      const sibs = cur.parentElement ? [...cur.parentElement.children].filter((c) => c.tagName === cur.tagName) : [];
      if (sibs.length > 1) s += `:nth-of-type(${sibs.indexOf(cur) + 1})`;
      parts.unshift(s);
      cur = cur.parentElement;
      depth++;
    }
    return parts.join(' > ');
  };

  const visible = (el, r) => {
    if (r.width <= 1 || r.height <= 1) return false;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none' || +st.opacity <= 0.01) return false;
    // checkVisibility() also rejects content hidden by a closed <details>,
    // content-visibility, or an opacity:0 ancestor — kills accordion false-positives.
    if (typeof el.checkVisibility === 'function') {
      return el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true });
    }
    return true;
  };

  const all = [...document.querySelectorAll('*')];

  // (1) horizontal overflow — the #1 mobile defect
  const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const overflowOffenders = [];
  // (2) off-canvas / clipped — same pass
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (!visible(el, r)) continue;
    const pastRight = r.right - vw;
    const pastLeft = -r.left;
    if (pastRight > 2 || pastLeft > 2) {
      overflowOffenders.push({
        selector: cssPath(el),
        past: Math.round(Math.max(pastRight, pastLeft)),
        side: pastRight >= pastLeft ? 'right' : 'left',
        width: Math.round(r.width),
        text: (el.textContent || '').trim().slice(0, 40),
      });
    }
  }
  overflowOffenders.sort((a, b) => b.past - a.past);

  // (3) text clipping — element clips its own content (overflow hidden eating text)
  const textClipping = [];
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (!visible(el, r)) continue;
    const st = getComputedStyle(el);
    const clipsX = el.scrollWidth - el.clientWidth > 2 && st.overflowX !== 'visible' && st.overflowX !== 'auto' && st.overflowX !== 'scroll';
    const clipsY = el.scrollHeight - el.clientHeight > 4 && (st.overflowY === 'hidden') && el.textContent.trim().length > 0;
    if ((clipsX || clipsY) && el.textContent.trim().length > 1) {
      textClipping.push({ selector: cssPath(el), axis: clipsX ? 'x' : 'y', text: el.textContent.trim().slice(0, 50) });
    }
  }

  // (4) collision — text blocks whose boxes overlap (text-over-text / text-over-element)
  const TEXTY = 'h1,h2,h3,h4,h5,h6,p,a,button,li,blockquote,span';
  const blocks = [...document.querySelectorAll(TEXTY)]
    .filter((el) => {
      const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!direct) return false;
      const r = el.getBoundingClientRect();
      return visible(el, r) && r.width * r.height > 80;
    })
    .slice(0, 400);
  const rects = blocks.map((el) => el.getBoundingClientRect());
  const collisions = [];
  for (let i = 0; i < blocks.length && collisions.length < 12; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      if (blocks[i].contains(blocks[j]) || blocks[j].contains(blocks[i])) continue;
      const a = rects[i], b = rects[j];
      const ix = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const iy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      const area = ix * iy;
      const minArea = Math.min(a.width * a.height, b.width * b.height);
      if (area > 0.30 * minArea) {
        collisions.push({ a: cssPath(blocks[i]), b: cssPath(blocks[j]), overlapPct: Math.round((area / minArea) * 100) });
        break;
      }
    }
  }

  // (5) broken images + (6) crop-risk (object-fit cover, default focal point, actually cropping)
  const brokenImages = [];
  const cropRiskImages = [];
  for (const img of document.querySelectorAll('img')) {
    const r = img.getBoundingClientRect();
    if (img.complete && img.naturalWidth === 0) {
      brokenImages.push({ selector: cssPath(img), src: (img.currentSrc || img.src || '').split('/').pop() });
      continue;
    }
    if (!visible(img, r) || !img.naturalWidth) continue;
    const st = getComputedStyle(img);
    if (st.objectFit === 'cover') {
      const boxAR = r.width / r.height;
      const natAR = img.naturalWidth / img.naturalHeight;
      const cropAmount = Math.abs(boxAR - natAR) / natAR; // how much the frame differs from the source
      const centered = /^(50%|center)\s+(50%|center)$/.test(st.objectPosition.trim()) || st.objectPosition.trim() === '50% 50%';
      if (cropAmount > 0.15 && centered) {
        cropRiskImages.push({
          selector: cssPath(img),
          src: (img.currentSrc || img.src || '').split('/').pop(),
          objectPosition: st.objectPosition,
          renderedAspect: +boxAR.toFixed(2),
          sourceAspect: +natAR.toFixed(2),
          note: 'object-fit:cover with default focal point on a cropped frame — verify the subject is not cut off',
        });
      }
    }
  }

  return {
    horizontalOverflow: {
      overflow: docWidth > vw + 1,
      docWidth: Math.round(docWidth),
      viewportWidth: vw,
      offenders: overflowOffenders.slice(0, 12),
    },
    pageHeight: Math.round(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)),
    textClipping: textClipping.slice(0, 10),
    collisions,
    brokenImages,
    cropRiskImages: cropRiskImages.slice(0, 10),
  };
}
/* eslint-enable */

// ---- settle helper: scroll through to trigger lazy media, then return to top -
async function settle(page) {
  try {
    await page.evaluate(async () => {
      await (document.fonts ? document.fonts.ready : Promise.resolve());
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += Math.round(window.innerHeight * 0.8)) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 250));
    });
  } catch {
    /* best effort */
  }
}

// ---- main -------------------------------------------------------------------
async function main() {
  if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const results = [];
  let totalShots = 0;
  let hardFlags = 0;
  let reviewCandidates = 0;

  console.log(`visual-review · ${BASE_URL}`);
  console.log(`routes: ${ROUTES.join(', ')}`);
  console.log(`devices: ${VIEWPORTS.map((v) => `${v.device} ${v.width}x${v.height}`).join(' · ')}\n`);

  for (const route of ROUTES) {
    const routeDir = join(OUT_DIR, slug(route));
    mkdirSync(routeDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.deviceScaleFactor,
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch,
      });
      const page = await ctx.newPage();
      const url = `${BASE_URL}${route}`;
      const record = { route, device: vp.device, viewport: `${vp.width}x${vp.height}`, url };

      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() =>
          page.goto(url, { waitUntil: 'load', timeout: 30000 }),
        );
        record.status = resp ? resp.status() : null;
        await settle(page);

        const foldPath = join(routeDir, `${vp.device}.fold.png`);
        const fullPath = join(routeDir, `${vp.device}.full.png`);
        await page.screenshot({ path: foldPath });
        await page.screenshot({ path: fullPath, fullPage: true });
        record.screenshots = { fold: relative(OUT_DIR, foldPath), full: relative(OUT_DIR, fullPath) };
        totalShots += 2;

        const probes = await page.evaluate(PROBE);
        record.probes = probes;

        const hard =
          (probes.horizontalOverflow.overflow ? 1 : 0) +
          probes.brokenImages.length +
          probes.collisions.length +
          probes.textClipping.length;
        record.hardFlags = hard;
        record.reviewCandidates = probes.cropRiskImages.length;
        hardFlags += hard;
        reviewCandidates += probes.cropRiskImages.length;

        const tag = hard ? `⚠ ${hard} hard` : '✓';
        const cr = probes.cropRiskImages.length ? ` · ${probes.cropRiskImages.length} crop-risk` : '';
        console.log(`  ${route} · ${vp.device}  [${record.status}]  ${tag}${cr}`);
      } catch (err) {
        record.error = String(err && err.message ? err.message : err);
        console.log(`  ${route} · ${vp.device}  ERROR  ${record.error}`);
      } finally {
        await ctx.close();
      }
      results.push(record);
    }
  }

  await browser.close();

  const findings = {
    baseUrl: BASE_URL,
    note: 'Automated probes only — the cannot-fudge layer. The vision pass (the /visual-review command) judges framing, spacing, and polish against ai/review/visual-rubric.md.',
    devices: VIEWPORTS.map((v) => ({ device: v.device, viewport: `${v.width}x${v.height}`, dpr: v.deviceScaleFactor })),
    routes: ROUTES,
    summary: { totalShots, routeCount: ROUTES.length, deviceCount: VIEWPORTS.length, hardFlags, reviewCandidates },
    results,
  };
  writeFileSync(join(OUT_DIR, 'findings.json'), JSON.stringify(findings, null, 2));

  console.log(
    `\n${totalShots} screenshots · ${hardFlags} hard auto-flags · ${reviewCandidates} crop-risk review candidates`,
  );
  console.log(`→ ${join(OUT_DIR, 'findings.json')}`);
  console.log('Next: open each screenshot and judge against ai/review/visual-rubric.md.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
