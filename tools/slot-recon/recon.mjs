#!/usr/bin/env node
// Slot recon: loads a public game demo in headless Chromium and reports its
// tech stack, asset structure, server protocol shape and spin timings.
// Usage: node tools/slot-recon/recon.mjs <url> [outDir] [--spins=3] [--spin-key=Space]
// Reads only what the browser receives; never copies code or assets into the report.

import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

// createRequire resolves a globally installed Playwright too (ESM import does not use NODE_PATH).
const { chromium } = createRequire(import.meta.url)('playwright');

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--'));
if (!url) {
  console.error('Usage: node tools/slot-recon/recon.mjs <url> [outDir] [--spins=3] [--spin-key=Space]');
  process.exit(1);
}
const outDir = args.filter((a) => !a.startsWith('--'))[1] ?? `recon-out/${new URL(url).hostname}-${Date.now()}`;
const flag = (name, def) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? def;
const spins = Number(flag('spins', 3));
const spinKey = flag('spin-key', 'Space');

const SIGNATURES = {
  PixiJS: /PixiJS|pixi\.js|PIXI\.VERSION|"pixi\.js"/,
  Phaser: /Phaser v\d|Phaser\.Game\b/,
  Cocos: /Cocos Creator|cocos2d|cc\.ENGINE_VERSION/,
  Spine: /esotericsoftware|spine-core|SkeletonJson|SkeletonBinary/,
  Howler: /howler\.js|Howler\b/,
  GSAP: /GreenSock|gsap\.registerPlugin|gsap\.to\(/,
  Svelte: /svelte\/internal|__svelte/,
  React: /react-dom\.production|__REACT_DEVTOOLS/,
  Vue: /__VUE__|vue\.runtime/,
  XState: /xstate/,
  Rive: /@rive-app|rive\.wasm/,
  Lottie: /bodymovin|lottie-web/,
  Unity: /UnityLoader|unityFramework|createUnityInstance/,
  Three: /THREE\.REVISION|three\.module/,
  Babylon: /BABYLON\.Engine/,
  CreateJS: /createjs\.Stage/,
  Particles: /particle-emitter|ParticleContainer/,
};

const PROBE_GLOBALS = () => {
  const g = window;
  return {
    PixiJS: g.PIXI?.VERSION ?? null,
    Phaser: g.Phaser?.VERSION ?? null,
    Cocos: g.cc?.ENGINE_VERSION ?? null,
    Spine: g.spine ? (g.spine.version ?? true) : null,
    Howler: g.Howler ? true : null,
    GSAP: g.gsap?.version ?? null,
    Three: g.THREE?.REVISION ?? null,
    Unity: g.createUnityInstance ? true : null,
    PixiDevtoolsHook: g.__PIXI_APP__ || g.__PIXI_DEVTOOLS__ ? true : null,
    canvases: [...document.querySelectorAll('canvas')].map((c) => ({
      w: c.width,
      h: c.height,
      ctx: c.getContext('webgl2') ? 'webgl2' : c.getContext('webgl') ? 'webgl' : '2d/other',
    })),
  };
};

const kind = (u, ct = '') => {
  const p = u.split('?')[0].toLowerCase();
  if (/\.(skel)$/.test(p) || /spine/.test(p)) return 'spine';
  if (/\.atlas$/.test(p)) return 'atlas';
  if (/\.(mp3|ogg|m4a|webm|wav|aac)$/.test(p) || ct.startsWith('audio/')) return 'audio';
  if (/\.(png|webp|avif|jpg|jpeg|ktx2|basis)$/.test(p) || ct.startsWith('image/')) return 'image';
  if (/\.(js|mjs)$/.test(p) || ct.includes('javascript')) return 'js';
  if (/\.json$/.test(p) || ct.includes('json')) return 'json';
  if (/\.(woff2?|ttf|otf)$/.test(p) || ct.includes('font')) return 'font';
  if (/\.(wasm)$/.test(p)) return 'wasm';
  return 'other';
};

// Keep only the shape of server payloads (keys and value types), never the values.
const shape = (v, depth = 0) => {
  if (depth > 4) return '…';
  if (Array.isArray(v)) return v.length ? [shape(v[0], depth + 1), `len=${v.length}`] : [];
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).slice(0, 40).map(([k, x]) => [k, shape(x, depth + 1)]));
  return typeof v;
};
const tryShape = (text) => {
  try {
    return shape(JSON.parse(text));
  } catch {
    return `non-json (${text.length} chars)`;
  }
};

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: outDir, size: { width: 1280, height: 720 } },
});
const page = await context.newPage();
const t0 = Date.now();
const resources = [];
const api = [];
const sockets = [];
const libsInBundles = {};

page.on('response', async (res) => {
  const req = res.request();
  const u = res.url();
  const ct = res.headers()['content-type'] ?? '';
  let size = Number(res.headers()['content-length'] ?? 0);
  const k = kind(u, ct);
  const entry = { t: Date.now() - t0, url: u, kind: k, status: res.status(), size, method: req.method() };
  resources.push(entry);
  try {
    if (k === 'js') {
      const body = await res.text();
      entry.size = size || body.length;
      for (const [lib, re] of Object.entries(SIGNATURES)) if (re.test(body)) (libsInBundles[lib] ??= []).push(u.split('/').pop().split('?')[0]);
    } else if (['xhr', 'fetch'].includes(req.resourceType()) && k !== 'image' && k !== 'audio') {
      const body = await res.text();
      entry.size = size || body.length;
      api.push({ t: entry.t, method: req.method(), url: u.split('?')[0], status: res.status(), request: req.postData() ? tryShape(req.postData()) : null, response: tryShape(body) });
    } else if (!size) {
      entry.size = (await res.body()).length;
    }
  } catch {
    /* body unavailable (redirect, opaque) */
  }
});

page.on('websocket', (ws) => {
  const s = { url: ws.url(), frames: [] };
  sockets.push(s);
  const add = (dir) => (f) => s.frames.length < 50 && s.frames.push({ t: Date.now() - t0, dir, payload: tryShape(typeof f.payload === 'string' ? f.payload : '') });
  ws.on('framesent', add('out'));
  ws.on('framereceived', add('in'));
});

console.log(`→ ${url}`);
await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 }).catch((e) => console.warn('goto:', e.message));
await page.waitForTimeout(5000);
const loadMs = Date.now() - t0;
await page.screenshot({ path: path.join(outDir, '00-loaded.png') });

// Probe globals in every frame: games usually live in an iframe.
const frames = [];
for (const f of page.frames()) {
  try {
    frames.push({ url: f.url(), globals: await f.evaluate(PROBE_GLOBALS) });
  } catch {
    frames.push({ url: f.url(), globals: 'cross-origin / unavailable' });
  }
}

// Dismiss intro/splash, then spin and sample frames to time the round phases.
// Click the largest canvas in any frame so key presses reach the game's iframe.
let box = null;
for (const f of page.frames()) {
  for (const c of await f.locator('canvas').all().catch(() => [])) {
    const b = await c.boundingBox().catch(() => null);
    if (b && (!box || b.width * b.height > box.width * box.height)) box = b;
  }
}
// Two clicks: the first often lands on a "click to continue" splash, the second focuses the game.
for (let i = 0; i < 2 && box; i++) {
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2).catch(() => {});
  await page.waitForTimeout(2500);
}
const spinLog = [];
for (let i = 1; i <= spins; i++) {
  const before = api.length + sockets.reduce((n, s) => n + s.frames.length, 0);
  const start = Date.now();
  await page.keyboard.press(spinKey);
  for (let k = 0; k < 8; k++) {
    await page.waitForTimeout(750);
    await page.screenshot({ path: path.join(outDir, `spin${i}-${String((k + 1) * 750).padStart(4, '0')}ms.png`) });
  }
  const after = api.length + sockets.reduce((n, s) => n + s.frames.length, 0);
  spinLog.push({ spin: i, serverMessages: after - before, sampledMs: Date.now() - start });
  await page.waitForTimeout(2000);
}

await context.close();
await browser.close();

const byKind = {};
for (const r of resources) {
  byKind[r.kind] ??= { count: 0, bytes: 0 };
  byKind[r.kind].count++;
  byKind[r.kind].bytes += r.size || 0;
}
const hosts = [...new Set(resources.map((r) => new URL(r.url).hostname))];
const report = {
  url,
  date: new Date().toISOString(),
  loadMs,
  frames,
  libsInBundles: Object.fromEntries(Object.entries(libsInBundles).map(([k, v]) => [k, [...new Set(v)]])),
  assets: byKind,
  spineFiles: resources.filter((r) => ['spine', 'atlas'].includes(r.kind)).map((r) => r.url.split('/').pop().split('?')[0]),
  audioFiles: resources.filter((r) => r.kind === 'audio').map((r) => ({ file: r.url.split('/').pop().split('?')[0], kb: Math.round(r.size / 1024) })),
  hosts,
  api,
  sockets,
  spinLog,
};
await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

const mb = (b) => (b / 1048576).toFixed(2);
const md = [
  `# Recon: ${url}`,
  `Loaded in ${(loadMs / 1000).toFixed(1)} s · ${resources.length} requests · ${hosts.length} hosts`,
  `\n## Stack`,
  ...frames.map((f) => `- frame \`${f.url.slice(0, 100)}\`: ${typeof f.globals === 'string' ? f.globals : JSON.stringify(Object.fromEntries(Object.entries(f.globals).filter(([, v]) => v && (!Array.isArray(v) || v.length))))}`),
  `- Libraries found in bundles: ${Object.keys(report.libsInBundles).join(', ') || 'none detected'}`,
  `\n## Assets`,
  '| kind | count | MB |',
  '|---|---|---|',
  ...Object.entries(byKind).map(([k, v]) => `| ${k} | ${v.count} | ${mb(v.bytes)} |`),
  `\nSpine files: ${report.spineFiles.length} · audio files: ${report.audioFiles.length}`,
  `\n## Server protocol (shapes only)`,
  ...api.slice(0, 15).map((a) => `- ${a.method} ${a.url} → ${a.status}\n  - response: \`${JSON.stringify(a.response).slice(0, 400)}\``),
  ...sockets.map((s) => `- WS ${s.url} (${s.frames.length} frames)`),
  `\n## Spins`,
  ...spinLog.map((s) => `- spin ${s.spin}: ${s.serverMessages} server messages; frames sampled every 750 ms`),
].join('\n');
await fs.writeFile(path.join(outDir, 'report.md'), md);
console.log(md);
console.log(`\nSaved to ${outDir}`);
