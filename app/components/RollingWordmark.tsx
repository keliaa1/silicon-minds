"use client";

import { useEffect, useRef } from "react";

/**
 * Wordmark set on a twisted, four-faced drum. Faces alternate solid and outline
 * and roll downward, so each column of the word always shows one face leaving
 * through the bottom while its opposite arrives from the top. The roll lags
 * from left to right, which is what makes the two states trade places across
 * the horizontal axis.
 *
 * Both faces are rasterised once into a texture (solid in red, outline in
 * green); a fragment shader does the per-pixel warp.
 */

const FACE_SECONDS = 5 / 3;
/** Faces of roll lag between the first and last column of a line. */
const TWIST = 1.33;
/** Stack height when one face is square-on, relative to when two faces share it. */
const FACE_ON = 0.8;
const ROLL_EASE = 0.6;
const WAVE = 0.05;
const WAVE_LENGTHS = 0.75;
const LEAN = 1.1;
const MAX_SLOPE = 0.4;
const STROKE_EM = 0.011;
const MAX_STRETCH = 1.3;
const STACK_FILL = 0.86;
/** Stack `stacked` lines once the box is at least this tall relative to its width. */
const STACK_ASPECT = 0.8;
const MAX_DPR = 2;

const glsl = (value: number) => value.toFixed(5);

const VERTEX_SHADER = `#version 300 es
void main() {
  gl_Position = vec4(vec2(gl_VertexID & 1, gl_VertexID >> 1) * 4.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uFaces;
uniform vec3 uColor;
uniform float uCanvasHeight, uLeft, uCentre, uWidth, uStack;
uniform float uRoll, uOffset, uTwist, uWave;
out vec4 outColor;

const float PI = 3.14159265;

void span(float face, float u, out float top, out float bottom) {
  float progress = clamp(uRoll + uOffset - uTwist * u - face, 0.0, 2.0);
  bool entering = progress <= 1.0;
  float f = entering ? progress : progress - 1.0;
  float halfHeight = uStack * 0.5 * (${glsl(FACE_ON)} + ${glsl(1 - FACE_ON)} * sin(PI * f));
  float centre = uCentre + uWave * sin(2.0 * PI * (u * ${glsl(WAVE_LENGTHS)} - uRoll * 0.5));
  float eased = mix(f, f * f * (3.0 - 2.0 * f), ${glsl(ROLL_EASE)});
  float split = centre - halfHeight + 2.0 * halfHeight * eased;
  top = entering ? centre - halfHeight : split;
  bottom = entering ? split : centre + halfHeight;
}

void main() {
  float x = gl_FragCoord.x - uLeft;
  float y = uCanvasHeight - gl_FragCoord.y;
  float u = clamp(x / uWidth, 0.0, 1.0);

  float face = floor(uRoll + uOffset - uTwist * u);
  float top, bottom;
  span(face, u, top, bottom);
  if (y >= bottom) {
    face -= 1.0;
    span(face, u, top, bottom);
  }
  float height = bottom - top;
  if (y < top || y > bottom || height < 0.5) discard;

  float beforeTop, beforeBottom, afterTop, afterBottom;
  const float du = 0.002;
  span(face, u - du, beforeTop, beforeBottom);
  span(face, u + du, afterTop, afterBottom);
  float slope = (afterTop + afterBottom - beforeTop - beforeBottom) / (4.0 * du * uWidth);
  slope = clamp(slope, ${glsl(-MAX_SLOPE)}, ${glsl(MAX_SLOPE)});

  vec2 uv = vec2(
    (x + slope * ${glsl(LEAN)} * (y - (top + bottom) * 0.5)) / uWidth,
    (y - top) / height
  );
  vec4 faces = textureGrad(uFaces, uv, vec2(1.0 / uWidth, 0.0), vec2(0.0, 1.0 / height));
  float mask = mod(face, 2.0) < 0.5 ? faces.r : faces.g;
  outColor = vec4(uColor * mask, mask);
}`;

const UNIFORMS = [
  "uColor",
  "uCanvasHeight",
  "uLeft",
  "uCentre",
  "uWidth",
  "uStack",
  "uRoll",
  "uOffset",
  "uTwist",
  "uWave",
] as const;

type Uniform = (typeof UNIFORMS)[number];

type Line = { text: string; size: number; x: number; y: number; stack: number; offset: number };

function fontAt(size: number, family: string) {
  return `800 expanded ${size}px ${family}`;
}

function context2d() {
  return document.createElement("canvas").getContext("2d")!;
}

function inkWidth(metrics: TextMetrics) {
  return metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
}

function layoutLines(texts: string[], width: number, height: number, family: string): Line[] {
  const probe = context2d();
  probe.font = fontAt(100, family);
  const widest = Math.max(...texts.map((text) => inkWidth(probe.measureText(text))));
  const size = Math.floor((width / widest) * 96);
  const rowHeight = height / texts.length;
  probe.font = fontAt(size, family);

  const measured = texts.map((text) => {
    const ink = probe.measureText(text);
    const inkHeight = ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent;
    return {
      text,
      x: (width - inkWidth(ink)) / 2,
      stack: Math.min((inkHeight * MAX_STRETCH) / FACE_ON, rowHeight * STACK_FILL),
    };
  });

  const pitch = Math.min(rowHeight, Math.max(...measured.map((row) => row.stack)) / STACK_FILL);
  const firstY = (height - pitch * (texts.length - 1)) / 2;

  return measured.map((row, index) => ({
    ...row,
    size,
    y: firstY + pitch * index,
    offset: 1 + TWIST / 2 + index * 0.5,
  }));
}

/** Rasterises a line to a canvas with the solid face in red and the outline in green. */
function rasterise(line: Line, family: string) {
  const font = fontAt(line.size, family);
  const probe = context2d();
  probe.font = font;
  const ink = probe.measureText(line.text);
  const stroke = Math.max(1.25, line.size * STROKE_EM);
  const pad = Math.ceil(stroke * 2);

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(inkWidth(ink)) + pad * 2;
  canvas.height = Math.ceil(ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent) + pad * 2;
  const ctx = canvas.getContext("2d")!;
  const x = pad + ink.actualBoundingBoxLeft;
  const y = pad + ink.actualBoundingBoxAscent;

  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "lighter";
  ctx.font = font;
  ctx.fillStyle = "#f00";
  ctx.fillText(line.text, x, y);
  ctx.strokeStyle = "#0f0";
  ctx.lineWidth = stroke;
  ctx.lineJoin = "round";
  ctx.strokeText(line.text, x, y);
  return { canvas, pad };
}

function createRenderer(gl: WebGL2RenderingContext) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const location = Object.fromEntries(
    UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]),
  ) as Record<Uniform, WebGLUniformLocation | null>;
  const anisotropy = gl.getExtension("EXT_texture_filter_anisotropic");

  type Row = { texture: WebGLTexture; line: Line; left: number; width: number };
  let rows: Row[] = [];

  const clearRows = () => {
    rows.forEach((row) => gl.deleteTexture(row.texture));
    rows = [];
  };

  return {
    setLines(lines: Line[], family: string, color: number[]) {
      clearRows();
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform3f(location.uColor, color[0] / 255, color[1] / 255, color[2] / 255);
      gl.uniform1f(location.uCanvasHeight, gl.drawingBufferHeight);
      rows = lines.map((line) => {
        const { canvas, pad } = rasterise(line, family);
        const texture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (anisotropy) {
          gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT, 8);
        }
        return { texture, line, left: line.x - pad, width: canvas.width };
      });
    },
    draw(time: number, still: boolean) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(location.uRoll, time / FACE_SECONDS);
      gl.uniform1f(location.uTwist, still ? 0 : TWIST);
      for (const { texture, line, left, width } of rows) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1f(location.uLeft, left);
        gl.uniform1f(location.uCentre, line.y);
        gl.uniform1f(location.uWidth, width);
        gl.uniform1f(location.uStack, line.stack);
        gl.uniform1f(location.uOffset, still ? 1 : line.offset);
        gl.uniform1f(location.uWave, still ? 0 : WAVE * line.stack);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    },
    dispose: clearRows,
  };
}

/** Plain solid wordmark for browsers without WebGL2. */
function drawFallback(canvas: HTMLCanvasElement, lines: Line[], family: string, color: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  for (const line of lines) {
    ctx.font = fontAt(line.size, family);
    ctx.fillText(line.text, line.x, line.y);
  }
}

export function RollingWordmark({
  text,
  stacked,
  className = "",
}: {
  text: string;
  /** Lines to use instead of `text` in tall, narrow containers. */
  stacked?: string[];
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false, powerPreference: "low-power" });
    let renderer = gl && createRenderer(gl);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = getComputedStyle(canvas);
    let frame = 0;
    let visible = true;
    let disposed = false;
    const start = performance.now();

    const paint = (now: number) => renderer?.draw(still ? 0 : (now - start) / 1000, still);

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const box = canvas.getBoundingClientRect();
      if (!box.width || !box.height) return;
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
      const texts = stacked && box.height / box.width >= STACK_ASPECT ? stacked : [text];
      const lines = layoutLines(texts, canvas.width, canvas.height, styles.fontFamily);
      if (renderer) {
        renderer.setLines(lines, styles.fontFamily, styles.color.match(/\d+/g)!.map(Number));
        paint(performance.now());
      } else {
        drawFallback(canvas, lines, styles.fontFamily, styles.color);
      }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (visible) paint(now);
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      renderer = null;
    };
    const onContextRestored = () => {
      renderer = gl && createRenderer(gl);
      measure();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    const resize = new ResizeObserver(measure);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    document.fonts.load(fontAt(100, styles.fontFamily), text).then(() => {
      if (disposed) return;
      resize.observe(canvas);
      intersection.observe(canvas);
      measure();
      canvas.dataset.ready = "true";
      if (!still && renderer) frame = requestAnimationFrame(tick);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      renderer?.dispose();
    };
  }, [text, stacked]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
