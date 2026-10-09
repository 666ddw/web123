/* GLSL 着色器字符串。挂到 window 上供 galaxy.jsx 使用。 */
window.GalaxyShaders = {
  VERT: `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,

  FRAG: `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uFocal;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2  uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform float uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRepulsionStrength;
uniform float uMouseActive;
uniform float uAutoCenterRepulsion;
uniform float uTransparent;
uniform float uRotationAngle;

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
  return vec2(hash21(p), hash21(p + 19.19));
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float starShape(vec2 p, float seed, float twinkle) {
  float d = length(p);
  float radius = 0.018 + 0.032 * fract(seed * 91.7);

  float core = 1.0 - smoothstep(0.0, radius, d);
  core = pow(core, 1.6);

  float halo = exp(-d * d / (radius * radius * 7.0)) * 0.38;

  float rw = radius * 0.34;
  float rl = radius * 7.5;
  float rx = (1.0 - smoothstep(0.0, rw, abs(p.x))) * (1.0 - smoothstep(0.0, rl, abs(p.y)));
  float ry = (1.0 - smoothstep(0.0, rw, abs(p.y))) * (1.0 - smoothstep(0.0, rl, abs(p.x)));
  float rays = (rx + ry) * 0.5;

  float glow = core + halo + rays * (0.35 + 0.55 * fract(seed * 37.3)) * (0.35 + uGlowIntensity);

  return glow * twinkle;
}

vec3 starLayer(vec2 uv, float t) {
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  vec3 col = vec3(0.0);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 off = vec2(float(x), float(y));
      vec2 cell = id + off;

      float seed = hash21(cell);
      vec2 rnd = hash22(cell);

      vec2 p = gv - off - (rnd - 0.5) * 0.78;

      float tw = 0.55 + 0.45 * sin(t * (0.8 + seed * 2.6) + seed * 62.83);
      tw = mix(1.0, tw, uTwinkleIntensity);

      float s = starShape(p, seed, tw);

      float hue = fract(uHueShift / 360.0 + seed * 0.42 + rnd.x * 0.06);
      vec3 sc = hsv2rgb(vec3(hue, uSaturation, 1.0));

      s *= smoothstep(1.35, 0.35, length(gv - off));

      col += s * sc;
    }
  }
  return col;
}

void main() {
  vec2 res = uResolution;
  float mn = min(res.x, res.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * res) / mn;

  float ca = cos(uRotationAngle);
  float sa = sin(uRotationAngle);
  uv = mat2(ca, -sa, sa, ca) * uv;

  uv += (uFocal - 0.5) * 0.5;

  float t = uTime * uSpeed * uStarSpeed;

  if (uMouseRepulsion > 0.5) {
    vec2 mp = (uMouse - 0.5) * res / mn;
    vec2 d = uv - mp;
    float dl = length(d) + 0.001;
    float force = uRepulsionStrength * 0.0055 / (dl * dl + 0.02);
    uv += normalize(d) * force * uMouseActive;
  }

  if (uAutoCenterRepulsion > 0.0) {
    float dl = length(uv) + 0.001;
    uv += normalize(uv) * uAutoCenterRepulsion * 0.01 / (dl * dl + 0.05);
  }

  vec3 col = vec3(0.0);
  float scale = 9.0;
  float amp = 1.0;
  float layers = 3.0 + uDensity;

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float w = clamp(layers - fi, 0.0, 1.0);
    vec2 luv = uv * scale + vec2(fi * 13.7, fi * 7.3);
    col += starLayer(luv, t + fi * 3.1) * amp * w;
    scale *= 1.62;
    amp *= 0.72;
  }

  col = pow(max(col, 0.0), vec3(0.92));
  col *= 1.0 + uGlowIntensity * 0.35;

  if (uTransparent > 0.5) {
    float a = clamp(max(max(col.r, col.g), col.b), 0.0, 1.0);
    gl_FragColor = vec4(col, a);
  } else {
    vec3 bg = vec3(0.015, 0.02, 0.045);
    gl_FragColor = vec4(bg + col, 1.0);
  }
}
`,
};