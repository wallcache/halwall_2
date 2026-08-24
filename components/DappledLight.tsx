"use client";

import { useEffect, useRef } from "react";
import { useGutter } from "@/lib/gutter";
import styles from "./DappledLight.module.css";

/**
 * Dappled light: six canopies, cursor-driven by parallax rather than by
 * brightness. Implemented from SPEC.md.
 *
 * The three ideas that matter, in the spec's own terms:
 *
 *  - Streaks, not clouds. The plane is rotated by ANGLE then one axis divided
 *    by ANISO, so a round feature in that squashed space lands on screen as a
 *    long ellipse. That is the whole directional look.
 *  - Accumulate, do not multiply. Six near-binary masks multiplied leave the
 *    product at zero almost everywhere; summed as optical density and divided
 *    by six, every layer keeps contributing.
 *  - BAND is derived and is the one real trap. Averaging N fields shrinks the
 *    variance by sqrt(N), so the field flattens toward grey as layers are
 *    added; dividing the cut band by the same sqrt(N) cancels it exactly.
 *    Recompute it if WINDOW or the layer count ever changes.
 *
 * Two deliberate departures from the spec, both because this hero is split:
 *
 *  1. It outputs premultiplied alpha rather than an opaque ground. The page
 *     has two CSS grounds with a seam between them, and they have to survive.
 *     It also means a failed context leaves the hero intact rather than blank,
 *     which is a bug this site has already had once.
 *  2. There are two palettes, mixed on the seam, so the light runs cool over
 *     the engineering and Forest-green over the Canon. The spec's own presets:
 *     Slate for the verso, Forest for the recto.
 *
 * Both grounds keep their contrast because the light is applied at a strength
 * that leaves the type alone. The spec's acceptance check — no pixel darker
 * than the shade — holds by construction here: the falloff attenuates the
 * mask, so away from the cursor the alpha simply goes to zero and the CSS
 * ground shows through unmodified.
 */

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

// ---- Forest tuning, baked as const per the spec -------------------------
const float ANGLE    = 43.0;
const float SCALE    = 17.0;
const float ANISO    = 4.6;
const float SOFT     = 0.470;
const float DENSITY  = 0.355;
const float DETAIL   = 0.12;
const float VARY     = 1.00;
const float CUT      = 0.280;
const float WINDOW   = 0.15;
// DERIVED: 0.15 / sqrt(6). Hardcoded because GLSL forbids function calls in
// const initialisers. Recompute if WINDOW or the layer count changes, or the
// image washes out.
const float BAND     = 0.061237;
const float SPEED    = 1.50;
const float PARALLAX = 1.95;
const float SPREAD   = 0.38;
const float BULK     = 0.00;   // 0 = pure shear; nothing translates
const float FALLOFF  = 0.82;
const float RADIUS   = 0.08;
const float TILT     = 0.50;
const float GRAIN    = 0.028;
// Back above zero, so the lit region tracks the cursor again rather than
// sitting in the middle of the frame.
const float FOLLOW   = 2.22;

// Hal's HSV, one per side of the seam. Forest as given (128 degrees, 0.54,
// 0.59); the verso takes the same saturation and brightness at a slate hue, so
// the two sides differ in temperature rather than in weight.
const vec3 SLATE  = vec3(0.58889, 0.54, 0.59);   // verso, the engineering
const vec3 FOREST = vec3(0.35556, 0.54, 0.59);   // recto, the Canon

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;   // 0..1, origin bottom-left to match gl_FragCoord
uniform float uGutter;
out vec4 outColor;

vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }

float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}

// DETAIL is the fBm octave gain and it decides the CHARACTER of the field. At
// the textbook 0.5 you get clumps and voids; at 0.12 the base octave dominates
// and every dapple comes out roughly the same size, which is what canopy gaps
// actually look like.
float fbm(vec2 p){
  float v = 0.0, a = 1.0, tot = 0.0;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for(int i=0;i<4;i++){ v += a*vnoise(p); tot += a; p = rot*p*2.03; a *= DETAIL; }
  return v / tot;
}

vec2 gWind;
vec2 gPar;

// Depths are centred on 0.55, so the offsets are signed: near canopy shifts one
// way, far the other, and with BULK at 0 the sum cancels. Nothing travels; what
// changes is which gaps align.
float canopy(vec2 q, float depth, float phase, float freq){
  const float ctr = 0.55;
  vec2 shift = gPar * (((depth - ctr) + BULK*ctr) * SPREAD);
  vec2 s = q * freq + shift;
  s.x += uTime * SPEED * (0.05 + depth * 0.22);
  s += (gWind - 0.5) * (0.30 + depth * 0.40);
  return smoothstep(DENSITY + SOFT, DENSITY - SOFT, fbm(s + phase));
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p  = uv - 0.5;
  p.x *= uRes.x / uRes.y;

  float a = radians(ANGLE);
  mat2  R = mat2(cos(a), -sin(a), sin(a), cos(a));
  vec2  q = R * p * SCALE;
  q.x /= ANISO;

  vec2 mo = uMouse - 0.5;  mo.x *= uRes.x / uRes.y;
  gPar = R * (mo * PARALLAX * SCALE);
  gPar.x /= ANISO;

  float t = uTime * SPEED;
  gWind = vec2(fbm(q*0.5 + t*0.10), fbm(q*0.5 + 7.3 - t*0.08));

  // VARY spreads the layer frequencies apart. At 0 every canopy is identical.
  float f0 = 1.0 - VARY*0.45, f1 = 1.0 - VARY*0.27, f2 = 1.0 - VARY*0.09;
  float f3 = 1.0 + VARY*0.09, f4 = 1.0 + VARY*0.27, f5 = 1.0 + VARY*0.45;

  float occ = canopy(q, 1.00,  0.0, f0)
            + canopy(q, 0.80, 11.3, f1)
            + canopy(q, 0.62, 23.7, f2)
            + canopy(q, 0.45, 37.1, f3)
            + canopy(q, 0.28, 51.9, f4)
            + canopy(q, 0.12, 67.3, f5);

  float shade = occ / 6.0;
  float open  = smoothstep(CUT + BAND, CUT - BAND, shade);

  // The falloff attenuates the MASK, never the composite. A vignette over the
  // output darkens the ground and reads as dirt on the lens; this just stops
  // light arriving, so the ground stays exactly itself to the corners.
  vec2  gc   = (uMouse - 0.5) * FOLLOW;  gc.x *= uRes.x / uRes.y;
  float r    = length((p - gc) * vec2(0.78, 1.0));
  float fall = 1.0 - FALLOFF * smoothstep(RADIUS, RADIUS + 0.55, r);
  open *= fall;

  float core = smoothstep(0.55, 0.98, open);

  // Palette, split on the seam.
  float side = smoothstep(uGutter - 0.012, uGutter + 0.012, uv.x);
  vec3 hsv = mix(SLATE, FOREST, side);

  // Two tones from one scheme: the light itself, and a desaturated core for
  // the gaps where the sun gets through cleanly.
  vec3 cMid  = hsv2rgb(vec3(hsv.x, hsv.y * 0.72, hsv.z));
  vec3 cLite = hsv2rgb(vec3(hsv.x, hsv.y * 0.26, min(1.0, hsv.z * 1.18)));

  float g = clamp(uv.x*0.55 + uv.y*0.45, 0.0, 1.0) * TILT;
  vec3 tint = mix(cMid, cLite, core * 0.42 + g * 0.18);

  // Held low on purpose. Both grounds have to keep their contrast: the verso
  // is #333, not near-black, so light that would read as drama on ink turns
  // grey to fog and takes the type's legibility with it.
  float strength = mix(0.30, 0.36, side);
  float alpha = clamp(open * strength, 0.0, 1.0);

  // Grain is not decoration: eight bits per channel cannot hold a smooth ramp
  // across a full-screen gradient, and at 0 the banding is immediate.
  float grain = hash(gl_FragCoord.xy + fract(uTime)*137.0) - 0.5;
  alpha = clamp(alpha + grain * GRAIN, 0.0, 1.0);

  outColor = vec4(tint * alpha, alpha);   // premultiplied
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("[DappledLight]", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** Spec: DPR capped at 1.6. This is fragment-bound; 2.0 doubles cost for nothing. */
const MAX_DPR = 1.6;
/** Spec: time-based pointer smoothing, so it feels identical at 60 and 144 Hz. */
const SMOOTH_TAU = 0.11;
/** Spec: reduced motion freezes the clock here, but the cursor still responds. */
const FROZEN_T = 9;

export function DappledLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { read } = useGutter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false, // no geometric edges to alias
      alpha: true, // departs from the spec: the CSS grounds must survive
      premultipliedAlpha: true,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      console.warn("[DappledLight] WebGL2 unavailable; the hero keeps its CSS ground.");
      canvas.dataset.light = "unavailable";
      return;
    }
    canvas.dataset.light = "on";

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("[DappledLight]", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uGutter = gl.getUniformLocation(prog, "uGutter");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = { x: 0.5, y: 0.5 };
    const mouse = { x: 0.5, y: 0.5 };

    // Spec: uMouse origin is bottom-left to match gl_FragCoord. The DOM is
    // top-left, so the flip happens exactly once, here.
    const onPointer = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    /*
      Size is pushed unconditionally after linking. Returning early when the
      dimensions already match broke this in development: StrictMode mounts the
      effect twice, the second mount reuses the same canvas at the same size,
      and the fresh program never received uRes. It stayed (0,0) and every
      fragment divided by zero.
    */
    const pushSize = (w: number, h: number) => {
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      pushSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let frame = 0;
    let visible = true;
    let hidden = false;
    let last = performance.now();
    let clock = 0;

    const render = () => {
      gl.uniform1f(uTime, reduced ? FROZEN_T : clock);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uGutter, read());
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) clock += dt;

      // Spec: time-based smoothing. A per-frame lerp arrives twice as fast on a
      // 144Hz panel as on a 60Hz one and crawls on anything struggling.
      const k = 1 - Math.exp(-dt / SMOOTH_TAU);
      mouse.x += (target.x - mouse.x) * k;
      mouse.y += (target.y - mouse.y) * k;

      render();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame || !visible || hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Spec: pause when offscreen, or it burns GPU on a hero nobody is looking at.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        visible ? start() : stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      hidden = document.hidden;
      hidden ? stop() : start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      /*
        Spec: release the context explicitly. Without this an SPA that mounts
        and unmounts this leaks contexts until the browser starts dropping the
        oldest, which shows up as unrelated canvases elsewhere going blank.
      */
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [read]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
