/**
 * Legibility scrim — sits between the 3D field (z-0) and the content (z-10).
 *
 * Not a flat dim: it is weighted toward the reading column so the type has a
 * calm ground, while the right side stays open and the field can breathe.
 * Without this the particle field wins every contrast fight and the page
 * becomes unreadable.
 */
export default function Scrim() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{
        background: [
          // top/bottom grounding so sections don't float
          'linear-gradient(180deg, oklch(0.145 0.018 250 / 0.88) 0%, oklch(0.145 0.018 250 / 0.10) 22%, oklch(0.145 0.018 250 / 0.10) 78%, oklch(0.145 0.018 250 / 0.88) 100%)',
          // reading column: heavy left, open right
          'linear-gradient(96deg, oklch(0.145 0.018 250 / 0.90) 0%, oklch(0.145 0.018 250 / 0.78) 44%, oklch(0.145 0.018 250 / 0.44) 74%, oklch(0.145 0.018 250 / 0.16) 100%)',
        ].join(','),
      }}
    />
  );
}
