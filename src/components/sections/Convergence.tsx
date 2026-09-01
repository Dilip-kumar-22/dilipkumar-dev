import { PERSON } from '@/lib/content';
import DenoiseText from '@/components/DenoiseText';

const LINKS = [
  { label: 'GitHub', value: 'Dilip-kumar-22', href: PERSON.links.github },
  { label: 'Hugging Face', value: 'dilipsroy-22', href: PERSON.links.huggingface },
  { label: 'LinkedIn', value: 'dilip-kumar-aiml', href: PERSON.links.linkedin },
  { label: 'Email', value: PERSON.email, href: `mailto:${PERSON.email}` },
];

export default function Convergence() {
  return (
    <section
      id="convergence"
      className="relative flex min-h-dvh flex-col justify-center shell py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
        <span className="t-label reveal">epoch 08 — convergence</span>

        <DenoiseText
          as="h2"
          text="Loss stops falling. Ship it."
          className="t-display mt-8 block max-w-5xl text-[clamp(2.3rem,6.4vw,5.6rem)] text-hi"
        />

        <p className="reveal reveal-2 t-body mt-10">
          I am looking for AI/ML internships and research-adjacent work where the
          training loop is the job — data curation, fine-tuning, evaluation,
          and the unglamorous parts of making a model actually good. If that is
          what you are building, I would like to hear about it.
        </p>

        <div className="reveal reveal-1 mt-16 flex flex-wrap gap-4">
          <a
            href={PERSON.resume.page}
            className="t-data border border-signal-deep px-6 py-3.5 text-sm text-signal transition-colors duration-300 hover:bg-signal hover:text-ground"
          >
            Read the résumé →
          </a>
          <a
            href={PERSON.resume.pdf}
            download
            className="t-data border border-line px-6 py-3.5 text-sm text-hi transition-colors duration-300 hover:border-signal hover:text-signal"
          >
            Download PDF
          </a>
        </div>

        <div className="mt-12 grid gap-px border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer noopener"
              className={`reveal reveal-${i + 1} group flex flex-col gap-3 bg-ground p-7 transition-colors duration-500 hover:bg-ground-1`}
            >
              <span className="t-label transition-colors duration-500 group-hover:text-signal">
                {l.label}
              </span>
              <span className="t-data text-[0.82rem] leading-relaxed text-hi [overflow-wrap:anywhere]">{l.value}</span>
              <span className="mt-2 h-px w-8 bg-line transition-all duration-500 group-hover:w-full group-hover:bg-signal" />
            </a>
          ))}
        </div>

        <footer className="mt-24 flex flex-col gap-8 border-t border-line-soft pt-10 md:flex-row md:items-end md:justify-between">
          <p className="t-data max-w-md text-xs leading-relaxed text-low">
            {PERSON.philosophy}
          </p>
          <p className="t-data text-[0.65rem] text-low">
            {PERSON.location} · built with Three.js on the{' '}
            <a
              href="https://github.com/Dilip-kumar-22/orbit"
              target="_blank"
              rel="noreferrer noopener"
              className="text-signal-dim underline-offset-4 hover:underline"
            >
              ORBIT
            </a>{' '}
            engine — which I also wrote.
          </p>
        </footer>
      </div>
    </section>
  );
}
