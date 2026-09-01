# dilipkumar.dev — NOISE → SIGNAL

My portfolio. **[dilipkumar-dev.vercel.app](https://dilipkumar-dev.vercel.app)**

The whole site is one continuous training run. A particle field morphs through
targets anchored to real sections — gaussian noise, my portrait rebuilt as a
volumetric point cloud, my name, a swiss-roll manifold, my projects as clusters
in latent space, and finally a converged ring. The scroll indicator is a
descending loss curve with a live step/loss readout. The palette does the
narrative work: cold graphite is noise, sodium amber is signal, so the page
warms as the run converges.

It opens on a player card you can spin and flick. The rating is my CGPA, and
every statistic printed on it is a real measurement taken from the projects
below.

## The rule this site is built on

`src/lib/content.ts` is the only source of facts, and the résumé page is
generated from it, so the site and the CV cannot disagree. Shipped work and
roadmap work never share a visual language — dated targets are rendered dimmer
and dashed and labelled "not built yet". Every number traces to a public
repository, a release, or an evaluation harness.

## Stack

Next.js · React · TypeScript · Tailwind · React Three Fiber · custom GLSL ·
GSAP · Lenis. The 3D descends from [ORBIT](https://github.com/Dilip-kumar-22/orbit),
an open-source scrollytelling starter I wrote and gave away.

## Running it

```bash
npm install
npm run dev
```

## Verifying it

Screenshots are not evidence on their own, so there is a harness:

```bash
npm run build && npx next start -p 3001
node scripts/verify.mjs --url http://localhost:3001 --out .verify
```

It reports measured fps, console errors, reveal state, canvas size and a
blown-highlight check, and captures every section at 360 / 768 / 1440.
The gate: 0 console errors, blown highlights under 1.5%, 60fps at 1440.
A blank-page control below 100fps means the run is polluted — discard it.

`node scripts/make-pdf.mjs` regenerates the résumé PDF from the `/resume`
route. `PROJECT_MAP.md` documents how the files connect and the constraints
that will break the site if ignored.

## Licence

MIT for the code. The photographs, CV and written content are mine.
