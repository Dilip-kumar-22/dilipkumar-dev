/**
 * GLSL for the NOISE → SIGNAL field.
 *
 * The field never stops being one continuous object. Five target shapes are
 * uploaded once as attributes; a weight vector (summing to 1) blends between
 * them, so morphing costs one weighted sum in the vertex shader and zero
 * buffer re-uploads.
 *
 *   0  gaussian noise      — an untrained model
 *   1  the name            — the first thing that resolves
 *   2  swiss-roll manifold — the canonical manifold-learning shape
 *   3  constellation       — projects as clusters in latent space
 *   4  converged ring      — the run settles
 */

/** Ashima 3D simplex noise (public domain) — carried over from ORBIT. */
export const SIMPLEX = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0,0.5,1.0,2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0; vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m*m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Turbulent flow field.
//
// A true curl needs 6 snoise() evaluations (central differences on 3 axes).
// At 42k vertices that is ~250k noise evaluations per frame, which pushed
// frame time just past 16.7ms on integrated graphics — and "just past" costs
// you HALF the framerate, because the compositor drops to every-other-vsync.
// Three decorrelated samples give a visually equivalent swirling field for
// half the cost. Divergence-free is not a requirement here; looking like
// fluid is. LESSON [3D].
vec3 flowField(vec3 p){
  float a = snoise(p);
  float b = snoise(p + vec3(31.7, 11.3, 47.1));
  float c = snoise(p + vec3(-19.4, 63.8, -7.2));
  return normalize(vec3(a - b, b - c, c - a) + vec3(1e-5));
}
`;

export const fieldVertex = /* glsl */ `
attribute vec3 aP0;
attribute vec3 aP1;
attribute vec3 aP2;
attribute vec3 aP3;
attribute vec3 aP4;
attribute float aRand;

uniform float uW0, uW1, uW2, uW3, uW4;
uniform float uTime;
uniform float uTurb;     // turbulence — high while noisy, ~0 once converged
uniform float uSize;
uniform float uDpr;
uniform float uVel;      // scroll velocity, adds drag
uniform float uConverge; // 0..1, drives colour temperature in the fragment
uniform vec3  uMouse;    // cursor, unprojected onto the z=0 plane
uniform float uMouseAmt; // 0 when the pointer is idle/absent
uniform vec3  uFocus;    // a project cluster being hovered
uniform float uFocusAmt;

varying float vRand;
varying float vConv;
varying float vDepth;
varying float vHot;      // extra brightness from interaction

${SIMPLEX}

void main(){
  vRand = aRand;
  vConv = uConverge;

  // one weighted sum — no branching, no buffer re-uploads
  vec3 p = aP0 * uW0 + aP1 * uW1 + aP2 * uW2 + aP3 * uW3 + aP4 * uW4;

  // Fluid drift. Amplitude falls as the run converges, so early scroll feels
  // unstable and the end feels settled.
  float amp = uTurb * (0.45 + aRand * 0.75);
  vec3 flow = flowField(p * 0.28 + vec3(0.0, 0.0, uTime * 0.08));
  p += flow * amp;

  // a little breathing, even at rest
  p += flow * sin(uTime * 0.6 + aRand * 12.0) * 0.035 * (0.4 + uTurb);

  // fast scroll smears the field along its own flow
  p += flow * uVel * 0.012 * (0.3 + aRand);

  // ---- cursor wake: the pointer pushes a hole through the field ----
  vec3 toM = p - uMouse;
  float dm2 = dot(toM, toM);
  float infl = exp(-dm2 * 0.10) * uMouseAmt;
  p += normalize(toM + vec3(1e-5)) * infl * 1.35;

  // ---- focus: hovering a project pulls its neighbourhood in ----
  vec3 toF = uFocus - p;
  float df2 = dot(toF, toF);
  float near = exp(-df2 * 0.09) * uFocusAmt;
  p += toF * near * 0.30;

  // interaction makes particles glow, so the effect is felt not just seen
  vHot = clamp(infl * 1.5 + near * 1.2, 0.0, 1.6);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = -mv.z;

  // uSize is a SCALE, not pixels — the (300/-z) term multiplies it ~30×.
  // Keep it small (~0.08) so points land at 2–4px. See LESSONS [3D].
  float ps = uSize * uDpr * (300.0 / max(0.001, -mv.z)) * (0.55 + aRand * 0.8) * (1.0 + vHot * 0.9);
  // Clamp: without this, particles that drift near the camera balloon into
  // huge soft blobs that read as dirt on the lens and wreck text legibility.
  gl_PointSize = clamp(ps, 0.6, 7.0);
  gl_Position = projectionMatrix * mv;
}
`;

export const fieldFragment = /* glsl */ `
precision highp float;

uniform vec3 uCold;   // noise  — instrument cyan / ice
uniform vec3 uWarm;   // signal — sodium amber
uniform float uTime;
uniform float uOpacity;
uniform float uResolve;   // 1.0 when the current target shape is fully formed

varying float vRand;
varying float vConv;
varying float vDepth;
varying float vHot;

void main(){
  // round, soft point
  vec2 uv = gl_PointCoord - 0.5;
  float d = dot(uv, uv);
  if (d > 0.25) discard;
  float a = smoothstep(0.25, 0.0, d);

  // temperature follows convergence: cold noise resolves to warm signal.
  // Per-particle jitter so the transition isn't a flat crossfade.
  float t = clamp(vConv * 1.25 - 0.12 + (vRand - 0.5) * 0.34, 0.0, 1.0);
  vec3 col = mix(uCold, uWarm, t);

  // touched particles run hot toward the signal colour
  col = mix(col, uWarm, clamp(vHot * 0.7, 0.0, 1.0));

  float tw = 0.68 + 0.32 * sin(uTime * 1.5 + vRand * 42.0);
  float fade = smoothstep(30.0, 4.0, vDepth);   // depth cue

  // A wide luminance spread: most particles sit well under the 0.92 bloom
  // threshold so only the rare bright ones bloom. LESSON [3D]: a flat, high
  // luminance here is what washes a hero to white.
  // The pow() keeps the majority dim, so the field reads as depth rather
  // than as static — a uniformly-lit cloud looks like snow, not a manifold.
  // A shape that has fully locked in gets a lift, so "the name resolves" is
  // an event you can see rather than something you have to be told about.
  float lock = smoothstep(0.72, 1.0, uResolve);
  float lum = (0.16 + pow(vRand, 3.0) * 1.25) * tw * fade
            * (1.0 + vHot * 1.4) * (1.0 + lock * 0.85);

  gl_FragColor = vec4(col * lum, a * uOpacity * fade);
}
`;
