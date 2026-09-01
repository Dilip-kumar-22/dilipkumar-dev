'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gate, finishExit } from '@/lib/gateStore';
import { buildCardTexture, buildCardBackTexture, CARD_W, CARD_H } from './cardTexture';

/**
 * The entry gate. The site opens on this card: you can push it around with
 * the pointer, flick it to spin, and double-click to enter.
 *
 * It borrows the trading-card grammar because that grammar is instantly
 * readable — one portrait, one big rating, a stat block. Everything printed
 * on it is a real measurement (see cardTexture.ts).
 */

const H = 5.5;
const W = H * (CARD_W / CARD_H);
const EXIT_SECONDS = 1.15;

const cardVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormalW = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const cardFrag = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform sampler2D uBack;
uniform float uOpacity;
uniform float uSweep;   // intro shine pass
uniform float uFoil;    // foil strength, rises with tilt
uniform float uBuild;   // assembly wipe
uniform float uGain;    // pipeline compensation — see the note in the material
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main(){
  // A real card has two faces. Sampling the front texture on the back would
  // show it mirrored, which reads as a rendering bug rather than an object.
  vec4 tex = gl_FrontFacing
    ? texture2D(uMap, vUv)
    : texture2D(uBack, vec2(1.0 - vUv.x, vUv.y));

  // The card assembles as a wipe travelling up its own face, with a lit edge
  // riding the boundary — so it reads as being built, not faded in.
  float build = smoothstep(vUv.y - 0.16, vUv.y + 0.02, uBuild);
  float edge = smoothstep(0.055, 0.0, abs(uBuild - vUv.y)) * (1.0 - step(0.999, uBuild));

  float band = sin((vUv.x * 0.85 + vUv.y) * 5.2 - uSweep * 10.0);
  float shine = smoothstep(0.82, 1.0, band) * uSweep * (1.0 - uSweep * 0.3);

  // Fresnel rim. The interpolated normal always points out of the FRONT face,
  // so on a back-facing fragment it points away from the viewer and the rim
  // solves backwards. gl_FrontFacing is the only thing that can correct it.
  vec3 N = normalize(vNormalW) * (gl_FrontFacing ? 1.0 : -1.0);
  float fres = pow(1.0 - clamp(dot(N, normalize(vViewDir)), 0.0, 1.0), 2.2);

  // a slower foil band that only shows while the card is turned — this is the
  // part that makes it feel like a physical foil card rather than a picture
  float foilBand = sin((vUv.x - vUv.y) * 9.0 + uFoil * 6.0);
  float foil = smoothstep(0.55, 1.0, foilBand) * uFoil;

  vec3 col = tex.rgb * uGain;
  col += vec3(0.62, 0.78, 1.0) * shine * 0.55;
  col += vec3(1.0, 0.70, 0.32) * shine * 0.30;
  col += vec3(0.45, 0.85, 1.0) * foil * 0.16;
  col += vec3(1.0, 0.72, 0.34) * fres * (0.28 + uFoil * 0.5);
  col += vec3(1.0, 0.80, 0.48) * edge * 1.5;

  gl_FragColor = vec4(col, tex.a * uOpacity * build);
}`;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export default function PlayerCard({ reduced }: { reduced: boolean }) {
  const { size } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [back, setBack] = useState<THREE.Texture | null>(null);
  const [dead, setDead] = useState(false);

  const t0 = useRef(0);
  const ptr = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const drag = useRef({ on: false, lastX: 0, spin: 0 });

  useEffect(() => {
    let gone = false;
    buildCardBackTexture()
      .then((t) => !gone && setBack(t))
      .catch((err) => console.error('[card] back build failed:', err));
    buildCardTexture('/portrait.jpg')
      .then((t) => !gone && setTex(t))
      .catch((err) => {
        // Surface it. A silently-swallowed build failure is indistinguishable
        // from "the card is positioned wrong", and costs an hour to tell apart.
        console.error('[card] texture build failed:', err);
      });
    return () => {
      gone = true;
    };
  }, []);

  /* ---------- pointer: tilt, and flick-to-spin ---------- */
  useEffect(() => {
    if (reduced) return;

    const onMove = (e: PointerEvent) => {
      ptr.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      if (drag.current.on) {
        const dx = e.clientX - drag.current.lastX;
        drag.current.lastX = e.clientX;
        drag.current.spin += dx * 0.012;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!gate.active || gate.exiting) return;
      drag.current.on = true;
      drag.current.lastX = e.clientX;
    };
    const onUp = () => {
      drag.current.on = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [reduced]);

  /**
   * Built imperatively rather than declared as <shaderMaterial uniforms={...}>.
   * THREE.ShaderMaterial CLONES the uniforms object it is constructed with, so
   * a memoised object passed as a prop is not the one the material reads —
   * assigning a texture to it renders nothing, with no error. Owning the
   * material means `material.uniforms` is the same object we write to.
   */
  const material = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: null as THREE.Texture | null },
        uBack: { value: null as THREE.Texture | null },
        uOpacity: { value: 0 },
        uSweep: { value: 0 },
        uFoil: { value: 0 },
        uBuild: { value: 0 },
        uGain: { value: 1.45 },
      },
      vertexShader: cardVert,
      fragmentShader: cardFrag,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    // NOTE on brightness. `m.toneMapped = false` does NOT help here: with an
    // EffectComposer the scene renders to a float target and tonemapping is
    // deferred to OutputPass, so the per-material flag never runs. ACES at
    // exposure 0.96 therefore always compresses this card. uGain pre-brightens
    // it so it lands on screen at the value it was authored at on the 2D
    // canvas. It is compensation for a known pipeline stage, not a fudge.
    return m;
  }, []);

  useEffect(() => () => material.dispose(), [material]);

  // one assignment per texture, the moment it resolves
  useEffect(() => {
    if (tex) material.uniforms.uMap.value = tex;
  }, [tex, material]);
  useEffect(() => {
    if (back) material.uniforms.uBack.value = back;
  }, [back, material]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m || !tex) return;
    const u = material.uniforms;

    if (!t0.current) t0.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - t0.current;

    /* ---------- exit: spin, fly past the camera, dissolve ---------- */
    if (gate.exiting) {
      gate.exitT += Math.min(delta, 1 / 30);
      const k = clamp01(gate.exitT / EXIT_SECONDS);
      const e = easeOut(k);

      m.rotation.y += 0.15 + e * 0.24;
      m.rotation.z = Math.sin(k * Math.PI) * 0.2;
      m.position.z = e * 9.6;
      m.position.y = e * 0.7;
      m.scale.setScalar(m.scale.x + delta * 1.9);
      u.uOpacity.value = 1 - easeOut(clamp01((k - 0.28) / 0.72));
      u.uFoil.value = 1.4;

      if (k >= 1) {
        finishExit();
        setDead(true);
      }
      return;
    }

    /* ---------- intro ---------- */
    const build = clamp01((t - 0.3) / 1.1);
    u.uBuild.value = easeOut(build);
    const enter = easeOut(clamp01((t - 0.25) / 1.3));
    u.uOpacity.value = enter;

    // one shine pass once it has assembled
    u.uSweep.value = clamp01((t - 1.25) / 0.8) * (1 - clamp01((t - 2.15) / 0.55));

    // fit to the viewport so a laptop never crops it
    const fit = Math.max(0.58, Math.min(1, (size.height * 0.78) / (H * 108)));

    if (reduced) {
      m.position.set(0, 0, 0);
      m.rotation.set(0, 0, 0);
      m.scale.setScalar(fit);
      u.uBuild.value = 1;
      u.uOpacity.value = 1;
      u.uFoil.value = 0.35;
      return;
    }

    /* ---------- idle play ---------- */
    ptr.current.x += (ptr.current.tx - ptr.current.x) * 0.06;
    ptr.current.y += (ptr.current.ty - ptr.current.y) * 0.06;

    // flick momentum, decaying back toward rest
    if (!drag.current.on) {
      drag.current.spin *= 0.94;
      if (Math.abs(drag.current.spin) < 0.0004) drag.current.spin = 0;
    }
    gate.spin = drag.current.spin;
    gate.dragX = ptr.current.x;
    gate.dragY = ptr.current.y;

    m.rotation.y =
      -1.05 * (1 - enter) + ptr.current.x * 0.5 * enter + drag.current.spin * 5.5;
    m.rotation.x = (-ptr.current.y * 0.34 + Math.sin(t * 0.5) * 0.02) * enter;
    m.rotation.z = (ptr.current.x * -0.06 + Math.sin(t * 0.37) * 0.014) * enter;

    // foil tracks how far it is turned — a card facing you should not shimmer
    const turn = Math.min(1, (Math.abs(m.rotation.y) + Math.abs(m.rotation.x) * 1.4) * 1.5);
    u.uFoil.value = turn * enter;

    m.position.set(
      ptr.current.x * 0.16 * enter,
      -0.55 * (1 - enter) + Math.sin(t * 0.55) * 0.05 * enter,
      -6.5 * (1 - enter),
    );
    m.scale.setScalar((0.9 + 0.1 * enter) * fit);
  });

  if (!tex || dead) return null;

  return (
    <mesh ref={mesh} position={[0, -0.55, -6.5]} renderOrder={3}>
      <planeGeometry args={[W, H, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
