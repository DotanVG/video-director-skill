// Example edit built with kit.mjs: an 18 s (9 bars at 120 BPM) trailer in 16:9 and 9:16, two music versions.
// Copy kit.mjs and this file into a HyperFrames project, rename this to build.mjs, replace the
// placeholders (assets, copy, ranges, focus points) with real values from your contact sheets, then:
//   node build.mjs && npx hyperframes check
//
// Expected assets (replace with yours):
//   fonts/Display.woff2, fonts/Body-400.woff2, fonts/Body-700.woff2
//   assets/vendor/gsap.min.js            (vendored so renders never need the network)
//   assets/clips/footage.mp4             (1920x1080 source)
//   assets/art.png                       (key art / cover, square-ish)
//   assets/audio/main.wav, assets/audio/calm.wav, assets/sfx/hit.wav, assets/sfx/impact.wav
import { configure, writeProject, vid, camWrap, line, music, sfx } from "./kit.mjs";

configure({ accent: "#ff2d4a", text: "#f4ecd8", ink: "#07040c" });

const CLIP = "assets/clips/footage.mp4";
const BEAT = 0.5; // 120 BPM; scene changes every 2 bars (4 s)

// ---------------- scene 1: kinetic hook on dark (0-4) ----------------
// Store pages: replace this with real footage in the first 2 s and put the line over it.
const s1 = (A, k) => {
  const L = k === "L";
  return {
    css: `#s1-root .bg { background: radial-gradient(ellipse at 50% 50%, #140812 0%, #07040c 70%); }
#s1-root .glow { background: radial-gradient(ellipse at 50% 55%, rgba(120,10,30,0.55) 0%, rgba(7,4,12,0) 72%); }`,
    body: `<div class="full bg"></div><div class="full glow" id="s1-glow"></div>
${L ? line("s1-a", "THIS IS YOUR", { size: 150, top: 330 }) : line("s1-a", "THIS IS YOUR", { size: 110, top: 760 })}
${L ? line("s1-b", "HOOK.", { size: 260, top: 500, accent: true, split: "chars", ghost: true }) : line("s1-b", "HOOK.", { size: 230, top: 900, accent: true, split: "chars", ghost: true })}
<div class="full flash accentf" id="s1-flash"></div>`,
    script: `
slam("#s1-a .wd:nth-child(1)", 0.0, "left");
slam("#s1-a .wd:nth-child(2)", ${BEAT}, "right");
slam("#s1-a .wd:nth-child(3)", ${2 * BEAT}, "up");
slamEach("#s1-b .ch", ${4 * BEAT}, "big", 0.03, 0.3);
chroma("s1-b", ${4 * BEAT + 0.22}, 26); shake("#s1-shake", ${4 * BEAT + 0.18}, 1.2); flash("#s1-flash", ${4 * BEAT + 0.18}, 0.35, 0.4);
ft("#s1-glow", { opacity: 0 }, { opacity: 1, duration: 0.25 }, ${4 * BEAT + 0.15});
alive("#s1-b", ${4 * BEAT + 0.35}, 1.6, 1.05);
`,
  };
};

// ---------------- scene 2: four one-second cuts with punch-ins (4-8) ----------------
// [mediaStart, focusX, focusY, scale16x9, scale9x16] for each 1 s cut (read focus points off contact sheets).
const CUTS = [
  [18.0, 0.76, 0.5, 1.5, 2.0],
  [20.0, 0.78, 0.5, 1.6, 2.1],
  [22.0, 0.78, 0.5, 1.7, 2.2],
  [24.0, 0.78, 0.5, 1.6, 2.1],
];
const s2 = (A, k) => {
  const L = k === "L";
  return {
    body: `${CUTS.map((c, i) => camWrap(`s2-c${i}`, vid(`s2-v${i}`, CLIP, i, 1, c[0]))).join("\n")}
<div class="full shade-b"></div>
${L ? line("s2-w1", "WORD ONE.", { size: 230, top: 700, split: "chars", ghost: true }) : line("s2-w1", "WORD ONE.", { size: 150, top: 1180, split: "chars", ghost: true })}
${L ? line("s2-w2", "WORD TWO.", { size: 230, top: 700, accent: true, split: "chars", ghost: true }) : line("s2-w2", "WORD TWO.", { size: 150, top: 1180, accent: true, split: "chars", ghost: true })}
<div class="full flash" id="s2-flash"></div>`,
    script: `${CUTS.map((c, i) => {
      const s = L ? c[3] : c[4];
      return `camMove("#s2-c${i}", ${i}, 1, cam(${c[1]}, ${c[2]}, ${s}), cam(${c[1]}, ${c[2]}, ${(s * 1.09).toFixed(3)}), "power1.out");`;
    }).join("\n")}
slamEach("#s2-w1 .ch", 0.0, "left", 0.035, 0.3); chroma("s2-w1", 0.22, 20); shake("#s2-shake", 0.2, 0.8);
pulse("#s2-w1", 1.0, 1.07); flash("#s2-flash", 1.0, 0.12, 0.15); out("#s2-w1", 1.88);
slamEach("#s2-w2 .ch", 2.0, "up", 0.035, 0.3); chroma("s2-w2", 2.22, 22); shake("#s2-shake", 2.2, 0.8);
pulse("#s2-w2", 3.0, 1.07); flash("#s2-flash", 3.0, 0.12, 0.15);
`,
  };
};

// ---------------- scene 3: one held hero shot, punch-out on the flash (8-12) ----------------
const s3 = (A, k) => {
  const L = k === "L";
  return {
    body: `${camWrap("s3-c", vid("s3-v", CLIP, 0, 4, 33.4))}
<div class="full shade-b"></div>
${L ? line("s3-a", "THE BIG", { size: 150, top: 520 }) : line("s3-a", "THE BIG", { size: 150, top: 1000 })}
${L ? line("s3-b", "MOMENT.", { size: 240, top: 690, accent: true, split: "chars", ghost: true }) : line("s3-b", "MOMENT.", { size: 160, top: 1170, accent: true, split: "chars", ghost: true })}
<div class="full flash" id="s3-flash"></div>`,
    script: (L
      ? `camMove("#s3-c", 0, 1, cam(0.8, 0.5, 1.45), cam(0.82, 0.5, 1.62), "power1.in");
camMove("#s3-c", 1, 3, cam(0.5, 0.5, 1.06), cam(0.56, 0.52, 1.22), "none");`
      : `camMove("#s3-c", 0, 1, cam(0.86, 0.5, 2.2), cam(0.86, 0.5, 2.4), "power1.in");
camMove("#s3-c", 1, 3, cam(0.72, 0.5, 1.85), cam(0.42, 0.52, 1.95), "power1.inOut");`) + `
flash("#s3-flash", 1.0, 0.9, 0.4); shake("#s3-shake", 1.0, 1.4);
slam("#s3-a", 1.0, "stretch");
slamEach("#s3-b .ch", 2.0, "big", 0.035, 0.3); chroma("s3-b", 2.22, 24); shake("#s3-shake", 2.2, 1.0);
alive("#s3-b", 2.4, 1.5, 1.05);
`,
  };
};

// ---------------- scene 4: end card that holds (12-18) ----------------
const s4 = (A, k) => {
  const L = k === "L";
  const css = `#s4-root .bg { background: radial-gradient(ellipse at ${L ? "28% 50%" : "50% 30%"}, #22091a 0%, #07040c 62%); }
#s4-root .halo { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255,45,74,0.42) 0%, rgba(140,20,60,0.18) 40%, rgba(7,4,12,0) 70%); opacity: 0; }
#s4-root .art { position: absolute; overflow: hidden; border-radius: 10px; box-shadow: 0 0 0 2px rgba(255,45,74,0.45), 0 0 80px rgba(255,45,74,0.35), 0 40px 90px rgba(0,0,0,0.8); }
#s4-root .art img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; transform-origin: 12% 88%; }
#s4-root .t { position: absolute; white-space: nowrap; }
#s4-root .title { font-family: "Display", sans-serif; text-transform: uppercase; }
#s4-root .tag { font-family: "Body", sans-serif; font-weight: 700; letter-spacing: 0.2em; color: #ff2d4a; text-transform: uppercase; }
#s4-root .p1 { font-family: "Body", sans-serif; font-weight: 700; }
#s4-root .p2 { font-family: "Body", sans-serif; font-weight: 400; color: #cbbfd8; }
#s4-root .pill { display: inline-block; border: 3px solid #ff2d4a; border-radius: 999px; font-family: "Display", sans-serif; background: rgba(255,45,74,0.12); box-shadow: 0 0 40px rgba(255,45,74,0.35); }
#s4-root .cred { font-family: "Body", sans-serif; font-weight: 400; letter-spacing: 0.08em; color: #8f839f; text-transform: uppercase; text-align: center; }`;
  const col = L ? `left:880px;width:900px;text-align:left;` : `left:0;width:1080px;text-align:center;`;
  const y = L ? { title: 220, tag: 345, p1: 425, url: 520, cred: 940 } : { title: 1060, tag: 1180, p1: 1250, url: 1340, cred: 1520 };
  return {
    css,
    body: `<div class="full bg"></div>
<div class="halo" id="s4-halo" style="${L ? "left:-60px;top:-60px;width:1100px;height:1100px" : "left:-140px;top:-90px;width:1360px;height:1360px"};"></div>
<div class="art" id="s4-art" style="${L ? "left:150px;top:200px;width:640px;height:640px" : "left:150px;top:210px;width:780px;height:780px"};"><img id="s4-img" src="assets/art.png" alt="" /></div>
<div class="t title" id="s4-title" style="${col}top:${y.title}px;font-size:100px;line-height:100px;"><span class="wd">YOUR</span> <span class="wd" style="color:#ff2d4a">TITLE</span></div>
<div class="t tag" id="s4-tag" style="${col}top:${y.tag}px;font-size:28px;">One line genre pitch</div>
<div class="t p1" id="s4-p1" style="${col}top:${y.p1}px;font-size:44px;">Your call to action.</div>
<div class="t" style="${col}top:${y.url}px;"><span class="pill" id="s4-url" style="font-size:44px;line-height:44px;padding:20px 36px;">your-url.example</span></div>
<div class="t cred" id="s4-cred" style="left:0;width:${A.W}px;top:${y.cred}px;font-size:20px;">Credits line, small</div>`,
    script: `
ft("#s4-halo", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, 0.0);
ft("#s4-art", { opacity: 0, scale: 0.86, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: E }, 0.0);
ft("#s4-img", { scale: 1.0 }, { scale: 1.06, duration: 6, ease: "none" }, 0.0);
slam("#s4-title .wd:nth-child(1)", 0.5, "left");
slam("#s4-title .wd:nth-child(2)", 1.0, "big", 0.28);
fadeIn("#s4-tag", 1.5, 0.4, { y: 24 });
fadeIn("#s4-p1", 2.0, 0.4, { y: 24 });
ft("#s4-url", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, 2.5);
fadeIn("#s4-cred", 3.0, 0.6);
`,
  };
};

// ---------------- the edit ----------------
writeProject({
  duration: 18,
  aspects: ["L", "P"],
  scenes: [
    { id: "s1", start: 0, duration: 4, build: s1 },
    { id: "s2", start: 4, duration: 4, build: s2 },
    { id: "s3", start: 8, duration: 4, build: s3 },
    { id: "s4", start: 12, duration: 6, build: s4 },
  ],
  versions: {
    // A: one track from a downbeat (verify the offset with scripts/beat_grid.py), fade in 0.3 s, out over the last 1.5 s
    A: [music("music-main", "assets/audio/main.wav", 0, 18, 14, [[0, 0], [0.3, 1], [16.5, 1], [18, 0]], 0.75)],
    // B: calm track under the hook, hard switch on the first action cut, covered by an impact
    B: [
      music("music-calm", "assets/audio/calm.wav", 0, 4, 0, [[0, 1], [3.97, 1], [4, 0]], 1.0),
      music("music-main", "assets/audio/main.wav", 4, 14, 14, [[0, 0], [0.01, 1], [12.5, 1], [14, 0]], 0.75),
      { id: "sfx-impact", src: "assets/sfx/impact.wav", start: 3.855, dur: 0.54, ms: 1.0, vol: 0.32 },
    ],
  },
  sfx: [sfx("sfx-hit-1", "assets/sfx/hit.wav", 1.97, 0.16, 0, 0.3), sfx("sfx-hit-2", "assets/sfx/hit.wav", 9.97, 0.16, 0, 0.3)],
  index: { version: "A", aspect: "L" },
});
