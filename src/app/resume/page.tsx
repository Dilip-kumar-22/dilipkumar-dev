import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  PERSON,
  EDUCATION,
  PROJECTS,
  SKILLS,
  CERTIFICATIONS,
  RESEARCH,
} from '@/lib/content';
import './resume.css';

export const metadata: Metadata = {
  title: 'Résumé',
  description: `${PERSON.name} — ${PERSON.role}. One-page résumé.`,
};

/** Résumé bullets, written for a reader with seven seconds. */
const BULLETS: Record<string, string[]> = {
  bolo: [
    'Built an offline push-to-talk dictation app for Windows in Rust and Tauri 2, running whisper.cpp in-process so no audio ever leaves the machine.',
    'Cut word error rate from 13.2% to 9.6% on a 41-clip test set by adding a personal-vocabulary dictionary; 5.0% on clean English, ~1.9 s p50 to text on laptop CPU.',
    'Gated every release behind an evaluation harness, and shipped 10 public versions with a 3 MB installer.',
  ],
  'typing-master': [
    'Shipped an installable, offline-first typing tutor: 41-chapter curriculum, adaptive drills weighted to the keys the user fails, colour-coded finger guide and a 3D keyboard heatmap.',
    'Kept all progress on-device with no account, added daily challenges and code-typing drills, and covered it with 137 passing tests.',
  ],
  's-corp': [
    'Architected an autonomous multi-agent platform: a router agent dispatches intent to named specialists, and an autonomous engine generates, queues and executes work across an Inbox → Running → Review board.',
    'Wired 38 models across four providers behind one router, with 54 health-checked connectors, 18 scheduled jobs and Docker-sandboxed execution; runs ~4.2M tokens/day with live cost and latency metering.',
    'Built the React 19 command dashboard, and split the system into a three-repo monorepo (core / backend / frontend).',
  ],
  orbit: [
    'Released an open-source 3D scrollytelling starter with HDR-safe post-processing (HalfFloat + 4× MSAA), an OKLCH palette shared between CSS and WebGL, and reduced-motion and no-WebGL fallbacks built in.',
  ],
  friday: [
    'Built a terminal-native assistant on a three-tier memory architecture: a 1M-token working context, a self-compacting markdown journal, and a 412 MB store of 18,402 facts retrieved by hybrid vector + BM25 search.',
    'Routed specialist sub-agents by trigger rather than by prompt, and added a think mode that prints the reasoning before the answer so failures are debuggable.',
  ],
};

const ORDER = ['bolo', 'typing-master', 's-corp', 'orbit', 'friday'];

export default function Resume() {
  const projects = ORDER.map((s) => PROJECTS.find((p) => p.slug === s)!).filter(Boolean);

  return (
    <>
      {/* screen-only toolbar; hidden when printing */}
      <div className="cv-bar">
        <Link href="/" className="cv-bar__back">
          ← back to the site
        </Link>
        <div className="cv-bar__actions">
          <a href={PERSON.resume.pdf} download>
            Download PDF
          </a>
          <a href={PERSON.resume.docx} download>
            Word (.docx)
          </a>
        </div>
      </div>

      <main className="cv">
        <header className="cv-head">
          <div className="cv-head__text">
            <h1>{PERSON.name}</h1>
            <p className="cv-head__role">
              {PERSON.role} <span>·</span> {PERSON.subrole}
            </p>
            <ul className="cv-contact">
              <li>{PERSON.location}</li>
              <li>
                <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
              </li>
              <li>{PERSON.phone}</li>
              <li>
                <a href={PERSON.links.github}>github.com/Dilip-kumar-22</a>
              </li>
              <li>
                <a href={PERSON.links.linkedin}>linkedin.com/in/dilip-kumar-aiml</a>
              </li>
              <li>
                <a href={PERSON.links.huggingface}>huggingface.co/dilipsroy-22</a>
              </li>
            </ul>
          </div>
          <Image
            className="cv-portrait"
            src="/portrait-print.jpg"
            alt={`${PERSON.name}, portrait`}
            width={320}
            height={320}
            priority
          />
        </header>

        <section className="cv-sec">
          <h2>Summary</h2>
          <p className="cv-summary">{PERSON.summary}</p>
        </section>

        <section className="cv-sec">
          <h2>Skills</h2>
          <dl className="cv-skills">
            {SKILLS.map((g) => (
              <div key={g.group}>
                <dt>{g.group}</dt>
                <dd>{g.items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="cv-sec">
          <h2>Projects</h2>
          {projects.map((p) => (
            <article key={p.slug} className="cv-proj">
              <div className="cv-proj__head">
                <h3>
                  {p.name} <span className="cv-proj__tag">{p.tagline}</span>
                </h3>
                <span className="cv-proj__meta">
                  {p.stack.join(', ')} <em>{p.statusLabel}</em>
                </span>
              </div>
              <ul>
                {(BULLETS[p.slug] || [p.summary]).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              {(p.live || p.repo) && (
                <p className="cv-proj__link">
                  {p.live ? p.live.replace(/^https?:\/\//, '') : p.repo!.replace(/^https?:\/\//, '')}
                </p>
              )}
            </article>
          ))}
        </section>

        <section className="cv-sec">
          <h2>Research &amp; model training</h2>
          <ul className="cv-list">
            <li>
              Pre-training a custom ~200M-parameter language model from scratch: tokenizer,
              training loop and evaluation.
            </li>
            <li>Fine-tuning 70B-class open models with QLoRA on curated domain data.</li>
            <li>
              Dataset curation and eval-first pipeline design: deduplication, filtering, and
              writing the evaluation before the model.
            </li>
            <li>{RESEARCH.discipline}</li>
          </ul>
        </section>

        <div className="cv-split">
          <section className="cv-sec">
            <h2>Education</h2>
            <p className="cv-edu__deg">{EDUCATION.degree}</p>
            <p className="cv-edu__sub">
              {EDUCATION.school}, {EDUCATION.place}
            </p>
            <p className="cv-edu__sub">
              {EDUCATION.span} (expected) <span>·</span> CGPA {EDUCATION.cgpa}
            </p>
          </section>

          <section className="cv-sec">
            <h2>Certifications</h2>
            <ul className="cv-list cv-list--tight">
              {CERTIFICATIONS.filter((c) => c.state === 'In progress').map((c) => (
                <li key={c.name}>
                  {c.name} <em>— in progress, {c.when}</em>
                </li>
              ))}
              <li className="cv-muted">
                Targeted next: AWS Solutions Architect Associate (2027), DeepLearning.AI
                Deep Learning Specialization (2027), AWS ML Specialty (2028).
              </li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
