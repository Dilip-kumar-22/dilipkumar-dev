/**
 * Single source of truth for every fact on this site AND on the résumé page.
 *
 * RULE: nothing here is aspirational unless `status` says so. Shipped work and
 * roadmap work never share a visual language. If a claim can't be traced to a
 * public repo, a release, or the eval harness, it does not belong here.
 *
 * Numbers in the Bolo entry come from its README's measured-accuracy table
 * (41-clip personal test set), not from estimates.
 */

export const PERSON = {
  name: 'Dilip Kumar',
  alias: 'Samael',
  role: 'AI/ML Engineer',
  subrole: 'Aspiring AI Researcher & Model Trainer',
  location: 'Punjab, India',
  email: 'sroy.dilip@gmail.com',
  phone: '+91 9234143051',
  reg: '12520272',
  links: {
    github: 'https://github.com/Dilip-kumar-22',
    linkedin: 'https://linkedin.com/in/dilip-kumar-aiml/',
    huggingface: 'https://huggingface.co/dilipsroy-22',
  },
  resume: {
    pdf: '/Dilip-Kumar-Resume.pdf',
    docx: '/Dilip-Kumar-Resume.docx',
    page: '/resume',
  },
  portrait: '/portrait.jpg',
  summary:
    'Second-year B.Tech student who ships AI systems end to end. I wrote an offline voice-typing app for Windows in Rust that runs Whisper on your own machine, and a multi-agent platform in Python with a React dashboard on top of it. What I actually care about is the training side: building the datasets, running the fine-tunes, and pre-training a small language model from scratch so I understand what everyone else is importing.',
  thesis: 'If I have a problem and can’t find the right tool, I try to build it.',
  philosophy: 'Ship, learn, measure, iterate. Quality over hype. Impact over impression.',
} as const;

export const EDUCATION = {
  degree: 'B.Tech, Computer Science & Engineering (AI & ML)',
  school: 'Lovely Professional University',
  place: 'Punjab, India',
  span: '2025 – 2029',
  cgpa: '9.00',
  year: 'Second year',
} as const;

export type Status = 'public' | 'beta' | 'private' | 'roadmap';

export type MediaItem = {
  kind: 'video' | 'image';
  src: string;
  webm?: string;
  poster?: string;
  alt: string;
  caption: string;
  /** Chrome to frame it in, so a capture reads as the product not a stray file. */
  chrome?: 'window' | 'terminal' | 'browser';
};

export type Project = {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  status: Status;
  statusLabel: string;
  year: string;
  stack: string[];
  summary: string;
  problem: string;
  approach: string[];
  facts: { label: string; value: string }[];
  /**
   * Captures of the project actually running. The first item is what the Work
   * section plays as you scroll past; the rest appear in the case study.
   * Video is muted + looped and only plays while on screen.
   */
  media?: MediaItem[];
  repo?: string;
  live?: string;
  download?: string;
  pos: [number, number, number];
  near: string[];
  accent: 'amber' | 'cyan' | 'ice';
};

export const PROJECTS: Project[] = [
  {
    slug: 'bolo',
    index: '01',
    name: 'Bolo',
    tagline: 'Offline voice typing for Windows',
    status: 'public',
    statusLabel: 'Shipped · v0.10 · MIT',
    year: '2026',
    stack: ['Rust', 'Tauri 2', 'whisper.cpp'],
    summary:
      'Hold Ctrl+Alt, speak, release. Clean text lands wherever your cursor is. The whole speech pipeline runs on your machine, so your voice never reaches a server. Ten public releases so far, and a 3 MB installer.',
    problem:
      'Cloud dictation costs about $10 a month and uploads everything you say. I wanted to find out whether a Whisper-class model could run fast enough on an ordinary Windows laptop that you would not miss the cloud version. And whether Hinglish, which almost nothing handles properly, could work offline too.',
    approach: [
      'Wrote it in Rust on Tauri 2, with whisper.cpp running in-process. No server, no subprocess, no GC pause landing in the middle of a sentence.',
      'Kept a warm mic ring buffer with pre-roll and auto-gain, so the first syllable is already recorded before the hotkey registers.',
      'Added a personal dictionary that biases recognition toward your own names and jargon. Measured on a 41-clip test set of my own voice, it cut word error rate from 13.2% to 9.6%.',
      'Built an evaluation harness first and gated every release on it. A model or feature ships only when the numbers justify it.',
      'Made the cloud engine strictly optional and off by default. If you turn it on it uses your own API key, stored in Windows Credential Manager, and falls back to local the moment the network fails.',
    ],
    facts: [
      { label: 'Word error rate', value: '5.0% clean EN' },
      { label: 'Time to text', value: '~1.9 s (p50, CPU)' },
      { label: 'Audio leaving device', value: 'None' },
      { label: 'Installer', value: '3 MB · 10 releases' },
    ],
    media: [
      {
        kind: 'video',
        src: '/media/bolo.mp4',
        webm: '/media/bolo.webm',
        poster: '/media/bolo-poster.jpg',
        chrome: 'window',
        alt: 'Bolo running on Windows: the Models tab showing Lite, Small EN and Turbo tiers, with Small EN marked "fits this PC" and active',
        caption:
          'Bolo picking a model for the machine it is on. Each tier is benchmarked on real voice, downloaded once, then offline forever.',
      },
    ],
    repo: 'https://github.com/Dilip-kumar-22/bolo',
    download: 'https://github.com/Dilip-kumar-22/bolo/releases/latest',
    pos: [-4.2, 1.1, -1.4],
    near: ['friday'],
    accent: 'amber',
  },
  {
    slug: 'typing-master',
    index: '02',
    name: 'Typing Master',
    tagline: 'Touch-typing tutor, installable and offline',
    status: 'public',
    statusLabel: 'Live · v2.1 · MIT',
    year: '2025',
    stack: ['TypeScript', 'Preact', 'Vite', 'PWA'],
    summary:
      'A free typing tutor with a 41-chapter curriculum, an adaptive engine that drills the keys you keep missing, a colour-coded finger guide and a 3D keyboard heatmap. Installs from the browser like a real desktop app, works with no connection, and keeps every keystroke on your device. 137 tests keep it honest.',
    problem:
      'I wanted a typing tutor that adapted to my actual mistakes instead of feeding me random word lists, and I could not find one that was free, worked offline, and was not covered in ads. So I built the one I wanted to use.',
    approach: [
      'Structured a real 41-chapter curriculum that unlocks in sequence, gated at 85% accuracy, instead of throwing random words at you.',
      'Built an adaptive engine that weights drills toward the keys you actually fail.',
      'Colour-coded every key by the finger that owns it, and drew a 3D heatmap so error patterns are visible instead of buried in a stats table.',
      'Added daily seeded runs, paragraph speed-runs, punctuation drills and code-typing tests, because practice you enjoy is practice you repeat.',
      'Made it install straight from the browser as a PWA: its own window, its own icon, fully offline, updating itself when you are back online.',
      'Gave people a way out — one-click JSON export and import moves all progress between devices without ever needing an account.',
      'Wrote 137 tests, because a tutor that miscounts your accuracy is worse than no tutor.',
    ],
    facts: [
      { label: 'Curriculum', value: '41 chapters' },
      { label: 'Tests passing', value: '137' },
      { label: 'Works offline', value: 'Fully' },
      { label: 'Account needed', value: 'No' },
    ],
    media: [
      {
        kind: 'image',
        src: '/shots/typing-master.jpg',
        chrome: 'browser',
        alt: 'Typing Master running: curriculum progress, a best-WPM dial, and the chapter list with lessons unlocking in sequence',
        caption:
          'The installed app. Chapters unlock in sequence at 85% accuracy, and every stat stays on the device.',
      },
    ],
    repo: 'https://github.com/Dilip-kumar-22/typing-master-scorp',
    live: 'https://dilip-kumar-22.github.io/typing-master-scorp/',
    pos: [-2.4, -2.3, 1.6],
    near: ['orbit'],
    accent: 'ice',
  },
  {
    slug: 's-corp',
    index: '03',
    name: 'S-CORP',
    tagline: 'An AI company that runs itself',
    status: 'private',
    statusLabel: 'Private beta · v13',
    year: '2026',
    stack: ['Python', 'React 19', 'TypeScript', 'Docker'],
    summary:
      'A platform shaped like a company rather than a chatbot. SHADOW reads your intent and dispatches it to named specialists — GHOST, FOUNDRY, GENESIS, ARCHIVIST — while SPARK generates, queues and executes work on its own. Everything moves across an Inbox → Planning → Running → Review → Completed board you can actually watch.',
    problem:
      'One agent holding a long tool list gets worse as the job gets bigger. I think that problem is organisational, not architectural. Give agents real roles, real hand-offs and somewhere the work is visibly accountable, and you can reach a scale a single prompt cannot. The hard part is not the agents. It is the orchestration, the memory, and being able to see what is happening.',
    approach: [
      'Put one router at the front. SHADOW reads intent and auto-routes to the right specialist instead of making the operator pick.',
      'Gave every agent a role and a name, so work has an owner: GHOST, FOUNDRY, GENESIS, GROWTH, INQUISITOR, ARCHIVIST.',
      'Built SPARK, an autonomous engine that generates its own briefs, queues them and executes — the dashboard shows what is queued, running and done.',
      'Made the whole thing observable: 54 connectors reporting health and latency, a CRON engine running 18 scheduled jobs, 12 autopilot rules, and a live context meter in the status bar.',
      'Wired 38 models across four providers — Anthropic, Google, OpenAI and xAI — behind one router, each with its own price and role, so the cheap model does the cheap work.',
      'Ran untrusted work inside Docker sandboxes, and versioned prompts (184 and counting) so a regression can be traced to the change that caused it.',
      'Put the money on screen. A live meter shows tokens per hour, spend per hour and p50 latency, because an autonomous system you cannot bill is an autonomous system you cannot trust.',
      'Split it into a three-repo monorepo — core, backend, frontend — so orchestration can evolve without dragging the UI along.',
    ],
    facts: [
      { label: 'Agents live', value: '47' },
      { label: 'Models wired', value: '38' },
      { label: 'Tokens / 24h', value: '4.2M' },
      { label: 'Connectors', value: '54 / 54' },
    ],
    media: [
      {
        kind: 'video',
        src: '/media/scorp.mp4',
        webm: '/media/scorp.webm',
        poster: '/media/scorp-poster.jpg',
        chrome: 'browser',
        alt: 'The S-CORP dashboard: the SPARK autonomous engine with work moving across Inbox, Planning, Running, Review and Completed columns, a specialist agent sidebar, and a live status bar',
        caption:
          'SPARK running unattended. Briefs are generated, queued and executed by named specialists, and every job is visible on the board.',
      },
    ],
    pos: [3.6, 1.9, -2.2],
    near: ['friday'],
    accent: 'cyan',
  },
  {
    slug: 'orbit',
    index: '04',
    name: 'ORBIT',
    tagline: '3D scrollytelling starter, given away',
    status: 'public',
    statusLabel: 'Live · Open source · MIT',
    year: '2026',
    stack: ['Three.js', 'GLSL', 'OKLCH'],
    summary:
      'A free starter for cinematic 3D websites. Curl-noise core, particle galaxy, scroll-eased camera, and the parts people usually skip: HDR-safe post-processing, a reduced-motion path and a no-WebGL fallback. Fork it, edit one file, deploy.',
    problem:
      'Cinematic 3D sites get rebuilt from scratch every time, and the genuinely hard decisions get skipped in the rush. Bloom that blows the highlights out, banding in the post chain, no reduced-motion path. I wanted those decisions made once, correctly, and handed to anyone who wants them.',
    approach: [
      'Shipped an HDR-safe composer: a HalfFloat render target with 4× MSAA, so bloom neither bands nor aliases.',
      'Ordered the post-processing deliberately. The colour grade runs after OutputPass, in display space, where grading maths actually behaves.',
      'Kept bloom honest at threshold 0.92 with low strength, so only true highlights bloom instead of the whole frame washing white.',
      'Authored the palette in OKLCH and converted to linear sRGB at load, so the CSS and the WebGL scene share one perceptual palette.',
      'Built the prefers-reduced-motion path in from the start rather than bolting it on: it disables smooth scroll, reveals and continuous animation, and renders one still frame.',
      'Capped DPR at 2 and stopped the render loop whenever the page is hidden, so a background tab costs nothing.',
    ],
    facts: [
      { label: 'Particle galaxy', value: '8,000 points' },
      { label: 'Dependencies', value: '1 (three.js)' },
      { label: 'Build step', value: 'None' },
      { label: 'Licence', value: 'MIT' },
    ],
    media: [
      {
        kind: 'image',
        src: '/shots/orbit.jpg',
        chrome: 'browser',
        alt: 'The ORBIT starter running: a soft iridescent noise core drifting in a dark particle field',
        caption:
          'ORBIT, live. A curl-noise core and an 8,000-point galaxy behind real, selectable HTML.',
      },
    ],
    repo: 'https://github.com/Dilip-kumar-22/orbit',
    live: 'https://dilip-kumar-22.github.io/orbit/',
    pos: [4.4, -2.0, 0.9],
    near: ['typing-master', 'shanghai'],
    accent: 'ice',
  },
  {
    slug: 'friday',
    index: '05',
    name: 'FRIDAY',
    tagline: 'A terminal assistant that remembers',
    status: 'private',
    statusLabel: 'Private · F-OS 1.0',
    year: '2025',
    stack: ['Python', 'Gemini', 'SQLite', 'Embeddings'],
    summary:
      'An assistant that lives in the terminal and does not forget. Three memory tiers sit behind it: a million-token working context, a markdown journal that compacts itself, and a 412 MB fact store holding 18,402 facts retrieved by hybrid vector and BM25 search. Trigger-routed sub-agents handle research, code, recall and the browser.',
    problem:
      'Assistants forget between sessions, and one prompt cannot be good at every job. Long context alone does not fix it — you cannot hold a year of working knowledge in a window, and stuffing it in makes the model worse and the bill larger. I wanted memory that behaves like memory: recent things instantly available, older things retrievable, everything durable.',
    approach: [
      'Split memory into three tiers that stop competing: T1 is the live 1M-token context, T2 is a markdown journal that auto-compacts at 8k tokens, T3 is a SQLite fact store.',
      'Made T3 retrieval hybrid — dense embeddings plus BM25 — because pure vector search misses exact identifiers and pure keyword search misses paraphrase.',
      'Routed sub-agents by trigger rather than by asking: Planner always, ResearchAgent on research, CodeAgent on code, MemoryAgent on recall, BrowserAgent on web.',
      'Added a think mode that prints the inner monologue before the answer, so a wrong result is debuggable instead of mysterious.',
      'Put connector health and per-turn cost in the status bar. It runs on gemini-3.1-pro with a claude-haiku-4.5 fallback, and shows exactly what each turn cost.',
    ],
    facts: [
      { label: 'Facts in memory', value: '18,402' },
      { label: 'Memory store', value: '412 MB' },
      { label: 'Retrieval', value: 'Vector + BM25' },
      { label: 'Working context', value: '1M tokens' },
    ],
    media: [
      {
        kind: 'video',
        src: '/media/friday.mp4',
        webm: '/media/friday.webm',
        poster: '/media/friday-poster.jpg',
        chrome: 'terminal',
        alt: 'FRIDAY running: it explains its three memory tiers, then reproduces a failing test, patches the file and re-runs it green, with agent, memory and schedule panels live alongside',
        caption:
          'FRIDAY working. It explains its own memory architecture, then reproduces a failing test, edits the file, re-runs it and reports green — with every tool call visible as it happens.',
      },
      {
        kind: 'image',
        src: '/shots/friday/03-think-mode.jpg',
        chrome: 'terminal',
        alt: 'FRIDAY in think mode: agent and connector panels with live latencies, a memory panel showing 18,402 facts, and the inner monologue printed before the answer',
        caption:
          'Think mode on. FRIDAY shows its reasoning before answering, with agents, connector latency and all three memory tiers live on the right.',
      },
      {
        kind: 'image',
        src: '/shots/friday/02-conversation.jpg',
        chrome: 'terminal',
        alt: 'FRIDAY config open beside the session: profile.yaml showing the model, the three memory tiers and the trigger-routed agent list',
        caption:
          'The whole assistant is configuration. Models, memory tiers and agent triggers are declared in YAML and editable while it runs.',
      },
      {
        kind: 'image',
        src: '/shots/friday/04-tool-cards.jpg',
        chrome: 'terminal',
        alt: 'FRIDAY rendering tool-call cards inline in the terminal as it works',
        caption: 'Tool calls render as inline cards, so you can see what it actually did.',
      },
      {
        kind: 'image',
        src: '/shots/friday/01-boot.jpg',
        chrome: 'terminal',
        alt: 'FRIDAY booting: F-OS 1.0.0 loading tier-3 memory with 18,402 facts and arming scheduled tasks',
        caption: 'Boot: tier-3 memory loads 18,402 facts and the scheduled tasks arm.',
      },
    ],
    pos: [1.8, -1.6, 2.4],
    near: ['s-corp', 'bolo'],
    accent: 'cyan',
  },
  {
    slug: 'shanghai',
    index: '06',
    name: '48 Hours in Shanghai',
    tagline: 'A cinematic scroll, zero build step',
    status: 'public',
    statusLabel: 'Live · Open source',
    year: '2026',
    stack: ['CSS', 'Vanilla JS', 'AI imagery'],
    summary:
      'A six-chapter immersive scroll through the Bund, Pudong and the lantern-lit alleys. No framework, no build step, no bundler. Written to find out how far plain CSS and a scroll listener can be pushed before you actually need a library.',
    problem:
      'Every immersive site seems to arrive with a megabyte of JavaScript attached. I wanted to test the opposite: how cinematic can a page feel with no framework and no build step at all?',
    approach: [
      'Built the whole thing as plain HTML, CSS and a scroll listener. No bundler, no dependencies, nothing to install.',
      'Cache-warmed every scene image right after the hero paints, so a fast scroll never outruns the loader into a black frame.',
      'Generated the imagery with AI at full-bleed resolution, then re-encoded it for the web. The site is upfront that the photographs are synthetic.',
    ],
    facts: [
      { label: 'Chapters', value: '6' },
      { label: 'Build step', value: 'None' },
      { label: 'Dependencies', value: 'Zero' },
      { label: 'Imagery', value: 'AI-generated' },
    ],
    media: [
      {
        kind: 'image',
        src: '/shots/shanghai-48h.jpg',
        chrome: 'browser',
        alt: 'The 48 Hours in Shanghai opening chapter: the Pudong skyline at dusk under a full-bleed title',
        caption:
          'Chapter one. Six full-bleed scenes, no framework and no build step behind any of it.',
      },
    ],
    repo: 'https://github.com/Dilip-kumar-22/shanghai-48h',
    live: 'https://dilip-kumar-22.github.io/shanghai-48h/',
    pos: [0.4, 2.6, 1.2],
    near: ['orbit'],
    accent: 'amber',
  },
];

/** Dated targets. Rendered in a deliberately dimmer, dashed language. */
export const ROADMAP = [
  {
    name: 'Custom Transformer from scratch',
    when: '2027',
    detail:
      'Implement the full architecture in PyTorch, then fine-tune a Llama-class model on curated domain data.',
  },
  {
    name: 'Digital Truth Engine',
    when: '2028',
    detail:
      'A deepfake-detection API. A PyTorch computer-vision model served over FastAPI with a live “fake score” demo.',
  },
  {
    name: 'Sentinel Shield',
    when: '2028',
    detail:
      'A VS Code security extension driven by a CVE-fine-tuned Llama-class model, flagging insecure code as you write it.',
  },
] as const;

export const RESEARCH = {
  heading: 'The training side',
  body: 'Most people using large models treat them as a black box. I want to work with much bigger models eventually, so I am starting at the bottom where the foundations are, instead of starting at the API.',
  tracks: [
    {
      k: 'Pre-training',
      title: 'A ~200M-parameter language model, from scratch',
      body: 'Tokenizer, training loop, evaluation. The whole pipeline built rather than imported. Small enough that I can actually finish it, big enough that every mistake shows up in the loss curve.',
      state: 'In progress',
    },
    {
      k: 'Fine-tuning',
      title: '70B-class open models with QLoRA',
      body: 'Quantised low-rank adaptation on curated domain data, where the compute limits are real and the technique has to carry the result.',
      state: 'Experimented',
    },
    {
      k: 'Data',
      title: 'Dataset curation and evaluation',
      body: 'Deduplication, filtering, and designing the eval before the model. This is the unglamorous half that decides whether the training run was worth the electricity. Bolo is the proof it works: its eval harness is what turned 13.2% word error into 9.6%.',
      state: 'Ongoing',
    },
  ],
  discipline: 'One arXiv paper a week, re-implemented in PyTorch.',
} as const;

export const SKILLS = [
  { group: 'Languages', items: ['Python', 'Rust', 'TypeScript', 'C/C++', 'SQL'] },
  { group: 'ML / Deep learning', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'NumPy', 'Pandas', 'OpenCV'] },
  { group: 'GenAI / LLMs', items: ['Transformers', 'Hugging Face', 'LangChain / LangGraph', 'RAG + vector DBs', 'QLoRA', 'Whisper (on-device)'] },
  { group: 'Data & training', items: ['Dataset curation', 'Tokenizers', 'Eval harnesses', 'Synthetic data'] },
  { group: 'Frameworks & cloud', items: ['React 19', 'Tauri 2', 'Docker', 'FastAPI', 'AWS', 'Linux', 'CI/CD'] },
  { group: 'Security', items: ['Kali Linux', 'Burp Suite', 'OWASP Top 10', 'TryHackMe'] },
] as const;

/** Unearned so far, and labelled that way on purpose. */
export const CERTIFICATIONS = [
  { name: 'AWS Cloud Practitioner', state: 'In progress', when: '2026' },
  { name: 'TryHackMe Jr Penetration Tester', state: 'Target', when: '2026' },
  { name: 'AWS Solutions Architect Associate', state: 'Target', when: '2027' },
  { name: 'DeepLearning.AI Deep Learning Specialization', state: 'Target', when: '2027' },
  { name: 'AWS Machine Learning Specialty', state: 'Target', when: '2028' },
] as const;

export const CHAPTERS = [
  { id: 'boot', label: 'Boot', epoch: '00' },
  { id: 'identity', label: 'Identity', epoch: '01' },
  { id: 'thesis', label: 'Thesis', epoch: '02' },
  { id: 'signal', label: 'Signal', epoch: '03' },
  { id: 'work', label: 'Work', epoch: '04' },
  { id: 'research', label: 'Research', epoch: '05' },
  { id: 'trajectory', label: 'Trajectory', epoch: '06' },
  { id: 'record', label: 'Record', epoch: '07' },
  { id: 'convergence', label: 'Convergence', epoch: '08' },
] as const;

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
