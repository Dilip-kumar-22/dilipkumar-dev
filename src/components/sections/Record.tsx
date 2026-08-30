import { EDUCATION, CERTIFICATIONS } from '@/lib/content';
import DenoiseText from '@/components/DenoiseText';

export default function Record() {
  return (
    <section id="record" className="relative shell py-32">
      <div className="mx-auto max-w-7xl">
        <span className="t-label reveal">epoch 07 — record</span>
        <DenoiseText
          as="h2"
          text="The paperwork"
          className="t-display mt-6 block text-[clamp(2.2rem,5vw,4rem)] text-hi"
        />

        <div className="mt-20 grid gap-16 lg:grid-cols-2 lg:gap-28">
          {/* education */}
          <div className="reveal reveal-1">
            <span className="t-label">education</span>
            <div className="mt-8 border-t border-line pt-8">
              <h3 className="text-2xl text-hi">{EDUCATION.degree}</h3>
              <p className="mt-2 text-mid">{EDUCATION.school}</p>
              <p className="t-data mt-1 text-sm text-low">{EDUCATION.place}</p>

              <div className="mt-8 flex gap-10">
                <div>
                  <span className="t-label !text-[0.6rem]">span</span>
                  <p className="t-data mt-1 text-lg text-hi">{EDUCATION.span}</p>
                </div>
                <div>
                  <span className="t-label !text-[0.6rem]">cgpa</span>
                  <p className="t-data mt-1 text-lg text-signal">{EDUCATION.cgpa}</p>
                </div>
                <div>
                  <span className="t-label !text-[0.6rem]">status</span>
                  <p className="t-data mt-1 text-lg text-hi">{EDUCATION.year}</p>
                </div>
              </div>
            </div>
          </div>

          {/* certifications — every one labelled unearned */}
          <div className="reveal reveal-2">
            <div className="flex items-baseline justify-between">
              <span className="t-label">certifications</span>
              <span className="t-data text-[0.62rem] text-low">none earned yet</span>
            </div>

            <ul className="mt-8 border-t border-line">
              {CERTIFICATIONS.map((c) => (
                <li
                  key={c.name}
                  className="flex items-baseline justify-between gap-6 border-b border-line-soft py-4"
                >
                  <span className="text-sm text-mid">{c.name}</span>
                  <span className="flex shrink-0 items-baseline gap-3">
                    <span
                      className={`t-data text-[0.6rem] uppercase tracking-[0.14em] ${
                        c.state === 'In progress' ? 'text-signal' : 'text-low'
                      }`}
                    >
                      {c.state}
                    </span>
                    <span className="t-data text-[0.7rem] text-low">{c.when}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
