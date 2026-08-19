/* ============================================================
   CONFIG — edit these before you publish.
   Anything you don't have yet, leave as '#'; the link will
   still render, it just won't go anywhere until you fill it in.
   ============================================================ */
const CONFIG = {
  github: "https://github.com/arnavmishra4",
  linkedin: "#", // add your LinkedIn URL
  kaggle: "#",   // add your Kaggle profile URL
  neurosightGithub: "https://github.com/arnavmishra4", // point at the actual NeuroSight repo
  sonarGithub: "https://github.com/arnavmishra4",
  sonarDemo: "#", // HF Spaces Gradio demo URL
  lungGithub: "https://github.com/arnavmishra4",
  hrpeGithub: "#",
  hrpePaper: "#", // IEEE Xplore link once available
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   CONTENT DATA
   ============================================================ */
const STAGES = [
  {
    idx: "M1", tag: "Segmentation", name: "3D Attention Res-UNet",
    metric: "0.885 Dice",
    body: `A 3D residual U-Net with attention gating, trained directly on multi-sequence MRI
      volumes to segment tumor sub-regions. The attention gates sit in the decoder and learn to
      suppress irrelevant background tissue while amplifying tumor-relevant features at every
      upsampling stage — instead of the network treating the whole volume with equal weight,
      it learns where to look before it decides what it's looking at.`,
    chips: ["PyTorch", "MONAI", "3D CNN", "Attention Gating"]
  },
  {
    idx: "M2", tag: "Physics-Informed Modeling", name: "Fisher-KPP PINN",
    metric: "μD · μR · γ extracted",
    body: `A physics-informed neural network constrained by the Fisher-KPP reaction-diffusion
      equation — the standard PDE for modeling how gliomas invade brain tissue. Instead of
      learning growth patterns as an unconstrained black box, the network is penalized for
      violating the PDE, which forces it to recover patient-specific biophysical parameters —
      diffusion rate (μD), proliferation rate (μR), and a growth-scaling term (γ) — from paired
      longitudinal MRI scans. Those parameters become interpretable classification signals for
      the next stage, not just numbers a black-box model invented.`,
    chips: ["PINNs", "Reaction-Diffusion PDE", "PyTorch", "Longitudinal MRI"]
  },
  {
    idx: "M3", tag: "Progression Classification", name: "XGBoost + MLP Ensemble",
    metric: "84% acc · 0.81 AUC · n=638",
    body: `Combines the biophysical parameters from M2 with imaging-derived features in a
      gradient-boosted + MLP ensemble to separate <strong>true progression</strong> from
      <strong>pseudoprogression</strong> and treatment response — the exact distinction that
      determines whether a patient needs another round of chemotherapy. Labels came from LUMIERE
      RANO ratings; splits were done with <strong>GroupShuffleSplit on patient ID</strong> to stop
      leakage across scans of the same patient. Predictions are Platt-calibrated, so a confidence
      score actually means what it says — which matters when the next step is escalation to a
      clinician.`,
    chips: ["XGBoost", "Platt Calibration", "GroupShuffleSplit", "RANO Labels"]
  },
  {
    idx: "M4", tag: "Report Generation", name: "RAG Clinical Report Generator",
    metric: "FAISS + PubMedBERT + Gemini",
    body: `Retrieves relevant clinical literature via FAISS similarity search over
      <strong>PubMedBERT</strong> embeddings, then grounds a Gemini-based generator in that
      retrieved evidence to produce a structured clinical report — segmentation findings, growth
      parameters, progression call, and supporting citations in one document. Source PDFs are
      parsed with PDFPlumber and chunked with a recursive character splitter before indexing.
      Grounding the generation in retrieved evidence is what keeps this from being just an LLM
      making things up with extra steps.`,
    chips: ["RAG", "FAISS", "PubMedBERT", "Gemini API"]
  },
  {
    idx: "M5", tag: "Liquid Biopsy Signal", name: "Pleiades — cfDNA Subtype Transformer",
    metric: "synthetic methylation data",
    body: `A hierarchical transformer, inspired by the Pleiades architecture, trained on synthetic
      cell-free DNA (cfDNA) methylation data to classify glioma subtypes. This is the pipeline's
      reach toward a non-invasive, liquid-biopsy-style signal — extending diagnosis beyond
      imaging alone, into the kind of biomarker data that could eventually reduce how often a
      patient needs another scan.`,
    chips: ["Hierarchical Transformer", "Synthetic Data", "cfDNA Methylation"]
  },
  {
    idx: "AGT", tag: "Orchestration", name: "NeuroBio Agent — LangGraph ReAct Loop",
    metric: "6 tools · bounded 3-iteration loop",
    body: `Sits on top of all five models as a <strong>bounded ReAct-loop agent</strong> built on
      LangGraph's StateGraph, capped at 3 iterations so it can't spiral. It autonomously queries
      six biomedical sources — <strong>PubMed, ClinicalTrials.gov, bioRxiv, OMIM, DrugBank</strong>,
      and the FAISS RAG index — evaluates what comes back, and refines its next query based on
      what it just found, looping until a stopping condition is met and it can generate a grounded
      hypothesis. Low-confidence predictions from M3 are <strong>automatically escalated to a
      human</strong> rather than silently resolved — the one place in the pipeline where the system
      is deliberately built to say "I'm not sure."`,
    chips: ["LangGraph", "ReAct Agent", "Tool Calling", "Human Escalation"]
  }
];

const PROJECTS = [
  {
    kicker: "Geospatial ML · Production System",
    title: "SONAR 2.0",
    desc: "A 4-model AI ensemble that fuses satellite imagery, LiDAR elevation, and hydrological data into a single confidence score for ranking candidate archaeological sites.",
    points: [
      "3-service architecture — React frontend, Node/Express API, Python ML service — behind an nginx reverse proxy with TLS and path-based routing",
      "Dynamic request-batching queue + GPU-resident single-batch inference across the 4-model ensemble, with reusable values pre-computed once at startup",
      "Docker Compose deployment with per-service health checks; processed 50+ GB of satellite and elevation data to surface 135 candidate sites, validated against 18 known reference locations"
    ],
    links: [
      { label: "Repo", href: "sonarGithub" },
      { label: "Live demo", href: "sonarDemo" }
    ]
  },
  {
    kicker: "Computer Vision · Inference Deployment",
    title: "Lung Cancer Histopathology Classifier",
    desc: "End-to-end image classification service detecting lung cancer subtypes from histopathology slides, from training through lab-ready deployment.",
    points: [
      "ViT-Base fine-tuned to 99% accuracy across subtypes, then converted from PyTorch to a TensorRT engine for near-real-time inference",
      "TensorRT engine wrapped in a FastAPI service handling preprocessing, inference, and confidence scoring server-side — no local PyTorch setup needed to query it",
      "Fully containerized with Docker; modular CLI built with Optuna + Weights & Biases for reproducible training runs"
    ],
    links: [
      { label: "Repo", href: "lungGithub" }
    ]
  },
  {
    kicker: "Generative Audio · Peer-Reviewed",
    title: "H-RPE Music Generation",
    desc: "A custom Harmonic Relative Positional Encoding layer built into a two-stage Transformer, enforcing music-theory constraints directly inside attention.",
    points: [
      "Directional harmonic bias matrices integrated into multi-head attention — constraints live in the mechanism itself, not a post-hoc correction pass",
      "Improved Self-Similarity Matrix Distance (SSMD) over a strong baseline, producing more structurally coherent generated music",
      "Peer-reviewed and accepted at IEEE CCIC 2025"
    ],
    links: [
      { label: "Paper", href: "hrpePaper" },
      { label: "Repo", href: "hrpeGithub" }
    ]
  }
];

const RESEARCH = [
  {
    venue: "IEEE CCIC 2025 · Peer-Reviewed",
    title: "Harmonic Relative Positional Encoding for Constrained Music Generation",
    desc: "Introduces H-RPE, a novel attention-mechanism layer that enforces music-theoretic harmonic constraints inside Transformer architectures for structured generative modeling.",
    status: "published",
    statusLabel: "Published",
    href: "hrpePaper"
  },
  {
    venue: "Biomedical Signal Processing and Control (Elsevier, Q1) · Under Review",
    title: "Quantum-Classical Hybrid Framework for Bacterial Image Classification",
    desc: "A hybrid pipeline — EfficientNetB0 feature extraction → PCA → 3-qubit variational quantum circuit — for Gram-stained bacterial image classification under severe data scarcity. 87% accuracy / 0.86 F1, a 47.78-point gain over a classical CNN baseline and 8.05 points over a prior hybrid model.",
    status: "review",
    statusLabel: "Under review",
    href: null
  }
];

const STACK = [
  { title: "Deployment & Infra", tags: ["Docker", "FastAPI", "ONNX Runtime", "TensorRT", "BentoML", "nginx", "GitHub Actions", "Gradio", "Streamlit"] },
  { title: "Orchestration & Scaling", tags: ["DDP / FSDP", "Mixed Precision", "Gradient Checkpointing", "Dynamic Batching", "GPU-Resident Inference", "torch.compile", "Flash Attention"] },
  { title: "LLM & Agent Systems", tags: ["LangGraph", "LangChain", "LlamaIndex", "RAG", "Tool Calling", "vLLM", "Ollama"] },
  { title: "ML & Frameworks", tags: ["PyTorch", "TensorFlow", "Keras", "HF Transformers", "timm", "scikit-learn"] },
  { title: "Data Engineering", tags: ["NumPy", "Pandas", "Polars", "MONAI", "SimpleITK", "GDAL", "Rasterio"] },
  { title: "MLOps & Experimentation", tags: ["Weights & Biases", "Optuna", "MLflow", "DVC", "Git"] },
];

const ROLES = [
  "physics-informed clinical AI.",
  "multimodal diagnostic pipelines.",
  "agentic RAG systems.",
  "production ML infrastructure.",
  "custom attention mechanisms."
];

/* ============================================================
   RENDER: STAGES
   ============================================================ */
const stagesEl = document.getElementById("stages");
STAGES.forEach((s, i) => {
  const el = document.createElement("div");
  el.className = "stage reveal";
  el.innerHTML = `
    <button class="stage-head" aria-expanded="false">
      <span class="stage-idx">${s.idx}</span>
      <span class="stage-head-text">
        <span class="stage-tag">${s.tag}</span>
        <span class="stage-name">${s.name}</span>
      </span>
      <span class="stage-metric">${s.metric}</span>
      <span class="stage-chevron">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </span>
    </button>
    <div class="stage-body">
      <div class="stage-body-inner">
        <p>${s.body}</p>
        <div class="stage-chips">${s.chips.map(c => `<span>${c}</span>`).join("")}</div>
      </div>
    </div>
  `;
  stagesEl.appendChild(el);

  const head = el.querySelector(".stage-head");
  const body = el.querySelector(".stage-body");
  head.addEventListener("click", () => {
    const isOpen = el.classList.contains("open");
    // close others
    stagesEl.querySelectorAll(".stage.open").forEach(other => {
      if (other !== el) {
        other.classList.remove("open");
        other.querySelector(".stage-head").setAttribute("aria-expanded", "false");
        other.querySelector(".stage-body").style.maxHeight = null;
      }
    });
    el.classList.toggle("open", !isOpen);
    head.setAttribute("aria-expanded", String(!isOpen));
    body.style.maxHeight = !isOpen ? body.scrollHeight + "px" : null;
  });
});
// open the first stage by default
stagesEl.querySelector(".stage-head")?.click();

/* ============================================================
   RENDER: PROJECTS
   ============================================================ */
const projectGridEl = document.getElementById("projectGrid");
PROJECTS.forEach(p => {
  const card = document.createElement("div");
  card.className = "project-card reveal";
  card.innerHTML = `
    <p class="project-kicker">${p.kicker}</p>
    <h3 class="project-title">${p.title}</h3>
    <p class="project-desc">${p.desc}</p>
    <ul class="project-points">${p.points.map(pt => `<li>${pt}</li>`).join("")}</ul>
    <div class="project-foot">
      ${p.links.map(l => `<a class="project-link" href="${CONFIG[l.href] || '#'}" target="_blank" rel="noopener">${l.label} ↗</a>`).join("")}
    </div>
  `;
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
  projectGridEl.appendChild(card);
});

/* ============================================================
   RENDER: RESEARCH
   ============================================================ */
const researchListEl = document.getElementById("researchList");
RESEARCH.forEach(r => {
  const el = document.createElement("div");
  el.className = "research-item reveal";
  el.innerHTML = `
    <div>
      <p class="research-venue">${r.venue}</p>
      <h3 class="research-title">${r.title}</h3>
      <p class="research-desc">${r.desc}</p>
    </div>
    ${
      r.href
        ? `<a class="research-status ${r.status}" href="${CONFIG[r.href] || '#'}" target="_blank" rel="noopener">${r.statusLabel} ↗</a>`
        : `<span class="research-status ${r.status}">${r.statusLabel}</span>`
    }
  `;
  researchListEl.appendChild(el);
});

/* ============================================================
   RENDER: STACK
   ============================================================ */
const stackGridEl = document.getElementById("stackGrid");
STACK.forEach(g => {
  const el = document.createElement("div");
  el.className = "stack-group reveal";
  el.innerHTML = `
    <p class="stack-group-title">${g.title}</p>
    <div class="stack-tags">${g.tags.map(t => `<span>${t}</span>`).join("")}</div>
  `;
  stackGridEl.appendChild(el);
});

/* ============================================================
   WIRE UP CONFIG LINKS (contact + pipeline repo link)
   ============================================================ */
document.querySelectorAll("[data-config-link]").forEach(a => {
  const key = a.getAttribute("data-config-link");
  if (CONFIG[key]) a.setAttribute("href", CONFIG[key]);
});

/* ============================================================
   TYPEWRITER ROLE CYCLER
   ============================================================ */
const typeEl = document.getElementById("typeCycle");
(function typewriter(){
  if (prefersReducedMotion) { typeEl.textContent = ROLES[0]; return; }
  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick(){
    const full = ROLES[roleIdx];
    if (!deleting){
      charIdx++;
      typeEl.textContent = full.slice(0, charIdx);
      if (charIdx === full.length){
        deleting = true;
        return setTimeout(tick, 1600);
      }
    } else {
      charIdx--;
      typeEl.textContent = full.slice(0, charIdx);
      if (charIdx === 0){
        deleting = false;
        roleIdx = (roleIdx + 1) % ROLES.length;
      }
    }
    setTimeout(tick, deleting ? 28 : 42);
  }
  tick();
})();

/* ============================================================
   SIGNAL LABEL CYCLER (hero eyebrow)
   ============================================================ */
const SIGNALS = [
  "MRI T1-CE, patient 0038",
  "Fisher-KPP growth curve, μD=0.31",
  "cfDNA methylation array, synthetic",
  "harmonic attention field, H-RPE",
  "LiDAR elevation delta, tile 0091"
];
const signalLabelEl = document.getElementById("signalLabel");
let signalIdx = 0;
if (!prefersReducedMotion){
  setInterval(() => {
    signalIdx = (signalIdx + 1) % SIGNALS.length;
    signalLabelEl.style.opacity = 0;
    setTimeout(() => {
      signalLabelEl.textContent = SIGNALS[signalIdx];
      signalLabelEl.style.opacity = 1;
    }, 260);
  }, 3400);
  signalLabelEl.style.transition = "opacity .26s ease";
}

/* ============================================================
   HERO CANVAS — morphing biosignal waveform over a node field
   ============================================================ */
(function heroCanvas(){
  const canvas = document.getElementById("signalCanvas");
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let nodes = [];
  const NODE_COUNT = 46;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedNodes();
  }

  function seedNodes(){
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  // waveform shape generators — each returns y-offset for x in [0,1], t = time
  const waves = [
    (x, t) => Math.sin(x * 14 + t) * (0.4 + 0.6 * Math.sin(x * 3)) , // biosignal-ish
    (x, t) => Math.sin(x * 6 + t) * Math.exp(-Math.pow((x - 0.5) * 3, 2)) * 2.2, // growth-pulse
    (x, t) => Math.sin(x * 26 + t * 1.4) * 0.5 + Math.sin(x * 3 + t) * 0.4, // audio-ish
  ];
  let waveA = 0, waveB = 1, waveMix = 0, lastSwitch = 0;

  let t = 0;
  function draw(now){
    t += 0.012;
    ctx.clearRect(0, 0, w, h);

    // node field
    ctx.save();
    for (let i = 0; i < nodes.length; i++){
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++){
        const m = nodes[j];
        const dx = n.x - m.x, dy = n.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130){
          ctx.strokeStyle = `rgba(73,242,200,${(1 - dist / 130) * 0.09})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes){
      ctx.fillStyle = "rgba(157,139,255,0.5)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // morph waveforms every ~7s
    if (t - lastSwitch > 7){
      lastSwitch = t;
      waveA = waveB;
      waveB = (waveB + 1) % waves.length;
    }
    waveMix = Math.min(1, (t - lastSwitch) / 2.2);
    const easeMix = waveMix < 1 ? 1 - Math.pow(1 - waveMix, 3) : 1;

    // waveform line, centered ~58% down
    const midY = h * 0.6;
    const amp = Math.min(h * 0.11, 90);
    ctx.beginPath();
    const steps = 220;
    for (let i = 0; i <= steps; i++){
      const xn = i / steps;
      const yA = waves[waveA](xn, t * 1.6);
      const yB = waves[waveB](xn, t * 1.6);
      const y = midY + (yA * (1 - easeMix) + yB * easeMix) * amp;
      const x = xn * w;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "rgba(73,242,200,0)");
    grad.addColorStop(0.5, "rgba(73,242,200,0.75)");
    grad.addColorStop(1, "rgba(73,242,200,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.6;
    ctx.shadowColor = "rgba(73,242,200,0.5)";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  if (!prefersReducedMotion){
    requestAnimationFrame(draw);
  } else {
    draw(0); // draw a single static frame
  }
})();

/* ============================================================
   STAT COUNTERS
   ============================================================ */
const statEls = document.querySelectorAll(".stat-num");
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();
    function step(now){
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    if (prefersReducedMotion){ el.textContent = target + suffix; }
    else requestAnimationFrame(step);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
statEls.forEach(el => statObserver.observe(el));

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
// re-scan for elements rendered after initial load (stages/projects/etc were just injected above)
document.querySelectorAll(".reveal:not(.is-visible)").forEach(el => revealObserver.observe(el));

/* ============================================================
   NAV: scroll state, active link, mobile menu
   ============================================================ */
const navEl = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = ["pipeline", "projects", "research", "stack", "contact"].map(id => document.getElementById(id));

window.addEventListener("scroll", () => {
  navEl.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = document.querySelector(`.nav-links a[data-section="${id}"]`);
    if (!link) return;
    if (entry.isIntersecting){
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => s && navObserver.observe(s));

const burger = document.getElementById("navBurger");
burger.addEventListener("click", () => {
  const open = navEl.classList.toggle("mobile-open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => {
  navEl.classList.remove("mobile-open");
  burger.classList.remove("open");
}));

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches){
  const dot = document.querySelector(".cursor-dot");
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  (function loop(){
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    dot.style.left = cx + "px";
    dot.style.top = cy + "px";
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll("a, button").forEach(el => {
    el.addEventListener("mouseenter", () => dot.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => dot.classList.remove("cursor-hover"));
  });
}

/* ============================================================
   MISC
   ============================================================ */
document.getElementById("year").textContent = new Date().getFullYear();
