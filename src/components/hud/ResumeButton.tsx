import Link from 'next/link';

/**
 * Always-visible route to the CV. Fixed top-right on every page, so the
 * résumé is one click away from any point in the scroll — which is the
 * whole requirement.
 */
export default function ResumeButton() {
  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 md:right-6 md:top-6">
      <Link
        href="/resume"
        className="group flex items-center gap-2 border border-line bg-ground/70 px-3.5 py-2 backdrop-blur-md transition-colors duration-300 hover:border-signal hover:bg-ground-1/80 md:px-4 md:py-2.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-signal transition-transform duration-300 group-hover:scale-125" />
        <span className="t-data text-[0.62rem] uppercase tracking-[0.16em] text-hi md:text-[0.68rem]">
          Résumé
        </span>
      </Link>
    </div>
  );
}
