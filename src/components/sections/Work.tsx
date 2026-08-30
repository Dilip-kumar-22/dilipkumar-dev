'use client';

import Link from 'next/link';
import { PROJECTS, type Project } from '@/lib/content';
import { setFocus } from '@/lib/focusStore';
import DenoiseText from '@/components/DenoiseText';

const STATUS_STYLE: Record<Project['status'], string> = {
  public: 'text-instr border-instr-dim/40',
  beta: 'text-signal border-signal-deep',
  private: 'text-low border-line',
  roadmap: 'text-low border-line',
};

/** Staggered indents so the column reads as a composition, not a table. */
const INDENT = ['lg:ml-0', 'lg:ml-[10%]', 'lg:ml-[4%]', 'lg:ml-[14%]', 'lg:ml-[6%]'];

function Row({ p, i }: { p: Project; i: number }) {
  return (
    <article
      onMouseEnter={() => setFocus(p.slug)}
      onMouseLeave={() => setFocus(null)}
      className={`reveal group relative border-t border-line-soft ${INDENT[i % INDENT.length]}`}
    >
      <Link
        href={`/work/${p.slug}`}
        className="block py-10 outline-none transition-[padding] duration-500 focus-visible:bg-ground-1/40 group-hover:pl-3 md:py-12"
        onFocus={() => setFocus(p.slug)}
        onBlur={() => setFocus(null)}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="flex min-w-0 flex-1 items-start gap-5 md:gap-8">
            <span className="t-data mt-2 shrink-0 text-[0.7rem] text-signal-deep transition-colors duration-500 group-hover:text-signal">
              {p.index}
            </span>

            <div className="min-w-0">
              <h3
                className="t-display text-hi transition-colors duration-500 group-hover:text-signal"
                style={{ fontSize: 'clamp(1.9rem, 4.4vw, 3.5rem)' }}
              >
                {p.name}
              </h3>
              <p className="mt-2 text-base text-mid md:text-lg">{p.tagline}</p>
              <p className="t-body mt-4 !max-w-[56ch] text-sm text-low">{p.summary}</p>

              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
                {p.stack.map((s) => (
                  <li key={s} className="t-data text-[0.7rem] text-mid">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 md:flex-col md:items-end md:gap-6">
            <span
              className={`t-data whitespace-nowrap border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] ${STATUS_STYLE[p.status]}`}
            >
              {p.statusLabel}
            </span>
            <span className="t-data text-[0.7rem] text-low">{p.year}</span>
            <span className="t-label !text-[0.62rem] text-low transition-colors duration-500 group-hover:text-signal">
              case study →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative shell py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="t-label reveal">epoch 04 — work</span>
            <DenoiseText
              as="h2"
              text="Things that exist"
              className="t-display mt-6 block text-[clamp(2.2rem,5vw,4rem)] text-hi"
            />
          </div>
          <p className="reveal reveal-2 max-w-sm text-sm leading-relaxed text-low">
            Five systems that run. Two are open source and public; two are
            private because they are unfinished, not because they are
            imaginary. Hover a project to find it in the field behind this text.
          </p>
        </div>

        <div>
          {PROJECTS.map((p, i) => (
            <Row key={p.slug} p={p} i={i} />
          ))}
          <div className="border-t border-line-soft" />
        </div>
      </div>
    </section>
  );
}
