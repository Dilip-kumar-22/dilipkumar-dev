import { ImageResponse } from 'next/og';
import { PERSON } from '@/lib/content';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${PERSON.name} — ${PERSON.role}`;

/**
 * The share card. This is the first thing a recruiter sees when the link is
 * pasted into Slack or LinkedIn, so it carries the same idea as the site:
 * a loss curve descending, cold ground, one amber signal.
 */
export default function OpengraphImage() {
  // a believable descending loss curve, drawn as an SVG path
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    const x = 60 + u * 1080;
    const noise = Math.sin(i * 2.3) * 10 * Math.exp(-2.2 * u);
    const y = 250 + (1 - (0.42 + 3.6 * Math.exp(-5.2 * u)) / 4.2) * 250 + noise;
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }

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
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#8a8f99',
            }}
          >
            noise → signal
          </div>
          <div style={{ display: 'flex', fontSize: 20, color: '#f0a339', letterSpacing: 3 }}>
            loss 0.438
          </div>
        </div>

        <svg
          width="1080"
          height="200"
          viewBox="0 60 1200 460"
          style={{ position: 'absolute', left: 60, top: 180, opacity: 0.55 }}
        >
          <path d={pts.join(' ')} fill="none" stroke="#f0a339" strokeWidth="4" strokeLinecap="round" />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 96, color: '#f4f5f7', lineHeight: 1.05 }}>
            {PERSON.name}
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#f0a339', marginTop: 14 }}>
            {PERSON.role} · pre-training a 200M-parameter model from scratch
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              color: '#8a8f99',
              marginTop: 26,
              letterSpacing: 2,
            }}
          >
            Rust · PyTorch · on-device inference · multi-agent systems
          </div>
        </div>
      </div>
    ),
    size,
  );
}
