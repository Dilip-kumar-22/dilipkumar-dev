import { PERSON, EDUCATION } from '@/lib/content';
import DenoiseText from '@/components/DenoiseText';

const VITALS = [
  ['CGPA', EDUCATION.cgpa, '/ 10.00'],
  ['Year', '02', '/ 04'],
  ['Programme', 'CSE', 'AI & ML'],
  ['Reg', PERSON.reg, 'LPU'],
] as const;

export default function Identity() {
  return (
    <section
      id="identity"
      className="relative min-h-dvh shell py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.35fr_1fr] lg:gap-24">
        {/* ---- left: the name lands here, just as the field spells it ---- */}
        <div>
          <span className="t-label reveal">epoch 01 — identity</span>

          <DenoiseText
            as="h2"
            text={PERSON.name}
            className="t-display mt-6 block text-[clamp(2.6rem,7vw,6rem)] text-hi"
            speed={1.1}
          />

          <p className="reveal reveal-1 mt-5 font-mono text-[0.8rem] uppercase tracking-[0.24em] text-signal">
            {PERSON.role} <span className="text-low">·</span>{' '}
            <span className="text-mid">{PERSON.subrole}</span>
          </p>

          <div className="rule reveal reveal-2 my-10" />

          <p className="reveal reveal-3 t-body">{PERSON.summary}</p>

          <p className="reveal reveal-4 t-body mt-6">
            No formal internship yet — I am in my second year. I did not want to
            wait for permission to start, so the work below is self-driven:
            research, hackathons, and systems I needed badly enough to build
            myself.
          </p>
        </div>

        {/* ---- right: vitals as an instrument readout, not a card ---- */}
        <div className="lg:pt-[26rem]">
          <div className="reveal reveal-2 border-t border-line">
            {VITALS.map(([k, v, suffix], i) => (
              <div
                key={k}
                className={`reveal reveal-${i + 2} flex items-baseline justify-between gap-6 border-b border-line-soft py-5`}
              >
                <span className="t-label">{k}</span>
                <span className="flex items-baseline gap-2">
                  <span className="t-data text-3xl text-hi md:text-4xl">{v}</span>
                  <span className="t-data text-[0.7rem] text-low">{suffix}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="reveal reveal-5 mt-10">
            <span className="t-label">institution</span>
            <p className="mt-3 text-sm leading-relaxed text-mid">
              {EDUCATION.school}
              <br />
              <span className="text-low">
                {EDUCATION.degree} · {EDUCATION.span}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
