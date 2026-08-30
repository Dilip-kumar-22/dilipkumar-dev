'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { frame } from '@/lib/scrollStore';
import { focus } from '@/lib/focusStore';
import { PALETTE, oklchToRGB } from '@/lib/oklch';
import { fieldVertex, fieldFragment } from './glsl';
import {
  noiseCloud,
  textPoints,
  swissRoll,
  constellation,
  convergedRing,
  randoms,
} from './targets';

/**
 * Each target shape is anchored to the section it belongs to, so the field
 * always resolves in sync with what you are reading — the name appears while
 * you are on Identity, the constellation while you are on Work. Measured at
 * runtime because section heights depend on viewport and text wrapping.
 */
const ANCHORS = ['boot', 'identity', 'signal', 'work', 'convergence'] as const;

/** Fallback for routes without those sections (e.g. case studies). */
const DEFAULT_STOPS = [0.0, 0.17, 0.4, 0.66, 0.93];

function measureStops(): number[] {
  if (typeof document === 'undefined') return [...DEFAULT_STOPS];
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return [...DEFAULT_STOPS];

  const out: number[] = [];
  for (const id of ANCHORS) {
    const el = document.getElementById(id);
    if (!el) return [...DEFAULT_STOPS];
    // progress at which this section sits mid-viewport
    const center = el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2;
    out.push(Math.min(1, Math.max(0, center / max)));
  }
  // guarantee monotonic, strictly increasing stops
  for (let i = 1; i < out.length; i++) {
    if (out[i] <= out[i - 1]) out[i] = Math.min(1, out[i - 1] + 0.02);
  }
  return out;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Crossfade weights across the five targets. Always sums to 1. */
function weights(p: number, stops: number[], out: number[]) {
  out.fill(0);

  if (p <= stops[0]) {
    out[0] = 1;
    return out;
  }
  if (p >= stops[4]) {
    out[4] = 1;
    return out;
  }

  for (let i = 0; i < stops.length - 1; i++) {
    if (p >= stops[i] && p <= stops[i + 1]) {
      const k = smoothstep(stops[i], stops[i + 1], p);
      out[i] = 1 - k;
      out[i + 1] = k;
      return out;
    }
  }
  return out;
}

const col = (c: readonly [number, number, number]) => {
  const [r, g, b] = oklchToRGB(c);
  return new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace);
};

export default function ParticleField({ reduced }: { reduced: boolean }) {
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Points>(null);
  const w = useRef([1, 0, 0, 0, 0]);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const ndc = useRef(new THREE.Vector2(0, 0));
  const active = useRef(0);
  const mouseWorld = useRef(new THREE.Vector3(999, 999, 999));
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const stops = useRef<number[]>([...DEFAULT_STOPS]);

  // Anchor the morph to the real section positions, and re-measure whenever
  // the layout can change (resize, font swap, late-mounting content).
  useEffect(() => {
    const remeasure = () => {
      stops.current = measureStops();
    };
    remeasure();
    const t1 = setTimeout(remeasure, 400);
    const t2 = setTimeout(remeasure, 1600);
    window.addEventListener('resize', remeasure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', remeasure);
    };
  }, []);

  // Particle budget scales with the device. A phone gets a real scene, not a
  // dropped-frame version of the desktop one.
  const COUNT = useMemo(() => {
    if (typeof window === 'undefined') return 24_000;
    // ?n=<count> — profiling override, so particle cost can be isolated
    const q = Number(new URLSearchParams(window.location.search).get('n'));
    if (q > 0) return Math.min(200_000, Math.round(q));
    const w = window.innerWidth;
    if (w < 640) return 14_000;
    if (w < 1024) return 26_000;
    return 42_000;
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p0 = noiseCloud(COUNT);
    g.setAttribute('position', new THREE.BufferAttribute(p0.slice(), 3));
    g.setAttribute('aP0', new THREE.BufferAttribute(p0, 3));
    g.setAttribute('aP1', new THREE.BufferAttribute(textPoints(COUNT, 'DILIP KUMAR'), 3));
    g.setAttribute('aP2', new THREE.BufferAttribute(swissRoll(COUNT), 3));
    g.setAttribute('aP3', new THREE.BufferAttribute(constellation(COUNT), 3));
    g.setAttribute('aP4', new THREE.BufferAttribute(convergedRing(COUNT), 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(randoms(COUNT), 1));
    // The shader ignores `position`, so a computed sphere keeps frustum
    // culling from removing the field when the camera dollies.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 16);
    return g;
  }, [COUNT]);

  const uniforms = useMemo(
    () => ({
      uW0: { value: 1 },
      uW1: { value: 0 },
      uW2: { value: 0 },
      uW3: { value: 0 },
      uW4: { value: 0 },
      uTime: { value: 0 },
      uTurb: { value: 0.9 },
      // Point size is multiplied by (300/-z) in the shader, so at z≈10 this
      // resolves to ~1–3px. It must stay small: with additive blending, 60k
      // points at 60px each is ~200M overdrawn pixels/frame and the scene
      // collapses to single-digit fps on integrated graphics.
      uSize: { value: 0.06 },
      uDpr: { value: 1 },
      uVel: { value: 0 },
      uConverge: { value: 0 },
      uOpacity: { value: 1.0 },
      uCold: { value: col(PALETTE.ice) },
      uWarm: { value: col(PALETTE.signal) },
      uMouse: { value: new THREE.Vector3(999, 999, 999) },
      uMouseAmt: { value: 0 },
      uFocus: { value: new THREE.Vector3() },
      uFocusAmt: { value: 0 },
      uResolve: { value: 1 },
    }),
    [],
  );

  // pointer parallax + cursor wake
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      ndc.current.set(pointer.current.tx, pointer.current.ty);
      active.current = 1;
    };
    const onLeave = () => (active.current = 0);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  useFrame((state) => {
    const m = matRef.current;
    if (!m) return;

    const p = frame.progress;
    const u = m.uniforms;

    weights(p, stops.current, w.current);
    u.uW0.value = w.current[0];
    u.uW1.value = w.current[1];
    u.uW2.value = w.current[2];
    u.uW3.value = w.current[3];
    u.uW4.value = w.current[4];
    // how locked-in the current shape is — 1.0 means a target is fully formed
    u.uResolve.value = Math.max(...w.current);

    u.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    u.uConverge.value = p;
    // The field calms as the run converges — AND collapses to near-zero
    // whenever a target shape is fully formed. Without this the curl noise
    // smears the resolved name back into debris at exactly the moment it is
    // supposed to be legible.
    const lock = smoothstep(0.7, 1.0, u.uResolve.value as number);
    const drift = 0.86 * Math.pow(1 - p, 1.6) + 0.045;
    u.uTurb.value = reduced ? 0 : drift * (1 - lock * 0.9);
    u.uVel.value = reduced ? 0 : THREE.MathUtils.clamp(frame.velocity, -60, 60);
    u.uDpr.value = Math.min(window.devicePixelRatio || 1, 2);
    // fewer particles on small screens, so each one reads slightly larger.
    // ~0.10 lands points at 2–4px: visible as a field, still far below the
    // fill-rate cliff that 60px points caused. See LESSONS [3D].
    u.uSize.value = size.width < 640 ? 0.13 : 0.085;

    // ---- cursor wake: unproject the pointer onto the z=0 plane ----
    if (!reduced) {
      ray.setFromCamera(ndc.current, state.camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        mouseWorld.current.lerp(hit, 0.16); // eased, so the wake has weight
      }
      (u.uMouse.value as THREE.Vector3).copy(mouseWorld.current);
      u.uMouseAmt.value += (active.current - u.uMouseAmt.value) * 0.08;
    }

    // ---- project focus (set by DOM hover, read here) ----
    focus.amt += ((focus.slug ? 1 : 0) - focus.amt) * 0.09;
    (u.uFocus.value as THREE.Vector3).set(focus.pos[0], focus.pos[1], focus.pos[2]);
    u.uFocusAmt.value = reduced ? 0 : focus.amt;

    // camera: a slow dolly in, plus eased pointer parallax
    const cam = state.camera;
    // Ends at 7.6, not 5.6 — far enough back that the converged ring closes
    // inside the frame instead of running off the top and bottom edges.
    const zTarget = 10.4 + (7.6 - 10.4) * smoothstep(0, 1, p);
    cam.position.z += (zTarget - cam.position.z) * 0.045;

    if (!reduced) {
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.045;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.045;
      cam.position.x = pointer.current.x * 0.55;
      cam.position.y = pointer.current.y * 0.4;
    }
    cam.lookAt(0, 0, 0);

    // the whole field rotates slowly through the run
    if (groupRef.current && !reduced) {
      groupRef.current.rotation.y = p * 0.9 + state.clock.elapsedTime * 0.012;
    }
  });

  return (
    <points ref={groupRef} frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={fieldVertex}
        fragmentShader={fieldFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
