# PROJECT_MAP — dilipkumar-dev

Every significant file, its purpose, and how it connects. (Updated 2026-08-30)

```mermaid
graph TD
    subgraph Routes["App Router"]
        LAYOUT["app/layout.tsx<br/>fonts (Instrument Serif / Archivo / IBM Plex Mono), metadata, OG"]
        HOME["app/page.tsx<br/>the scroll narrative — 9 sections"]
        CASE["app/work/[slug]/page.tsx<br/>5 static case studies"]
        NF["app/not-found.tsx<br/>404 — 'Loss went to NaN'"]
        OG["app/opengraph-image.tsx<br/>dynamic share card"]
        ICON["app/icon.svg<br/>favicon: a descending loss curve"]
        CSS["app/globals.css<br/>OKLCH tokens, .shell rail gutters, .reveal, grain"]
    end

    subgraph Data["Single source of truth"]
        CONTENT["lib/content.ts<br/>PERSON · EDUCATION · PROJECTS · ROADMAP · RESEARCH · SKILLS · CHAPTERS"]
        OKLCH["lib/oklch.ts<br/>OKLCH→sRGB + verified RENDER constants"]
    end

    subgraph State["Per-frame state (no React re-renders)"]
        SCROLL["lib/scrollStore.ts<br/>one rAF loop · progress/velocity · rAF-driven reveals"]
        FOCUS["lib/focusStore.ts<br/>hovered project → 3D uniform"]
        SP["components/ScrollProvider.tsx<br/>Lenis + starts the loop"]
    end

    subgraph Three["WebGL"]
        STAGE["three/Stage.tsx<br/>Canvas · adaptive DPR · half-res bloom · no-WebGL fallback"]
        FIELD["three/ParticleField.tsx<br/>5-target weighted morph · cursor wake · focus pull"]
        GLSL["three/glsl.ts<br/>simplex + flow field · vertex/fragment"]
        TARGETS["three/targets.ts<br/>noise · name · swiss roll · constellation · ring"]
    end

    subgraph UI["Chrome + sections"]
        SCRIM["components/Scrim.tsx<br/>legibility layer between field and text"]
        PRE["components/Preloader.tsx<br/>boot sequence (overlay, never a gate)"]
        DEN["components/DenoiseText.tsx<br/>headings resolve out of noise"]
        LOSS["hud/LossCurve.tsx<br/>the scrollbar IS a loss curve"]
        NAV["hud/Nav.tsx<br/>chapter rail"]
        SECT["sections/*.tsx<br/>Hero · Identity · Thesis · Signal · Work<br/>Research · Trajectory · Record · Convergence"]
    end

    subgraph Verify["Evidence"]
        VER["scripts/verify.mjs<br/>fps · reveals · blown highlights · screenshots @360/768/1440"]
        PDF["scripts/make-pdf.mjs<br/>/resume -> public PDF (page geometry lives in resume.css)"]
        WL["WORKLOG.md"]
        PM["PROJECT_MAP.md — this file"]
    end

    LAYOUT --> HOME
    LAYOUT --> CASE
    LAYOUT --> NF
    CSS --> LAYOUT
    CONTENT --> HOME
    CONTENT --> CASE
    CONTENT --> OG
    CONTENT --> SECT
    CONTENT --> TARGETS
    OKLCH --> STAGE
    OKLCH --> FIELD
    OKLCH -. "same palette" .-> CSS

    HOME --> PRE
    HOME --> STAGE
    HOME --> SCRIM
    HOME --> LOSS
    HOME --> NAV
    HOME --> SECT
    HOME --> SP
    CASE --> STAGE
    CASE --> SCRIM
    CASE --> SP

    SP --> SCROLL
    SCROLL --> LOSS
    SCROLL --> NAV
    SCROLL --> DEN
    SCROLL --> FIELD
    SECT --> DEN
    SECT -->|"hover"| FOCUS
    FOCUS --> FIELD
    STAGE --> FIELD
    FIELD --> GLSL
    FIELD --> TARGETS
    VER -.->|"measures"| HOME

    classDef route fill:#ECE6FF,stroke:#7C4DFF,color:#0F172A;
    classDef data fill:#DCF0FB,stroke:#1E9DE3,color:#0F172A;
    classDef state fill:#FBE2F0,stroke:#E5439B,color:#0F172A;
    classDef three fill:#FFE9CC,stroke:#F0A339,color:#0F172A;
    classDef ui fill:#E2F3E5,stroke:#46A758,color:#0F172A;
    classDef ev fill:#E7EAF3,stroke:#5B6B9E,color:#0F172A;
    class LAYOUT,HOME,CASE,NF,OG,ICON,CSS route;
    class CONTENT,OKLCH data;
    class SCROLL,FOCUS,SP state;
    class STAGE,FIELD,GLSL,TARGETS three;
    class SCRIM,PRE,DEN,LOSS,NAV,SECT ui;
    class VER,WL,PM ev;
```

## Load-bearing rules (break these and the site breaks)

- **`body` must stay `background: transparent`.** The canvas is a fixed layer at
  `z-0`; an opaque body (or a negative z-index on the canvas) paints over the
  entire 3D scene while it keeps rendering — invisible, still costing frames.
- **`uSize` in the particle shader is a scale, not pixels.** `gl_PointSize`
  multiplies it by `(300 / -z)` ≈ 30×. Keep it ~0.085. At 2.0 you get 60px
  points and 4fps.
- **Bloom stays at `resolutionScale={0.5}` and `luminanceThreshold` ≥ 0.9.**
  Full-res bloom is 4.5× the frame budget; a low threshold blows the hero white.
- **The colour grade must run after `OutputPass`** (display space), per ORBIT.
- **`.shell`, not ad-hoc padding.** It reserves the left nav rail and right loss
  curve gutters; bare `px-6 lg:px-20` puts text under the instrumentation.
- **Morph stops are measured from real section ids** (`boot`, `identity`,
  `signal`, `work`, `convergence`). Renaming a section id silently falls back to
  hardcoded stops and the field desyncs from the copy.
- **Scroll reveals run in the rAF loop**, never IntersectionObserver — IO
  thresholds stall on instant scroll jumps with Lenis attached.

## Verifying a change

```bash
npm run build && npx next start -p 3001
node scripts/verify.mjs --url http://localhost:3001 --out .verify
```

Gate: 0 console errors, `blown` < 1.5% at every stop, fps ≥ 60 at 1440.
A blank-page control under 100fps means the run is polluted — discard it.

## What does NOT belong in this repo

It is public, and it is the repository a recruiter opens. Keep out of it:

- **Coursework and academic submissions.** The PEL132 pack (presentation
  script, comic strip, marks breakdown, registration number) was committed
  here once and had to be purged from history with `git filter-repo`. It now
  lives at `Documents/PEL132-submission`, and `.gitignore` blocks `submission/`.
- **One-off debug scripts.** `scripts/` holds five things that are part of the
  workflow. Profiling spikes and screenshot one-offs get deleted, not committed.
- **Raw capture masters.** `asset/` (~110 MB of screen recordings) is ignored;
  only the transcoded web media in `public/media` is tracked.

The CV in `public/` is public **on purpose** — the site offers it for download.
It carries a phone number and email, which is a deliberate choice, not a leak.
