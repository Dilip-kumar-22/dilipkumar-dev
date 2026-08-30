import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Archivo, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { PERSON } from '@/lib/content';
import Preloader from '@/components/Preloader';
import Cursor from '@/components/Cursor';

/* Type system — a deliberate three-way pairing, no Inter anywhere.
   Display: a high-contrast editorial serif (the human voice).
   Sans:    a grotesque workhorse (the body).
   Mono:    engineering type for every instrument label (the machine). */

const display = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});

const sans = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const SITE = 'https://dilipkumar.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${PERSON.name} — ${PERSON.role}`,
    template: `%s — ${PERSON.name}`,
  },
  description:
    'AI/ML engineer building on-device speech models in Rust and multi-agent systems in Python — currently pre-training a ~200M-parameter language model from scratch.',
  keywords: [
    'AI engineer',
    'machine learning',
    'model training',
    'Rust',
    'PyTorch',
    'on-device inference',
    'multi-agent systems',
    'Dilip Kumar',
  ],
  authors: [{ name: PERSON.name, url: PERSON.links.github }],
  creator: PERSON.name,
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: `${PERSON.name} — ${PERSON.role}`,
    title: `${PERSON.name} — ${PERSON.role}`,
    description:
      'Pre-training a language model from scratch. Shipping on-device speech in Rust. Building multi-agent systems that hold together.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PERSON.name} — ${PERSON.role}`,
    description:
      'Pre-training a language model from scratch. Shipping on-device speech in Rust.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#12161d',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="grain min-h-dvh">
        <a
          href="#identity"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-ground"
        >
          Skip to content
        </a>
        <Preloader />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
