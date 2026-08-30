/**
 * Single source of truth for every fact on this site.
 *
 * RULE: nothing in this file is aspirational unless `status` says so.
 * Shipped work and roadmap work never share a visual language — see
 * `Status` below. If a claim can't be traced to the CV or a public repo,
 * it does not belong here.
 */

export const PERSON = {
  name: 'Dilip Kumar',
  alias: 'Samil',
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
  /** From the CV summary — kept verbatim in substance. */
  summary:
    'B.Tech (CSE — AI & ML) engineer who ships AI systems end-to-end — from on-device speech models in Rust to a multi-agent AI platform with its own React dashboard. Focused on the training side of AI: curating high-quality datasets, fine-tuning 70B-class open models and pre-training a custom ~200M-parameter language model from scratch.',
  /** The line the whole site is built around — from the spoken CV. */
  thesis: 'If I have a problem and can’t find the right tool, I try to build it.',
  philosophy: 'Ship, learn, measure, iterate. Quality over hype. Impact over impression.',
} as const;

export const EDUCATION = {
  degree: 'B.Tech — Computer Science & Engineering (AI & ML)',
  school: 'Lovely Professional University',
  place: 'Punjab, India',
  span: '2025 – 2029',
  cgpa: '9.00',
  year: 'Second year',
} as const;

/** Shipped = it exists and runs. Roadmap = a dated target, not a claim. */
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
  /** One-sentence pitch — what it is. */
  summary: string;
  /** The interesting engineering problem. */
  problem: string;
  /** How it was actually solved. */
  approach: string[];
  /** Only facts. No invented metrics. */
  facts: { label: string; value: string }[];
  repo?: string;
  live?: string;
  /** Position in the 3D latent-space constellation (x, y, z). */
  pos: [number, number, number];
  /** Semantic neighbours — drawn as edges in the constellation. */
  near: string[];
  accent: 'amber' | 'cyan' | 'ice';
};

export const PROJECTS: Project[] = [
  {
    slug: 'bolo',
    index: '01',
    name: 'Bolo',
    tagline: 'Offline voice typing for Windows',
    status: 'beta',
    statusLabel: 'Beta · Open source',
    year: '2026',
    stack: ['Rust', 'whisper.cpp', 'Windows'],
    summary:
      'Local-first dictation — an offline Wispr Flow. Push-to-talk, 100% on-device Whisper inference. No cloud. No audio ever leaves the machine.',
    problem:
      'Every good dictation tool streams your voice to someone else’s server. I wanted to know whether a Whisper-class model could run fast enough on an ordinary Windows laptop that you would not miss the cloud — and whether the latency could be hidden well enough to feel instant.',
    approach: [
      'Wrote the whole pipeline in Rust for predictable latency and no GC pauses mid-utterance.',
      'Ran Whisper inference on-device through whisper.cpp — the audio buffer never leaves the process.',
      'Built a mic pre-roll ring buffer so the first syllable is never clipped: the mic is already warm and recording before the hotkey registers.',
      'Added auto-gain so quiet and loud speakers land in the same usable range without manual tuning.',
    ],
    facts: [
      { label: 'Audio sent to cloud', value: 'None' },
      { label: 'Inference', value: 'On-device' },
      { label: 'Language', value: 'Rust' },
      { label: 'Licence', value: 'MIT' },
    ],
    repo: 'https://github.com/Dilip-kumar-22/bolo',
    pos: [-4.2, 1.1, -1.4],
    near: ['friday'],
    accent: 'amber',
  },
  {
    slug: 's-corp',
    index: '02',
    name: 'S-CORP',
    tagline: 'Sovereign AI Corporation',
    status: 'private',
    statusLabel: 'Private beta',
    year: '2026',
    stack: ['Python', 'React 19', 'TypeScript'],
    summary:
      'A fully AI-based platform structured as an autonomous company: an orchestrated multi-agent workforce on a Python backend, driven from a React 19 command dashboard.',
    problem:
      'A single agent with a long tool list degrades as the task grows. The interesting question is organisational, not architectural: if you give agents roles, hand-offs and a chain of accountability the way a company does, does the work hold together at a scale one agent cannot reach?',
    approach: [
      'Modelled the system as a company — agents hold roles and responsibilities rather than sharing one undifferentiated prompt.',
      'Split it into a three-repo monorepo (core / backend / frontend) so the orchestration layer can evolve without dragging the UI with it.',
      'Built a React 19 command dashboard — an operator needs to see what the workforce is doing, not just read the output.',
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
    slug: 'typing-master',
    index: '03',
    name: 'Typing Master',
    tagline: 'Touch-typing tutor PWA',
    status: 'public',
    statusLabel: 'Public · Installable',
    year: '2025',
    stack: ['TypeScript', 'Preact', 'PWA'],
    summary:
      'An installable, offline-first typing tutor: a 41-chapter curriculum, an adaptive practice engine, a visual finger guide and a 3D keyboard heatmap. Every keystroke stays on your device.',
    problem:
      'I wanted a typing tutor that actually adapted to the keys I kept missing, and I could not find one that was free, offline and not covered in ads. So I built the one I wanted to use.',
    approach: [
      'Structured a 41-chapter curriculum instead of dumping random word lists on the user.',
      'Built an adaptive practice engine that weights drills toward the keys you actually fail.',
      'Rendered a 3D keyboard heatmap so error patterns are visible at a glance rather than buried in a stats table.',
      'Made it offline-first and installable — all progress persisted on-device, no account required.',
    ],
    facts: [
      { label: 'Curriculum', value: '41 chapters' },
      { label: 'Works offline', value: 'Yes' },
      { label: 'Data leaves device', value: 'No' },
      { label: 'Licence', value: 'MIT' },
    ],
    repo: 'https://github.com/Dilip-kumar-22/typing-master-scorp',
    pos: [-2.4, -2.3, 1.6],
    near: ['orbit'],
    accent: 'ice',
  },
  {
    slug: 'friday',
    index: '04',
    name: 'FRIDAY',
    tagline: 'Personal AI assistant',
    status: 'private',
    statusLabel: 'Private',
    year: '2025',
    stack: ['Python', 'Gemini'],
    summary:
      'A terminal-native assistant built on 13 specialised sub-agents and a three-tier memory architecture.',
    problem:
      'General assistants forget, and one prompt cannot be good at thirteen different jobs. The design question was how to split responsibility across sub-agents while keeping a single coherent memory behind them.',
    approach: [
      'Split the work across 13 specialised sub-agents rather than one generalist prompt.',
      'Built memory in three tiers so recent context, working state and durable facts are not competing for the same window.',
      'Kept it terminal-native — the assistant lives where the work already happens.',
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
    slug: 'orbit',
    index: '05',
    name: 'ORBIT',
    tagline: '3D scrollytelling starter',
    status: 'public',
    statusLabel: 'Public · Open source',
    year: '2026',
    stack: ['Three.js', 'GLSL', 'OKLCH'],
    summary:
      'A free, open-source 3D scrollytelling website starter — curl-noise core, particle galaxy, scroll-eased camera, reduced-motion and no-WebGL fallbacks built in. Fork it, edit one file, deploy.',
    problem:
      'Cinematic 3D sites are mostly rebuilt from scratch every time, and the parts that are genuinely hard — HDR-safe post-processing, bloom that does not blow out, a reduced-motion path — get skipped. I wanted those decisions made once, correctly, and given away.',
    approach: [
      'Shipped an HDR-safe composer: a HalfFloat render target with 4× MSAA, so bloom does not band or alias.',
      'Ordered post-processing deliberately — the colour grade runs after OutputPass, in display space, where grading maths actually behaves.',
      'Kept bloom honest: threshold 0.92 and low strength, so only true highlights bloom instead of the whole frame washing out.',
      'Authored the palette in OKLCH and converted to linear sRGB at load, so the CSS and the WebGL scene share one perceptual palette.',
      'Built in a full prefers-reduced-motion path and a no-WebGL fallback rather than bolting them on.',
    ],
    facts: [
      { label: 'Licence', value: 'MIT' },
      { label: 'Build step', value: 'None' },
      { label: 'Reduced-motion', value: 'Built in' },
      { label: 'Powers', value: 'This site' },
    ],
    repo: 'https://github.com/Dilip-kumar-22/orbit',
    pos: [4.4, -2.0, 0.9],
    near: ['typing-master'],
    accent: 'ice',
  },
];

/** Dated targets. Rendered in a deliberately different, dimmer language. */
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
      'A deepfake-detection API: a PyTorch computer-vision model served over FastAPI with a live “fake score” demo.',
  },
  {
    name: 'Sentinel Shield',
    when: '2028',
    detail:
      'A VS Code security extension driven by a CVE-fine-tuned Llama-class model, flagging insecure code as you write it.',
  },
] as const;

/** The research track — this is the actual long-term direction. */
export const RESEARCH = {
  heading: 'The training side',
  body: 'Most people using large models treat them as a black box. My ambition is to work with much larger models eventually — so I am starting at the bottom, where the foundations are, rather than at the API.',
  tracks: [
    {
      k: 'Pre-training',
      title: 'A ~200M-parameter language model, from scratch',
      body: 'Tokenizer, training loop, evaluation — the whole pipeline, built rather than imported. Small enough to actually finish and understand; large enough that every mistake shows up in the loss.',
      state: 'In progress',
    },
    {
      k: 'Fine-tuning',
      title: '70B-class open models with QLoRA',
      body: 'Quantised low-rank adaptation on curated domain data — where the compute limits are real and the technique has to carry the result.',
      state: 'Experimented',
    },
    {
      k: 'Data',
      title: 'Dataset curation and cleaning',
      body: 'Deduplication, filtering, and eval-first pipeline design. The unglamorous half that decides whether the training run was worth the electricity.',
      state: 'Ongoing',
    },
  ],
  discipline: 'One arXiv paper a week, re-implemented in PyTorch.',
} as const;

export const SKILLS = [
  { group: 'Languages', items: ['Python', 'Rust', 'TypeScript', 'C/C++', 'SQL'] },
  { group: 'ML / Deep learning', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'NumPy', 'Pandas', 'OpenCV'] },
  { group: 'GenAI / LLMs', items: ['Transformers', 'Hugging Face', 'LangChain / LangGraph', 'RAG + vector DBs', 'QLoRA', 'Whisper (on-device)'] },
  { group: 'Data & training', items: ['Dataset curation', 'Tokenizers', 'LLM evals', 'Synthetic data'] },
  { group: 'MLOps / Cloud', items: ['Docker', 'FastAPI', 'AWS', 'Linux', 'Git', 'CI/CD'] },
  { group: 'Security', items: ['Kali Linux', 'Burp Suite', 'OWASP Top 10', 'TryHackMe'] },
] as const;

/** Every one of these is unearned so far. Labelled as such, deliberately. */
export const CERTIFICATIONS = [
  { name: 'AWS Cloud Practitioner', state: 'In progress', when: '2026' },
  { name: 'TryHackMe Jr Penetration Tester', state: 'Target', when: '2026' },
  { name: 'AWS Solutions Architect Associate', state: 'Target', when: '2027' },
  { name: 'DeepLearning.AI Deep Learning Specialization', state: 'Target', when: '2027' },
  { name: 'AWS Machine Learning Specialty', state: 'Target', when: '2028' },
] as const;

/** Scroll chapters — the training run. Each is one "epoch". */
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
