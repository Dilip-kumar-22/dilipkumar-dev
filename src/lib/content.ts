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
  email: 'extraordinary.insaan@gmail.com',
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
  /** Real screenshot of the running thing. Never a mockup. */
  shot?: { src: string; alt: string };
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
      { label: 'Public releases', value: '10' },
      { label: 'Installer', value: '3 MB' },
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
    shot: {
      src: '/shots/typing-master.jpg',
      alt: 'Typing Master running: curriculum progress, a best-WPM dial, and the chapter list with lessons unlocking in sequence',
    },
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
    tagline: 'A multi-agent platform shaped like a company',
    status: 'private',
    statusLabel: 'Private beta',
    year: '2026',
    stack: ['Python', 'React 19', 'TypeScript'],
    summary:
      'An AI platform structured the way a company is: agents hold roles, hand work to each other, and answer for it. A Python backend runs the workforce and a React 19 dashboard lets you watch it operate.',
    problem:
      'One agent with a long tool list gets worse as the task gets bigger. I think the interesting question there is organisational rather than architectural. If you give agents roles, hand-offs and a chain of accountability, does the work hold together at a size a single agent cannot reach?',
    approach: [
      'Modelled the system as a company. Agents hold defined roles instead of sharing one undifferentiated prompt.',
      'Split it into a three-repo monorepo (core, backend, frontend) so orchestration can change without dragging the UI along with it.',
      'Built a React 19 command dashboard, because an operator needs to see what the workforce is doing, not just read whatever it produced.',
    ],
    facts: [
      { label: 'Architecture', value: 'Multi-agent' },
      { label: 'Repos', value: '3 (monorepo)' },
      { label: 'Backend', value: 'Python' },
      { label: 'Dashboard', value: 'React 19' },
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
    shot: {
      src: '/shots/orbit.jpg',
      alt: 'The ORBIT starter running: a soft iridescent noise core drifting in a dark particle field',
    },
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
    tagline: 'Terminal-native assistant, 13 sub-agents',
    status: 'private',
    statusLabel: 'Private',
    year: '2025',
    stack: ['Python', 'Gemini'],
    summary:
      'An assistant that lives in the terminal, built from 13 specialised sub-agents sitting on a three-tier memory architecture.',
    problem:
      'General assistants forget, and one prompt cannot be good at thirteen different jobs. The design question was how to split responsibility across sub-agents while keeping one coherent memory behind all of them.',
    approach: [
      'Split the work across 13 specialised sub-agents rather than one generalist prompt.',
      'Built memory in three tiers, so recent context, working state and durable facts stop competing for the same window.',
      'Kept it terminal-native, because that is where the work already happens.',
    ],
    facts: [
      { label: 'Sub-agents', value: '13' },
      { label: 'Memory tiers', value: '3' },
      { label: 'Interface', value: 'Terminal' },
      { label: 'Model', value: 'Gemini' },
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
    shot: {
      src: '/shots/shanghai-48h.jpg',
      alt: 'The 48 Hours in Shanghai opening chapter: the Pudong skyline at dusk under a full-bleed title',
    },
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
