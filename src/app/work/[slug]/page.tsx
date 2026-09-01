import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PROJECTS, projectBySlug } from '@/lib/content';
import Stage from '@/components/three/Stage';
import ScrollProvider from '@/components/ScrollProvider';
import DenoiseText from '@/components/DenoiseText';
import Scrim from '@/components/Scrim';
import ResumeButton from '@/components/hud/ResumeButton';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return { title: 'Not found' };
  return {
    title: `${p.name} — ${p.tagline}`,
    description: p.summary,
    openGraph: { title: `${p.name} — ${p.tagline}`, description: p.summary },
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const idx = PROJECTS.findIndex((x) => x.slug === p.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <ScrollProvider>
      <Stage />
      <Scrim />
      <ResumeButton />

      <main className="relative z-10 shell py-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/#work"
            className="t-label inline-flex items-center gap-2 transition-colors hover:text-signal"
          >
            ← all work
          </Link>

          <header className="mt-14">
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="t-data text-[0.7rem] text-signal-deep">{p.index}</span>
              <span className="t-data border border-line px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] text-mid">
                {p.statusLabel}
              </span>
              <span className="t-data text-[0.7rem] text-low">{p.year}</span>
            </div>

            <DenoiseText
              as="h1"
              text={p.name}
              className="t-display mt-7 block text-[clamp(2.8rem,8vw,6.5rem)] text-hi"
            />
            <p className="mt-4 text-xl text-mid md:text-2xl">{p.tagline}</p>
          </header>

          <div className="rule my-14" />

          <p className="reveal t-body !max-w-[62ch] text-lg text-hi/90">{p.summary}</p>

          {/* A real screenshot of the running thing, captured from the live
              deployment. Projects without one say so rather than showing a mockup. */}
          {p.shot && (
            <figure className="reveal reveal-1 mt-14">
              <div className="overflow-hidden border border-line-soft">
                <Image
                  src={p.shot.src}
                  alt={p.shot.alt}
                  width={1600}
                  height={1000}
                  className="h-auto w-full"
                  sizes="(max-width: 900px) 100vw, 900px"
                />
              </div>
              <figcaption className="t-data mt-3 text-[0.68rem] text-low">
                {p.live ? `Captured from ${p.live.replace(/^https?:\/\//, '')}` : 'Captured from the running build'}
              </figcaption>
            </figure>
          )}

          {/* facts — only real ones */}
          <dl className="reveal reveal-1 mt-16 grid gap-px border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {p.facts.map((f) => (
              <div key={f.label} className="bg-ground p-6">
                <dt className="t-label !text-[0.6rem]">{f.label}</dt>
                <dd className="t-data mt-2 text-lg text-hi">{f.value}</dd>
              </div>
            ))}
          </dl>

          <section className="reveal reveal-2 mt-24">
            <span className="t-label">the problem</span>
            <p className="t-body mt-6 text-lg">{p.problem}</p>
          </section>

          <section className="reveal reveal-3 mt-20">
            <span className="t-label">how it was built</span>
            <ol className="mt-8">
              {p.approach.map((a, i) => (
                <li
                  key={i}
                  className="grid gap-4 border-t border-line-soft py-7 md:grid-cols-[3rem_1fr] md:gap-8"
                >
                  <span className="t-data text-[0.7rem] text-signal-deep">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="t-body !max-w-[64ch]">{a}</p>
                </li>
              ))}
            </ol>
            <div className="border-t border-line-soft" />
          </section>

          <section className="reveal mt-16 flex flex-wrap gap-4">
            {p.repo && (
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="t-data border border-line px-5 py-3 text-sm text-hi transition-colors hover:border-signal hover:text-signal"
              >
                source on GitHub →
              </a>
            )}
            {p.live && (
              <a
                href={p.live}
                target="_blank"
                rel="noreferrer noopener"
                className="t-data border border-signal-deep px-5 py-3 text-sm text-signal transition-colors hover:bg-signal hover:text-ground"
              >
                live →
              </a>
            )}
            {!p.repo && !p.live && (
              <p className="t-data text-sm text-low">
                Private repository — happy to walk through the code in a call.
              </p>
            )}
          </section>

          <nav className="mt-28 border-t border-line pt-10">
            <span className="t-label">next</span>
            <Link
              href={`/work/${next.slug}`}
              className="group mt-4 flex items-baseline justify-between gap-6"
            >
              <span
                className="t-display text-hi transition-colors group-hover:text-signal"
                style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}
              >
                {next.name}
              </span>
              <span className="t-label transition-colors group-hover:text-signal">→</span>
            </Link>
          </nav>
        </div>
      </main>
    </ScrollProvider>
  );
}
