"use client";

import { useEffect, useRef } from "react";
import { useGutter } from "@/lib/gutter";
import styles from "./DappledLight.module.css";

/**
 * Dappled light.
 *
 * Six canopies, all the same size, differing only in seed and in how far each
 * one shifts. Three ideas do the work:
 *
 *  1. They accumulate rather than multiply. Multiplying is the physically
 *     correct operator and it collapses in practice: each layer is nearly
 *     binary, so the product of six is zero almost everywhere and the few
 *     survivors are needle-thin. Averaging optical density keeps every layer's
 *     contribution partial, so the stack stays legible at six.
 *  2. Averaging N fields shrinks their variance by sqrt(N), which would flatten
 *     the picture toward grey as layers are added. Dividing the cut band by the
 *     same sqrt(N) cancels it exactly, so the look holds from one layer to six.
 *  3. The depths are centred before the parallax is applied. Physically every
 *     layer shifts the same way and only the amount differs, and that shared
 *     component is what reads as a spotlight dragging across the page. Subtract
 *     it and only the shear survives: near canopy one way, far the other, net
 *     translation zero. Nothing travels, yet the gaps re-register completely.
 *
 * The falloff attenuates the dapple MASK, never the colour. A vignette that
 * multiplies the output darkens the ground itself and reads as a black edge;
 * this simply stops light arriving out there.
 *
 * Adapted in one respect from the reference: it outputs premultiplied alpha
 * rather than an opaque rust ground, so it composites over this site's two CSS
 * grounds and the seam still divides them. The hero is never left with nothing
 * behind it if the context fails.
 */

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;   // smoothed fast: drives parallax
uniform vec2  uGlow;    // smoothed slower: drives the falloff centre
uniform float uAngle, uScale, uAniso, uSoft, uDensity, uLayers, uDetail;
uniform float uSpeed, uParallax, uSpread, uBulk, uVary, uCut, uWindow;
uniform float uFalloff, uFollow, uRadius, uTilt, uGrain;
uniform float uGutter;
out vec4 outColor;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }

float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}

// uDetail is the octave gain, and it decides the CHARACTER of the field.
// At 0.5 you get classic fractal noise: clumps, voids, wildly uneven blobs.
// Low, and the base octave dominates so every dapple comes out the same size.
float fbm(vec2 p){
  float v = 0.0, a = 1.0, tot = 0.0;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for(int i=0;i<4;i++){ v += a*vnoise(p); tot += a; p = rot*p*2.03; a *= uDetail; }
  return v / tot;
}

vec2  gWind;
vec2  gPar;
float gK;

// Every canopy is the SAME size. They differ only in seed, in depth, and
// therefore in how far they shift. Returns occlusion: 1 = leaf, 0 = gap.
float canopy(vec2 q, float depth, float phase, float freq){
  float ctr = 0.55;
  // Centring the depths is the whole trick: subtract the common component and
  // only the shear is left, so the field rearranges without travelling.
  vec2 shift = gPar * (((depth - ctr) + uBulk*ctr) * uSpread);
  vec2 s = q * freq + shift;
  s.x += uTime * uSpeed * (0.05 + depth * 0.22);
  s += (gWind - 0.5) * (0.30 + depth * 0.40);
  return smoothstep(uDensity + gK, uDensity - gK, fbm(s + phase));
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p  = uv - 0.5;
  p.x *= uRes.x / uRes.y;

  float a = radians(uAngle);
  mat2  R = mat2(cos(a), -sin(a), sin(a), cos(a));
  vec2  q = R * p * uScale;
  q.x /= uAniso;

  vec2 mo = uMouse - 0.5;  mo.x *= uRes.x / uRes.y;
  gPar = R * (mo * uParallax * uScale);
  gPar.x /= uAniso;

  gK = uSoft;

  float t = uTime * uSpeed;
  gWind = vec2(fbm(q*0.5 + t*0.10), fbm(q*0.5 + 7.3 - t*0.08));

  // uVary spreads the layer frequencies apart. At 0 every canopy is identical
  // in scale, which is what you want when stacking a lot of them.
  float f0 = 1.0 - uVary*0.45, f1 = 1.0 - uVary*0.27, f2 = 1.0 - uVary*0.09;
  float f3 = 1.0 + uVary*0.09, f4 = 1.0 + uVary*0.27, f5 = 1.0 + uVary*0.45;

  // ACCUMULATE, do not multiply. See the note at the top of the file.
  float occ = canopy(q, 1.00,  0.0, f0);
  if(uLayers > 1.5) occ += canopy(q, 0.80, 11.3, f1);
  if(uLayers > 2.5) occ += canopy(q, 0.62, 23.7, f2);
  if(uLayers > 3.5) occ += canopy(q, 0.45, 37.1, f3);
  if(uLayers > 4.5) occ += canopy(q, 0.28, 51.9, f4);
  if(uLayers > 5.5) occ += canopy(q, 0.12, 67.3, f5);

  float shade = occ / uLayers;   // mean occlusion, same scale at any N

  // uCut is how much accumulated leaf it takes to put a spot in shadow, and
  // uWindow how abruptly. Dividing by sqrt(N) holds the look steady as layers
  // are added, because averaging N fields shrinks the variance by that much.
  float w = max(0.02, uWindow / sqrt(uLayers));
  float open = smoothstep(uCut + w, uCut - w, shade);

  // The falloff attenuates the MASK, never the colour. uGlow is a second,
  // slower-smoothed cursor, so the lit region trails the parallax rather than
  // being welded to it. That lag is most of the feeling.
  vec2  gc = (uGlow - 0.5) * uFollow;  gc.x *= uRes.x / uRes.y;
  float r    = length((p - gc) * vec2(0.78, 1.0));
  float fall = 1.0 - uFalloff * smoothstep(uRadius, uRadius + 0.55, r);
  open *= fall;

  float core = smoothstep(0.55, 0.98, open);

  // Two palettes, split on the seam, so the light runs cold over the engineer
  // and warm over the Canon and changes colour exactly where the panes do.
  float side = smoothstep(uGutter - 0.012, uGutter + 0.012, uv.x);

  vec3 versoMid  = vec3(0.560, 0.640, 0.720);
  vec3 versoLite = vec3(0.898, 0.941, 0.980);
  vec3 rectoMid  = vec3(0.949, 0.627, 0.502);
  vec3 rectoLite = vec3(0.992, 0.941, 0.894);

  vec3 cMid  = mix(versoMid,  rectoMid,  side);
  vec3 cLite = mix(versoLite, rectoLite, side);

  float g = clamp(uv.x*0.55 + uv.y*0.45, 0.0, 1.0) * uTilt;
  vec3 tint = mix(cMid, cLite, core * 0.30 + g * 0.25);

  /*
    Pulled well back on the verso. The ground moved from near-black to #333,
    which halves the contrast the light had to work against: at the old
    strength the canopy washed the whole side out to fog and took the type's
    legibility with it. Less light on grey than on ink, not more.
  */
  float strength = mix(0.30, 0.40, side);
  float alpha = clamp(open * strength, 0.0, 1.0);

  float grain = hash(gl_FragCoord.xy + fract(uTime)*137.0) - 0.5;
  alpha = clamp(alpha + grain * uGrain, 0.0, 1.0);

  outColor = vec4(tint * alpha, alpha);   // premultiplied
}`;

/** Hal's tuning, from the control panel. */
const TUNING = {
  angle: 43,
  scale: 17.0,
  aniso: 3.2, // streak length
  soft: 0.47, // edge softness
  density: 0.355, // canopy density
  layers: 6,
  detail: 0.12,
  vary: 0.24, // size variance
  cut: 0.28, // light threshold
  window: 0.29, // contrast band
  falloff: 0.94, // falloff depth
  radius: 0.48,
  /**
   * Falloff follow at 0 pins the lit region to the centre of the frame rather
   * than letting it track the pointer. That also makes falloff lag inert:
   * the glow cursor is multiplied by follow, so at 0 it contributes nothing
   * whatever its smoothing. Both are left at the panel's values.
   */
  follow: 0.0,
  lag: 0.0,
  tilt: 0.5, // ground tilt
  speed: 1.5, // flow speed
  parallax: 1.15, // cursor force
  spread: 0.14, // depth spread
  /**
   * Bulk motion at 0 centres the depths completely: no shared translation at
   * all, only shear. Near canopy one way, far canopy the other, mid stays put.
   * This is the "nothing travels, yet the pattern rearranges" case in full.
   */
  bulk: 0.0,
  grain: 0.028,
};

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

export function DappledLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { read } = useGutter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
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

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"), uGlow = u("uGlow"), uGutter = u("uGutter");

    // Constants, set once.
    gl.uniform1f(u("uAngle"), TUNING.angle);
    gl.uniform1f(u("uScale"), TUNING.scale);
    gl.uniform1f(u("uAniso"), TUNING.aniso);
    gl.uniform1f(u("uSoft"), TUNING.soft);
    gl.uniform1f(u("uDensity"), TUNING.density);
    gl.uniform1f(u("uLayers"), TUNING.layers);
    gl.uniform1f(u("uDetail"), TUNING.detail);
    gl.uniform1f(u("uVary"), TUNING.vary);
    gl.uniform1f(u("uCut"), TUNING.cut);
    gl.uniform1f(u("uWindow"), TUNING.window);
    gl.uniform1f(u("uFalloff"), TUNING.falloff);
    gl.uniform1f(u("uRadius"), TUNING.radius);
    gl.uniform1f(u("uFollow"), TUNING.follow);
    gl.uniform1f(u("uTilt"), TUNING.tilt);
    gl.uniform1f(u("uSpeed"), TUNING.speed);
    gl.uniform1f(u("uParallax"), TUNING.parallax);
    gl.uniform1f(u("uSpread"), TUNING.spread);
    gl.uniform1f(u("uBulk"), TUNING.bulk);
    gl.uniform1f(u("uGrain"), TUNING.grain);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Two cursors. The first chases the pointer; the second chases the first,
    // so the lag compounds and the lit region arrives late and overshoots
    // slightly, the way a patch of sun does when a branch swings.
    const target = { x: 0.5, y: 0.5 };
    const mouse = { x: 0.5, y: 0.5 };
    const glow = { x: 0.5, y: 0.5 };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    /**
     * Size is pushed unconditionally after linking. An earlier version returned
     * early when the dimensions already matched, which broke the whole effect
     * in development: StrictMode mounts the effect twice, the second mount
     * reuses the same canvas at the same size, and the fresh program never
     * received uRes. It stayed (0,0) and every fragment divided by zero.
     */
    const pushSize = (w: number, h: number) => {
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
    let running = true;
    let start = performance.now();

    const draw = (now: number) => {
      if (!running) return;

      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      // Chases the first cursor rather than the pointer: that is the delay.
      const chase = 0.05 / (1 + TUNING.lag * 40);
      glow.x += (mouse.x - glow.x) * chase;
      glow.y += (mouse.y - glow.y) * chase;

      gl.uniform1f(uTime, reduced ? 0 : (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform2f(uGlow, glow.x, glow.y);
      gl.uniform1f(uGutter, read());
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      frame = requestAnimationFrame(draw);
    };

    if (reduced) {
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uMouse, 0.5, 0.5);
      gl.uniform2f(uGlow, 0.5, 0.5);
      gl.uniform1f(uGutter, read());
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      frame = requestAnimationFrame(draw);
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!reduced) {
        running = true;
        start = performance.now() - 1000;
        frame = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onLost = (e: Event) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(frame);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [read]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
