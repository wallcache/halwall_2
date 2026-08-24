"use client";

import { useEffect, useRef } from "react";
import { useGutter } from "@/lib/gutter";
import styles from "./DappledLight.module.css";

/**
 * Light through leaves.
 *
 * One full-screen fragment shader: domain-warped fractal noise, stretched
 * along a diagonal so the highlights read as elongated dapples rather than
 * blobs, drifting slowly and bending toward the cursor.
 *
 * Deliberately raw WebGL2 rather than three.js — this is a single triangle
 * with no geometry, no camera and no scene graph, so the library would have
 * been about 150KB to draw two triangles' worth of nothing. The whole effect
 * is the shader below.
 *
 * The palette is driven by the gutter, so the light runs cold over the
 * engineer and warm over the Canon, and crosses at the seam.
 */

const VERT = `#version 300 es
void main() {
  // Full-screen triangle from gl_VertexID. No buffers, no attributes.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;   // 0..1, smoothed
uniform float u_gutter;  // 0 = recto, 1 = verso
out vec4 outColor;

// -- value noise ----------------------------------------------------------
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);      // smoothstep
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;                            // slightly off 2.0 to avoid grid echo
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time * 0.045;

  // Pull the field toward the cursor. This is the part that reads as "the
  // light moves when you move" — the warp origin follows the pointer.
  //
  // The first pass of this was far too polite to notice: a 0.16 displacement
  // inside a tight exp() falloff moved the canopy by a couple of pixels. Wider
  // radius, much stronger displacement, and a swirl so the light rotates
  // around the pointer rather than only sliding away from it.
  vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
  vec2 toMouse = p - m;
  float d2 = dot(toMouse, toMouse);
  // Wide, soft falloff. A tight one turns the cursor into a starburst; the
  // canopy should lean toward the hand, not detonate under it.
  float pull = exp(-d2 * 1.5);
  vec2 dir = normalize(toMouse + 1e-5);
  p += dir * pull * 0.2;
  p += vec2(-dir.y, dir.x) * pull * 0.085;   // a little swirl, not a vortex

  // Rotate so the dapples run on a diagonal, then squash one axis hard so they
  // stretch into leaf-shaped streaks rather than staying round.
  const float ang = 0.52;
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  vec2 q = rot * p * vec2(2.6, 7.4);

  // Domain warp: noise displacing the lookup of more noise. Two layers of it
  // is what turns regular fbm into something organic.
  // Gentle warp only. Strong warping is what produced marble rather than
  // leaf-shadow: the streaks curled back on themselves instead of drifting.
  vec2 w = vec2(fbm(q + vec2(t, t * 0.7)), fbm(q + vec2(5.2, 1.3) - t * 0.8));
  float n = fbm(q + 1.15 * w);

  // A second canopy at a different scale and angle, multiplied through, so the
  // gaps overlap the way two layers of leaves actually do.
  vec2 q2 = mat2(cos(-0.9), -sin(-0.9), sin(-0.9), cos(-0.9)) * p * vec2(1.7, 4.3);
  float n2 = fbm(q2 + 0.9 * w + t * 0.6);
  n = mix(n, n * 1.25 * n2 + 0.28, 0.55);

  // Lift into separated pools. A narrow window is what makes them read as
  // distinct dapples with dark between, rather than one continuous wash.
  float light = smoothstep(0.44, 0.66, n);
  light = pow(light, 1.15);

  // A second, tighter pass puts a brighter core inside the larger pools —
  // the gaps in the canopy where the sun gets through cleanly.
  float core = smoothstep(0.58, 0.72, n);
  light += core * 0.55;

  // A fine break-up so edges shimmer rather than being perfectly smooth blobs.
  float grain = fbm(q * 3.4 + t * 0.9);
  light *= 0.86 + 0.26 * grain;

  // -- tint, crossfaded at the seam --------------------------------------
  // Only the light is drawn here. The grounds are painted in CSS underneath,
  // so a failed or slow WebGL context costs the page some atmosphere and
  // nothing else.
  vec3 versoLight = vec3(0.435, 0.545, 0.655);
  vec3 rectoLight = vec3(0.918, 0.796, 0.612);

  float g = clamp(u_gutter, 0.0, 1.0);
  // Split on the seam, so the light changes colour exactly where the panes do.
  float side = smoothstep(g - 0.012, g + 0.012, uv.x);
  vec3 tint = mix(versoLight, rectoLight, side);

  // Pulled back from 0.72: the peaks were bright enough to wash out the
  // orange company line sitting on top of them.
  float strength = mix(0.62, 0.4, side);   // paper takes less light than ink

  // Vignette, so the corners do not compete with the masthead.
  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));

  // The canopy also opens up around the pointer, so the cursor reads as a
  // break in the leaves rather than only as a distortion.
  float bloom = exp(-d2 * 2.4);
  float alpha = clamp(light * strength * (0.35 + 0.65 * vig) * (1.0 + bloom * 0.3), 0.0, 1.0);
  outColor = vec4(tint * alpha, alpha);   // premultiplied
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
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
    // No WebGL2 is not an error. The CSS ground underneath is the design.
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
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);
    gl.clearColor(0, 0, 0, 0);
    // Premultiplied source-over: the light lays over the CSS ground.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uGutter = gl.getUniformLocation(prog, "u_gutter");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    /**
     * Push the size to the GPU. Kept separate from the resize check on purpose.
     *
     * This used to bail out early whenever the canvas dimensions were already
     * correct, which quietly broke the whole effect in development: React
     * StrictMode mounts the effect twice, the second mount reuses the same
     * canvas at the same size, so the freshly linked program never received
     * u_res. It stayed (0, 0), every fragment divided by zero, and the canvas
     * rendered nothing at all. Fine in a production build, invisible in dev.
     */
    const pushSize = (w: number, h: number) => {
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    const resize = () => {
      // Capped DPR: this is a soft, blurred field. Nobody can see the extra pixels.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // Always pushed, never conditionally.
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
      // Ease toward the pointer so the field drifts rather than snapping.
      // Fast enough to feel connected to the hand, slow enough to have weight.
      mouse.x += (target.x - mouse.x) * 0.085;
      mouse.y += (target.y - mouse.y) * 0.085;

      gl.uniform1f(uTime, reduced ? 0 : (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uGutter, read());
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      frame = requestAnimationFrame(draw);
    };

    if (reduced) {
      // One static frame. The light is a texture, not an animation.
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uMouse, 0.5, 0.5);
      gl.uniform1f(uGutter, read());
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      frame = requestAnimationFrame(draw);
    }

    // A backgrounded tab gets no frames; do not burn the GPU or replay the gap.
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
