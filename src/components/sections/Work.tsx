'use client';

import Link from 'next/link';
import { PROJECTS, type Project } from '@/lib/content';
import { setFocus } from '@/lib/focusStore';
import DenoiseText from '@/components/DenoiseText';
import ProjectMedia from '@/components/ProjectMedia';

const STATUS_STYLE: Record<Project['status'], string> = {
  public: 'text-instr border-instr-dim/40',
  beta: 'text-signal border-signal-deep',
  private: 'text-low border-line',
  roadmap: 'text-low border-line',
};

/** Window-bar label per project, so the chrome reads as the real thing. */
const CHROME_LABEL: Record<string, string> = {
  bolo: 'Bolo — v0.10.0',
  's-corp': 'S-CORP — v13 · SPARK',
  friday: 'FRIDAY — pwsh · F-OS 1.0.0',
  'typing-master': 'dilip-kumar-22.github.io/typing-master-scorp',
  orbit: 'dilip-kumar-22.github.io/orbit',
  shanghai: 'dilip-kumar-22.github.io/shanghai-48h',
};

function Band({ p, i }: { p: Project; i: number }) {
  const media = p.media?.[0];
  // alternate which side the capture sits on, so the column has rhythm
  const mediaFirst = i % 2 === 1;

  return (
    <article
      onMouseEnter={() => setFocus(p.slug)}
      onMouseLeave={() => setFocus(null)}
      className="group border-t border-line-soft py-16 md:py-24"
    >
      <div
        className={`grid items-center gap-10 lg:gap-16 ${
          media ? 'lg:grid-cols-[1fr_1.15fr]' : 'lg:grid-cols-1'
        }`}
      >
        {/* ---------- the capture ---------- */}
        {media && (
          <div
            className={`reveal ${mediaFirst ? 'lg:order-1' : 'lg:order-2'}`}
            style={{ willChange: 'opacity, transform' }}
          >
            <ProjectMedia
              item={media}
              label={CHROME_LABEL[p.slug] ?? p.name}
              priority={i === 0}
            />
          </div>
        )}

        {/* ---------- the words ---------- */}
        <div className={mediaFirst ? 'lg:order-2' : 'lg:order-1'}>
          <div className="reveal flex flex-wrap items-center gap-4">
            <span className="t-data text-[0.7rem] text-signal-deep">{p.index}</span>
            <span
              className={`t-data whitespace-nowrap border px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.14em] ${STATUS_STYLE[p.status]}`}
            >
              {p.statusLabel}
            </span>
            <span className="t-data text-[0.68rem] text-low">{p.year}</span>
          </div>

          <h3
            className="reveal reveal-1 t-display mt-5 text-hi transition-colors duration-500 group-hover:text-signal"
            style={{ fontSize: 'clamp(2rem, 4.6vw, 3.6rem)' }}
          >
            {p.name}
          </h3>
          <p className="reveal reveal-1 mt-2 text-lg text-mid">{p.tagline}</p>
          <p className="reveal reveal-2 t-body mt-5 !max-w-[54ch] text-sm">{p.summary}</p>

          {/* the numbers are the strongest thing on the page — show them here */}
          <dl className="reveal reveal-3 mt-7 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {p.facts.map((f) => (
              <div key={f.label}>
                <dt className="t-label !text-[0.55rem]">{f.label}</dt>
                <dd className="t-data mt-1 text-[0.95rem] text-hi">{f.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="reveal reveal-4 mt-7 flex flex-wrap gap-x-4 gap-y-1">
            {p.stack.map((sTech) => (
              <li key={sTech} className="t-data text-[0.68rem] text-low">
                {sTech}
              </li>
            ))}
          </ul>

          <div className="reveal reveal-5 mt-8 flex flex-wrap items-center gap-5">
            <Link
              href={`/work/${p.slug}`}
              onFocus={() => setFocus(p.slug)}
              onBlur={() => setFocus(null)}
              className="t-data border border-line px-5 py-2.5 text-[0.78rem] text-hi transition-colors duration-300 hover:border-signal hover:text-signal"
            >
              Read the case study →
            </Link>
            {p.download && (
              <a
                href={p.download}
                target="_blank"
                rel="noreferrer noopener"
                className="t-data text-[0.72rem] text-signal underline-offset-4 hover:underline"
              >
                Download for Windows
              </a>
            )}
            {p.live && (
              <a
                href={p.live}
                target="_blank"
                rel="noreferrer noopener"
                className="t-data text-[0.72rem] text-instr underline-offset-4 hover:underline"
              >
                Open it live
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative shell py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="t-label reveal">epoch 04 — work</span>
            <DenoiseText
              as="h2"
              text="Things that exist"
              className="t-display mt-6 block text-[clamp(2.2rem,5vw,4rem)] text-hi"
            />
          </div>
          <p className="reveal reveal-2 max-w-sm text-sm leading-relaxed text-low">
            Every capture below is the real thing running — recorded from the
            actual app, not mocked up. Two are open source and downloadable
            today. Hover a project to find it in the field behind this text.
          </p>
        </div>

        <div>
          {PROJECTS.map((p, i) => (
            <Band key={p.slug} p={p} i={i} />
          ))}
          <div className="border-t border-line-soft" />
        </div>
      </div>
    </section>
  );
}
