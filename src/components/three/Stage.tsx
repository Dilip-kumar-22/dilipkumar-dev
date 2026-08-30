'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { PerformanceMonitor } from '@react-three/drei';

import * as THREE from 'three';
import { useEffect, useState } from 'react';
import ParticleField from './ParticleField';
import { RENDER } from '@/lib/oklch';
import { prefersReducedMotion } from '@/lib/scrollStore';

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The 3D backdrop. Fixed behind all content — the text is real DOM, so the
 * site stays readable, selectable and indexable with the canvas removed.
 */
export default function Stage() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  // Real isolation switches for the profiler. `canvas{display:none}` only
  // hides the canvas — R3F keeps rendering — so every isolation run needs a
  // toggle that actually removes the work. See LESSONS [3D].
  const [fx, setFx] = useState(true);
  // Points are soft round sprites — MSAA buys almost nothing visually here
  // and costs ~30% of the frame on integrated graphics. Bloom hides the rest.
  const [msaa, setMsaa] = useState(0);
  // Start conservative and let PerformanceMonitor climb. Starting at max DPR
  // means the first seconds — the hero, the part everyone sees — are the
  // slowest, which is exactly backwards.
  const [dpr, setDpr] = useState<number>(1.25);
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    setOk(webglAvailable());
    setReduced(prefersReducedMotion());
    const q = new URLSearchParams(window.location.search);
    if (q.get('fx') === '0') setFx(false);
    const m = q.get('msaa');
    if (m !== null) setMsaa(Number(m) || 0);
  }, []);

  // No WebGL (or still deciding): a static field that matches the scene's
  // palette, so the page never flashes an empty black rectangle.
  if (ok === false || ok === null) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(1100px 620px at 50% 38%, oklch(0.26 0.045 235 / 0.55), transparent 68%),' +
            'radial-gradient(760px 520px at 74% 76%, oklch(0.30 0.075 68 / 0.28), transparent 70%),' +
            'var(--color-ground)',
        }}
      />
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        // reduced motion still gets the scene — it simply stops moving
        frameloop={reduced ? 'demand' : 'always'}
        dpr={dpr}
        gl={{
          antialias: false, // the composer does MSAA
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        camera={{ fov: 42, near: 0.1, far: 120, position: [0, 0, 10.4] }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = RENDER.exposure;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.background = new THREE.Color('#12161d');
          // LESSON [3D]: assert the scene actually got populated instead of
          // trusting the wiring — an empty canvas is a silent failure.
          if (process.env.NODE_ENV === 'development') {
            requestAnimationFrame(() =>
              console.info('[stage] scene children:', scene.children.length),
            );
          }
        }}
      >
        {/* Adaptive quality: on a GPU that cannot hold the frame budget, drop
            resolution first and post-processing second, rather than shipping
            everyone a stuttering scene. Measured on Intel UHD, where a
            composited WebGL canvas alone caps at ~30fps. */}
        <PerformanceMonitor
          bounds={() => [45, 60]}
          onDecline={() => {
            // Resolution goes first. Post-processing is only dropped once
            // resolution has bottomed out, so a brief dip doesn't
            // permanently strip the look.
            setDpr((d) => {
              const next = Math.max(1, +(d - 0.25).toFixed(2));
              if (next <= 1 && d <= 1) setDegraded(true);
              return next;
            });
          }}
          onIncline={() => setDpr((d) => Math.min(RENDER.maxDpr, +(d + 0.25).toFixed(2)))}
        />

        <ParticleField reduced={reduced} />

        {fx && !degraded && (
        <EffectComposer
          multisampling={msaa}
          frameBufferType={THREE.HalfFloatType}
          enableNormalPass={false}
        >
          {/* LESSON [3D]: threshold stays ≥0.9 and intensity low, or the hero
              washes to white. Verified on screenshot — do not raise blindly. */}
          <Bloom
            intensity={RENDER.bloom.intensity}
            luminanceThreshold={RENDER.bloom.threshold}
            luminanceSmoothing={0.22}
            radius={RENDER.bloom.radius}
            mipmapBlur
            // Bloom runs on a half-resolution buffer. It is a wide, soft glow —
            // nobody can see the difference, and the blur chain is the single
            // most expensive thing in the frame (27fps → 123fps without post).
            resolutionScale={0.5}
          />
          <Vignette offset={0.28} darkness={0.62} eskil={false} />
          {/* No in-scene Noise pass: the CSS `.grain` layer already covers the
              whole page (canvas included), so a second full-screen noise pass
              cost ~8fps on integrated graphics for no visible gain. */}
        </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
