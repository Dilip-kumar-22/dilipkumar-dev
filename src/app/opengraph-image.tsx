import { ImageResponse } from 'next/og';
import { PERSON } from '@/lib/content';

export const alt = `${PERSON.name} — ${PERSON.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Share card. Same palette and same idea as the site: noise resolving to signal. */
export default function OG() {
  const dots = Array.from({ length: 140 }, (_, i) => {
    // deterministic scatter — no Math.random, so the card is stable
    const a = (i * 2654435761) % 4294967296;
    const x = (a % 1200) / 1200;
    const y = ((a >> 8) % 630) / 630;
    const r = 1 + ((a >> 16) % 3);
    return { x: x * 1200, y: y * 630, r, o: 0.10 + ((a >> 20) % 40) / 100 };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#12161d',
          padding: 68,
          position: 'relative',
        }}
      >
        {dots.map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: d.x,
              top: d.y,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: 99,
              background: d.x > 700 ? '#ffab4d' : '#cfe3f2',
              opacity: d.o,
            }}
          />
        ))}

        <div style={{ display: 'flex', fontSize: 21, letterSpacing: 6, color: '#8b98a8' }}>
          {PERSON.role.toUpperCase()}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 104, color: '#f4f7fb', lineHeight: 1.02 }}>
            {PERSON.name}
          </div>
          <div style={{ display: 'flex', fontSize: 34, color: '#ffab4d', marginTop: 14 }}>
            Pre-training a language model from scratch.
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 22, color: '#8b98a8', letterSpacing: 2 }}>
          github.com/Dilip-kumar-22
        </div>
      </div>
    ),
    size,
  );
}
