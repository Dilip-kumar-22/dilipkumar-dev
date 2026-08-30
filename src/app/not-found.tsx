import Link from 'next/link';

export const metadata = { title: 'Diverged' };

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-dvh flex-col justify-center px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-3xl">
        <span className="t-label">error — 404</span>

        <h1
          className="t-display mt-6 text-hi"
          style={{ fontSize: 'clamp(2.6rem, 8vw, 6rem)' }}
        >
          Loss went to{' '}
          <span className="text-signal" style={{ fontStyle: 'italic' }}>
            NaN
          </span>
          .
        </h1>

        <p className="t-body mt-8">
          This page diverged. The run is unrecoverable from here — restart from a
          known-good checkpoint.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/"
            className="t-data border border-signal-deep px-5 py-3 text-sm text-signal transition-colors hover:bg-signal hover:text-ground"
          >
            ← back to step 0
          </Link>
          <Link
            href="/#work"
            className="t-data border border-line px-5 py-3 text-sm text-hi transition-colors hover:border-signal hover:text-signal"
          >
            see the work
          </Link>
        </div>
      </div>
    </main>
  );
}
