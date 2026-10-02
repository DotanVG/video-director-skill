// video-director kit: generate a HyperFrames edit (scene sub-compositions per aspect + thin version roots)
// from plain JavaScript data. Import it from your project's build.mjs (see build.example.mjs).
//
// Layout written by writeProject():
//   compositions/<aspectDir>/<sceneId>.html   one sub-composition per scene and aspect
//   versions/<version>-<aspectDir>.html        thin roots: scene hosts + that version's audio
//   index.html                                 copy of the first version/aspect (preview + check target)
//   work/audio-plan.json                       mix plan for scripts/simmix.py
import fs from "node:fs";

export const ASPECTS = {
  L: { W: 1920, H: 1080, dir: "16x9" },
  P: { W: 1080, H: 1920, dir: "9x16" },
  S: { W: 1080, H: 1080, dir: "1x1" },
  F: { W: 1080, H: 1350, dir: "4x5" },
};

// ---------- configuration ----------
export const CFG = {
  ink: "#07040c", // background
  text: "#f4ecd8", // main text color
  accent: "#ff2d4a", // one accent color
  display: { family: "Display", file: "fonts/Display.woff2" },
  body: { family: "Body", regular: "fonts/Body-400.woff2", bold: "fonts/Body-700.woff2" },
  gsap: "assets/vendor/gsap.min.js",
  // canonical media-use treatment payload for all footage (null to disable)
  grade: {
    intensity: 0.85,
    adjust: { contrast: 0.16, blacks: -0.12, shadows: -0.04, highlights: -0.05, vibrance: 0.14, saturation: 0.04 },
    details: { vignette: 0.24, vignetteFeather: 0.7 },
  },
  sourceW: 1920, // footage frame size the camera math assumes
  sourceH: 1080,
  fps: 30,
};
export function configure(o) { Object.assign(CFG, o); }

const q = (obj) => JSON.stringify(obj).replace(/"/g, "&quot;");

// ---------- markup helpers ----------
// One <video> per cut. start = scene-local seconds, ms = source in point.
export function vid(id, src, start, dur, ms, extra = "") {
  const g = CFG.grade ? ` data-color-grading="${q(CFG.grade)}"` : "";
  return `<video id="${id}" class="clip v" src="${src}" muted playsinline data-start="${start}" data-duration="${dur}" data-media-start="${ms}" data-track-index="0"${g}${extra}></video>`;
}
// Untimed camera wrapper the timeline moves (never time the wrapper).
export const camWrap = (id, inner) => `<div class="cam" id="${id}">${inner}</div>`;

// A centered text line. split: "words" | "chars" | "none"; ghost: chromatic copies; font: "d" display | "b" body label.
export function line(id, text, o) {
  const { size, top, accent = false, split = "words", ghost = false, font = "d", style = "" } = o;
  let inner = text;
  if (split === "chars") inner = [...text].map((c) => (c === " " ? `<span class="ch sp">&nbsp;</span>` : `<span class="ch">${c}</span>`)).join("");
  else if (split === "words") inner = text.split(" ").map((w) => `<span class="wd">${w}</span>`).join(" ");
  const g = ghost ? `<div class="ghost gr">${text}</div><div class="ghost gc">${text}</div>` : "";
  return `<div class="line ${accent ? "accent" : ""} f-${font}" data-layout-allow-overlap id="${id}" style="top:${top}px;font-size:${size}px;line-height:${size}px;height:${size}px;${style}"><span class="main">${inner}</span>${g}</div>`;
}

function fontFaces() {
  return `
@font-face { font-family: "${CFG.display.family}"; src: url("${CFG.display.file}") format("woff2"); }
@font-face { font-family: "${CFG.body.family}"; font-weight: 400; src: url("${CFG.body.regular}") format("woff2"); }
@font-face { font-family: "${CFG.body.family}"; font-weight: 700; src: url("${CFG.body.bold}") format("woff2"); }`;
}

function baseCss(sid, W, H) {
  const r = `#${sid}-root`;
  return `${fontFaces()}
${r} { position: absolute; inset: 0; overflow: hidden; background: ${CFG.ink}; color: ${CFG.text}; font-family: "${CFG.display.family}", sans-serif; }
${r} .shake { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; }
${r} .cam { position: absolute; left: 0; top: 0; width: ${CFG.sourceW}px; height: ${CFG.sourceH}px; transform-origin: 0 0; }
${r} video.v { position: absolute; left: 0; top: 0; width: ${CFG.sourceW}px; height: ${CFG.sourceH}px; object-fit: cover; image-rendering: pixelated; }
${r} .full { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; }
${r} .line { position: absolute; left: 0; width: ${W}px; text-align: center; text-transform: uppercase; white-space: nowrap; letter-spacing: 0.01em; }
${r} .line .main { display: inline-block; text-shadow: 0 8px 36px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.6); }
${r} .line .wd, ${r} .line .ch { display: inline-block; }
${r} .line.accent .main { color: ${CFG.accent}; }
${r} .line.f-b { font-family: "${CFG.body.family}", sans-serif; font-weight: 700; letter-spacing: 0.2em; }
${r} .ghost { position: absolute; left: 0; top: 0; width: ${W}px; text-align: center; opacity: 0; mix-blend-mode: screen; }
${r} .ghost.gr { color: #ff1f3d; }
${r} .ghost.gc { color: #39d8ff; }
${r} .flash { opacity: 0; background: #fff; }
${r} .flash.accentf { background: ${CFG.accent}; }
${r} .shade-b { background: linear-gradient(to top, rgba(7,4,12,0.88) 0%, rgba(7,4,12,0.45) 32%, rgba(7,4,12,0) 60%); }
${r} .shade-t { background: linear-gradient(to bottom, rgba(7,4,12,0.92) 0%, rgba(7,4,12,0.6) 30%, rgba(7,4,12,0) 58%); }
${r} .shade-c { background: radial-gradient(ellipse at 50% 50%, rgba(7,4,12,0.55) 0%, rgba(7,4,12,0.15) 60%, rgba(7,4,12,0) 100%); }
${r} .black { background: ${CFG.ink}; opacity: 0; }
${r} .glow { opacity: 0; }`;
}

// Runtime helpers injected into every scene script (deterministic, seek-safe).
function runtime(W, H) {
  return `
const W = ${W}, H = ${H}, SW = ${CFG.sourceW}, SH_ = ${CFG.sourceH};
const tl = gsap.timeline({ paused: true });
const E = "power4.out";
const SEEN = {};
// fromTo that never pre-renders a visible from-state: lazy for repeated targets and for accents.
function ft(sel, a, b, t, lazy) {
  if (SEEN[sel] || lazy) b = Object.assign({ immediateRender: false }, b);
  SEEN[sel] = true;
  return tl.fromTo(sel, a, b, t);
}
// Frame source fractions (fx, fy) at scale s on this canvas, clamped so no empty edge shows.
function cam(fx, fy, s, o) {
  o = o || {};
  s = Math.max(s, W / SW, H / SH_);
  let x = W / 2 - fx * SW * s, y = H / 2 - fy * SH_ * s;
  x = Math.min(0, Math.max(W - SW * s, x));
  if (o.y !== undefined) y = o.y; else y = Math.min(0, Math.max(H - SH_ * s, y));
  return { x: x, y: y, scale: s };
}
function camMove(sel, t, d, a, b, ease) { ft(sel, a, Object.assign({}, b, { duration: d, ease: ease || "none" }), t); }
const FROM = {
  up: { y: 150, scaleY: 0.3, opacity: 0 }, down: { y: -150, scaleY: 1.7, opacity: 0 },
  left: { x: -420, skewX: 20, opacity: 0 }, right: { x: 420, skewX: -20, opacity: 0 },
  big: { scale: 2.3, opacity: 0 }, stretch: { scaleX: 2.0, scaleY: 0.2, opacity: 0 }, rise: { y: 40, opacity: 0 },
};
const REST = { x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0, rotation: 0, opacity: 1 };
function slam(sel, t, kind, d) { ft(sel, FROM[kind || "up"], Object.assign({}, REST, { duration: d || 0.3, ease: E }), t); }
function slamEach(sel, t, kind, stagger, d) { ft(sel, FROM[kind || "up"], Object.assign({}, REST, { duration: d || 0.32, ease: E, stagger: stagger || 0.03 }), t); }
function out(sel, t, d) { tl.to(sel, { opacity: 0, y: -24, duration: d || 0.12, ease: "power2.in" }, t); }
function chroma(id, t, amp) {
  amp = amp || 18;
  ft("#" + id + " .gr", { x: -amp, opacity: 0.85 }, { x: 0, opacity: 0, duration: 0.26, ease: "power2.out" }, t, true);
  ft("#" + id + " .gc", { x: amp, opacity: 0.7 }, { x: 0, opacity: 0, duration: 0.26, ease: "power2.out" }, t, true);
}
function flash(sel, t, peak, d) { ft(sel, { opacity: peak }, { opacity: 0, duration: d || 0.3, ease: "power2.out" }, t, true); }
const SHK = [[16, -9], [-13, 11], [10, 7], [-7, -6], [4, 3], [0, 0]];
function shake(sel, t, amp) {
  amp = amp || 1;
  ft(sel, { x: 0, y: 0 }, { keyframes: SHK.map(function (p) { return { x: p[0] * amp, y: p[1] * amp, duration: 0.045 }; }), ease: "none" }, t, true);
}
function alive(sel, t, d, to) { ft(sel, { scale: 1 }, { scale: to || 1.05, duration: d, ease: "none" }, t); }
function pulse(sel, t, s) { ft(sel, { scale: s || 1.08 }, { scale: 1, duration: 0.25, ease: "power3.out" }, t, true); }
function fadeIn(sel, t, d, from) { ft(sel, Object.assign({ opacity: 0 }, from || {}), { opacity: 1, x: 0, y: 0, scale: 1, duration: d || 0.4, ease: "power3.out" }, t); }
`;
}

// A scene sub-composition. body is wrapped in a .shake div (#<sid>-shake); script uses the runtime helpers.
export function scene(sid, A, { css = "", body, script, duration }) {
  const { W, H } = A;
  return `<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>${baseCss(sid, W, H)}
${css}
      </style>
      <div id="${sid}-root" data-composition-id="${sid}" data-width="${W}" data-height="${H}" data-duration="${duration}">
        <div class="shake" id="${sid}-shake">
${body}
        </div>
      </div>
      <script>${runtime(W, H)}
${script}
window.__timelines["${sid}"] = tl;
      </script>
    </template>
  </body>
</html>
`;
}

// ---------- audio ----------
// A music clip: gain is folded into the lane (a volume lane overrides data-volume in HyperFrames).
export const music = (id, src, start, dur, ms, points, gain = 1) => ({ id, src, start, dur, ms, lane: points.map(([t, v]) => [t, +(v * gain).toFixed(4)]) });
// A one-shot: [id, src, start, dur, mediaStart, volume]
export const sfx = (id, src, start, dur, ms, vol) => ({ id, src, start, dur, ms, vol });

function audioTag(a, track) {
  const common = `id="${a.id}" src="${a.src}" data-start="${a.start}" data-duration="${a.dur}" data-media-start="${a.ms}" data-track-index="${track}"`;
  if (a.lane) return `<audio ${common} data-automation="${q({ version: 1, lanes: [{ target: "volume", points: a.lane.map(([t, v]) => ({ t, v })) }] })}"></audio>`;
  return `<audio ${common} data-volume="${a.vol}"></audio>`;
}

function root(A, scenes, audio, duration) {
  const hosts = scenes.map(({ id, start, duration: d }) =>
    `      <div id="${id}" data-composition-id="${id}" data-composition-src="compositions/${A.dir}/${id}.html" data-start="${start}" data-duration="${d}" data-track-index="1" data-width="${A.W}" data-height="${A.H}"></div>`).join("\n");
  const tracks = audio.map((a, i) => "      " + audioTag(a, 20 + i)).join("\n");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${A.W}, height=${A.H}" />
    <script src="${CFG.gsap}"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${A.W}px; height: ${A.H}px; overflow: hidden; background: ${CFG.ink}; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: ${CFG.ink}; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${duration}" data-fps="${CFG.fps}" data-width="${A.W}" data-height="${A.H}">
${hosts}
${tracks}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
}

// ---------- write everything ----------
// edit = {
//   duration, aspects: ["L","P"],
//   scenes: [{ id, start, duration, build: (A, k) => ({ css, body, script }) }],
//   versions: { A: [music(...)], B: [...] },   // per-version audio
//   sfx: [sfx(...)],                           // shared one-shots (all versions)
//   index: { version: "A", aspect: "L" }       // what index.html points at
// }
export function writeProject(edit) {
  const aspects = edit.aspects || ["L"];
  for (const k of aspects) {
    const A = ASPECTS[k];
    fs.mkdirSync(`compositions/${A.dir}`, { recursive: true });
    for (const s of edit.scenes) fs.writeFileSync(`compositions/${A.dir}/${s.id}.html`, scene(s.id, A, { ...s.build(A, k), duration: s.duration }));
  }
  fs.mkdirSync("versions", { recursive: true });
  fs.mkdirSync("work", { recursive: true });
  const plan = { duration: edit.duration, versions: {} };
  for (const [ver, tracks] of Object.entries(edit.versions)) {
    const audio = [...tracks, ...(edit.sfx || [])];
    plan.versions[ver] = audio.map(({ src, start, dur, ms, lane, vol }) => (lane ? { src, start, dur, ms, lane } : { src, start, dur, ms, vol }));
    for (const k of aspects) fs.writeFileSync(`versions/${ver}-${ASPECTS[k].dir}.html`, root(ASPECTS[k], edit.scenes, audio, edit.duration));
  }
  const idx = edit.index || { version: Object.keys(edit.versions)[0], aspect: aspects[0] };
  fs.copyFileSync(`versions/${idx.version}-${ASPECTS[idx.aspect].dir}.html`, "index.html");
  fs.writeFileSync("work/audio-plan.json", JSON.stringify(plan, null, 1));
  console.log(`wrote ${edit.scenes.length * aspects.length} scene files, ${Object.keys(edit.versions).length * aspects.length} version roots, index.html = ${idx.version}-${ASPECTS[idx.aspect].dir}`);
}
