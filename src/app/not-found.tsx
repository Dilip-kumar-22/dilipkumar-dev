import Link from 'next/link';

export const metadata = { title: 'Not found' };

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-dvh flex-col items-start justify-center px-6 md:px-16">
      <span className="t-label">error — 404</span>

      <h1
        className="t-display mt-6 text-hi"
        style={{ fontSize: 'clamp(2.6rem, 8vw, 6rem)', lineHeight: 1 }}
      >
        Out of
        <br />
        <span className="text-signal" style={{ fontStyle: 'italic' }}>
          distribution
        </span>
        .
      </h1>

      <p className="t-body mt-8">
        This route was not in the training set. Nothing here has been seen
        before — which is usually where things go wrong.
      </p>

      <Link
        href="/"
        className="t-data mt-12 border border-line px-5 py-3 text-sm text-hi transition-colors hover:border-signal hover:text-signal"
      >
        ← back to the run
      </Link>
    </main>
  );
}
