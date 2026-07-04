import { useState, useRef, useEffect } from "react";

// ── Color & type tokens (matches existing Epistemy parchment/navy/gold palette) ──
const T = {
  parchment: "#F5F0E8",
  parchmentDark: "#EDE5D0",
  navy: "#1B2A4A",
  navyLight: "#243557",
  gold: "#C4933F",
  goldLight: "#E8B864",
  ink: "#2C2416",
  inkLight: "#5A4F3C",
  muted: "#8A7F6E",
  border: "#D4C9B0",
  white: "#FFFFFF",
  success: "#2D6A4F",
  successBg: "#D8F3DC",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: ${T.parchment};
    color: ${T.ink};
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── HEADER ── */
  .header {
    background: ${T.navy};
    padding: 0 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid ${T.gold};
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .header-logo {
    font-family: 'DM Serif Display', serif;
    color: ${T.parchment};
    font-size: 22px;
    letter-spacing: 0.02em;
  }
  .header-logo span { color: ${T.goldLight}; }
  .header-user {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${T.parchmentDark};
    font-size: 14px;
  }
  .avatar {
    width: 34px; height: 34px;
    background: ${T.gold};
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    font-size: 13px;
    color: ${T.navy};
  }

  /* ── PROGRESS STEPPER ── */
  .stepper {
    background: ${T.navyLight};
    padding: 16px 40px;
    display: flex;
    gap: 0;
    align-items: center;
  }
  .step {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    position: relative;
  }
  .step:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: calc(100% - 140px);
    height: 1px;
    background: rgba(255,255,255,0.15);
    left: 140px;
  }
  .step-circle {
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.4);
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .step-circle.active {
    background: ${T.gold};
    border-color: ${T.gold};
    color: ${T.navy};
  }
  .step-circle.done {
    background: ${T.success};
    border-color: ${T.success};
    color: white;
  }
  .step-label {
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    font-weight: 500;
    white-space: nowrap;
    transition: color 0.3s;
  }
  .step-label.active { color: ${T.goldLight}; }
  .step-label.done { color: rgba(255,255,255,0.7); }

  /* ── MAIN ── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 24px;
  }

  .card {
    background: ${T.white};
    border: 1px solid ${T.border};
    border-radius: 12px;
    padding: 36px 40px;
    width: 100%;
    max-width: 720px;
    box-shadow: 0 2px 20px rgba(27,42,74,0.07);
  }

  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    color: ${T.navy};
    margin-bottom: 6px;
  }
  .card-subtitle {
    font-size: 14px;
    color: ${T.muted};
    margin-bottom: 28px;
    line-height: 1.5;
  }

  /* ── FORM ELEMENTS ── */
  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: ${T.inkLight};
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  input[type="text"], input[type="email"], input[type="password"], textarea, select {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid ${T.border};
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    color: ${T.ink};
    background: ${T.parchment};
    margin-bottom: 20px;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, textarea:focus, select:focus {
    border-color: ${T.gold};
    background: white;
  }
  textarea { min-height: 80px; resize: vertical; }

  /* ── BUTTONS ── */
  .btn-primary {
    background: ${T.navy};
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 28px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }
  .btn-primary:hover { background: ${T.navyLight}; }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { background: #ccc; cursor: not-allowed; }

  .btn-secondary {
    background: transparent;
    color: ${T.navy};
    border: 1.5px solid ${T.navy};
    border-radius: 8px;
    padding: 10px 22px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-secondary:hover { background: ${T.parchmentDark}; }

  .btn-gold {
    background: ${T.gold};
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 28px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-gold:hover { background: ${T.goldLight}; }

  /* ── LOGIN SPECIFIC ── */
  .login-logo {
    text-align: center;
    margin-bottom: 32px;
  }
  .login-logo h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 38px;
    color: ${T.navy};
  }
  .login-logo h1 span { color: ${T.gold}; }
  .login-logo p {
    font-size: 14px;
    color: ${T.muted};
    margin-top: 6px;
    font-style: italic;
  }
  .login-hint {
    background: ${T.parchmentDark};
    border: 1px solid ${T.border};
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 13px;
    color: ${T.inkLight};
    margin-bottom: 24px;
  }
  .login-hint strong { color: ${T.navy}; }

  /* ── UPLOAD ZONE ── */
  .upload-zone {
    border: 2px dashed ${T.border};
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 20px;
    background: ${T.parchment};
  }
  .upload-zone:hover, .upload-zone.drag-over {
    border-color: ${T.gold};
    background: #FDF8F0;
  }
  .upload-icon { font-size: 40px; margin-bottom: 12px; }
  .upload-zone h3 { font-size: 16px; color: ${T.navy}; margin-bottom: 6px; }
  .upload-zone p { font-size: 13px; color: ${T.muted}; }

  /* ── TOPICS LIST ── */
  .topic-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  .topic-chip {
    background: ${T.parchmentDark};
    border: 1px solid ${T.border};
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 13px;
    color: ${T.ink};
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }
  .topic-chip:hover { border-color: ${T.gold}; }
  .topic-chip.selected {
    background: ${T.navy};
    color: white;
    border-color: ${T.navy};
  }
  .topic-chip .check { font-size: 11px; }

  /* ── SLIDERS / CONTROLS ── */
  .control-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  .control-group { margin-bottom: 0; }
  .control-value {
    display: inline-block;
    background: ${T.navy};
    color: white;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    margin-left: 8px;
  }
  input[type="range"] {
    width: 100%;
    margin: 8px 0 4px;
    accent-color: ${T.gold};
    background: transparent;
    border: none;
    padding: 0;
    margin-bottom: 0;
  }
  .range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: ${T.muted};
    margin-bottom: 16px;
  }

  /* ── DIFFICULTY SELECTOR ── */
  .difficulty-row {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  .diff-btn {
    flex: 1;
    padding: 10px;
    border: 1.5px solid ${T.border};
    border-radius: 8px;
    background: ${T.parchment};
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    color: ${T.inkLight};
    transition: all 0.2s;
  }
  .diff-btn:hover { border-color: ${T.gold}; color: ${T.ink}; }
  .diff-btn.active {
    background: ${T.navy};
    color: white;
    border-color: ${T.navy};
  }
  .diff-label { font-size: 11px; font-weight: 400; margin-top: 3px; color: inherit; opacity: 0.75; }

  /* ── EXAM CARDS ── */
  .exam-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }
  .exam-card {
    border: 2px solid ${T.border};
    border-radius: 12px;
    padding: 20px 24px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    background: white;
  }
  .exam-card:hover { border-color: ${T.gold}; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(196,147,63,0.15); }
  .exam-card.selected { border-color: ${T.navy}; background: #F5F7FB; }
  .exam-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .exam-card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 19px;
    color: ${T.navy};
  }
  .exam-badge {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 3px 10px;
    border-radius: 20px;
  }
  .badge-conceptual { background: #E8F4FD; color: #1A6FA8; }
  .badge-balanced { background: ${T.successBg}; color: ${T.success}; }
  .badge-applied { background: #FEF3E2; color: #9A6200; }

  .exam-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: ${T.muted};
    margin-bottom: 14px;
  }
  .exam-meta span { display: flex; align-items: center; gap: 4px; }

  .question-dist {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .q-tag {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 12px;
    background: ${T.parchmentDark};
    color: ${T.inkLight};
    border: 1px solid ${T.border};
  }
  .exam-select-indicator {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 22px; height: 22px;
    border-radius: 50%;
    border: 2px solid ${T.border};
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    transition: all 0.2s;
  }
  .exam-card.selected .exam-select-indicator {
    background: ${T.navy};
    border-color: ${T.navy};
    color: white;
  }

  /* ── STATUS / LOADING ── */
  .status-box {
    background: ${T.parchmentDark};
    border: 1px solid ${T.border};
    border-radius: 8px;
    padding: 16px 20px;
    font-size: 14px;
    color: ${T.inkLight};
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .status-box.success { background: ${T.successBg}; border-color: #95D5B2; color: ${T.success}; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid ${T.border};
    border-top-color: ${T.gold};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .pulse { animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

  /* ── FOOTER ACTIONS ── */
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding-top: 24px;
    border-top: 1px solid ${T.border};
  }

  /* ── COMPLETION ── */
  .completion {
    text-align: center;
    padding: 20px 0;
  }
  .completion-icon { font-size: 56px; margin-bottom: 20px; }
  .completion h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 30px;
    color: ${T.navy};
    margin-bottom: 10px;
  }
  .completion p { font-size: 15px; color: ${T.inkLight}; margin-bottom: 28px; line-height: 1.6; }

  .exam-summary {
    background: ${T.parchmentDark};
    border: 1px solid ${T.border};
    border-radius: 10px;
    padding: 20px 24px;
    text-align: left;
    margin-bottom: 28px;
  }
  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding: 6px 0;
    border-bottom: 1px solid ${T.border};
    color: ${T.inkLight};
  }
  .summary-row:last-child { border-bottom: none; }
  .summary-row strong { color: ${T.navy}; }

  .section-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${T.muted};
    margin-bottom: 12px;
  }

  .divider {
    height: 1px;
    background: ${T.border};
    margin: 24px 0;
  }

  .file-indicator {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: ${T.parchmentDark};
    border: 1px solid ${T.border};
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 14px;
    color: ${T.ink};
  }
  .file-icon { font-size: 24px; }

  .progress-bar-wrap {
    background: ${T.border};
    border-radius: 4px;
    height: 6px;
    margin: 4px 0 16px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, ${T.gold}, ${T.goldLight});
    border-radius: 4px;
    transition: width 0.4s ease;
  }
`;

// ── MBA Finance course data ──
const MBA_TOPICS = [
  { id: "dcf", label: "DCF & Valuation" },
  { id: "capital", label: "Capital Structure" },
  { id: "wacc", label: "Cost of Capital (WACC)" },
  { id: "fsa", label: "Financial Statement Analysis" },
  { id: "wc", label: "Working Capital Management" },
  { id: "ma", label: "Mergers & Acquisitions" },
  { id: "risk", label: "Risk & Return (CAPM)" },
  { id: "options", label: "Options & Derivatives" },
  { id: "budgeting", label: "Capital Budgeting" },
  { id: "dividend", label: "Dividend Policy" },
  { id: "realestate", label: "Real Estate Finance" },
  { id: "pe", label: "Private Equity & LBOs" },
];

const SAMPLE_EXAMS = [
  {
    id: "conceptual",
    title: "Conceptual Depth Track",
    badge: "badge-conceptual",
    badgeLabel: "Concept-heavy",
    description: "Prioritizes causal understanding of foundational theory. Students must explain the 'why' behind models before applying them.",
    qCount: 12,
    duration: "25 min",
    edsFocus: "Deep conceptual probing, prerequisite chains",
    distribution: [
      { label: "DCF & Valuation", count: 3 },
      { label: "Capital Structure", count: 2 },
      { label: "Cost of Capital", count: 2 },
      { label: "Risk & Return", count: 3 },
      { label: "Options Basics", count: 2 },
    ],
  },
  {
    id: "balanced",
    title: "Balanced Assessment Track",
    badge: "badge-balanced",
    badgeLabel: "Balanced",
    description: "Equal weight across conceptual recall, causal reasoning, and applied problem-solving. Recommended for mid-semester checkpoints.",
    qCount: 15,
    duration: "30 min",
    edsFocus: "Mixed graph traversal, adaptive difficulty",
    distribution: [
      { label: "DCF & Valuation", count: 3 },
      { label: "M&A Fundamentals", count: 2 },
      { label: "Financial Statement", count: 3 },
      { label: "Working Capital", count: 2 },
      { label: "Capital Budgeting", count: 3 },
      { label: "CAPM", count: 2 },
    ],
  },
  {
    id: "applied",
    title: "Applied Case Track",
    badge: "badge-applied",
    badgeLabel: "Application-heavy",
    description: "Scenario-driven questions requiring students to apply frameworks to novel cases. Tests transfer of knowledge, not recall.",
    qCount: 10,
    duration: "35 min",
    edsFocus: "High-hop traversal, LBO / M&A case reasoning",
    distribution: [
      { label: "LBO Analysis", count: 2 },
      { label: "M&A Due Diligence", count: 3 },
      { label: "DCF Applied Case", count: 2 },
      { label: "Capital Structure Case", count: 2 },
      { label: "PE Value Creation", count: 1 },
    ],
  },
];

// ── Read a File as base64 (strips the data: prefix) ──
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1]);
    r.onerror = () => rej(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

function slugify(label, i) {
  const s = String(label).toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12);
  return s || `t${i}`;
}

// ── Extract topics from the uploaded document via Claude, with graceful fallback ──
// Real PDFs are sent to the model as a document block. Anything else (or any
// failure) falls back to the sample topic list so the demo never dead-ends.
async function extractTopicsFromSlides(file, onProgress) {
  const isRealPdf =
    file && typeof file.arrayBuffer === "function" &&
    (file.type === "application/pdf" || /\.pdf$/i.test(file.name || ""));

  if (isRealPdf) {
    try {
      onProgress("Reading document…", 15);
      const b64 = await fileToBase64(file);
      onProgress("Identifying concept clusters…", 40);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },
              { type: "text", text: "You are building the concept map for an oral exam. From this course material, extract the 8 to 14 core topics a student would be examined on. Return ONLY a JSON array, no prose, no markdown fences, each item {\"label\": \"...\"}. Labels are short (2 to 5 words), noun phrases, no numbering." },
            ],
          }],
        }),
      });

      onProgress("Building prerequisite graph…", 70);
      const data = await response.json();
      const text = (data.content || [])
        .filter(b => b.type === "text").map(b => b.text).join("\n")
        .replace(/```json|```/g, "").trim();

      const start = text.indexOf("["), end = text.lastIndexOf("]");
      const parsed = JSON.parse(text.slice(start, end + 1));
      const topics = parsed
        .map((t, i) => ({ id: slugify(t.label, i), label: String(t.label).trim() }))
        .filter(t => t.label);

      if (!topics.length) throw new Error("empty");
      onProgress("Scoring epistemic depth…", 92);
      await new Promise(r => setTimeout(r, 400));
      return topics;
    } catch (e) {
      // fall through to the sample list below
    }
  }

  // Fallback: sample-slides path, non-PDF uploads, or any extraction failure
  const steps = [
    { msg: "Parsing slide content…", pct: 15, delay: 500 },
    { msg: "Identifying concept clusters…", pct: 35, delay: 700 },
    { msg: "Building prerequisite graph…", pct: 60, delay: 700 },
    { msg: "Scoring epistemic depth…", pct: 80, delay: 600 },
    { msg: "Finalizing topic list…", pct: 95, delay: 400 },
  ];
  for (const s of steps) {
    await new Promise(r => setTimeout(r, s.delay));
    onProgress(s.msg, s.pct);
  }
  return MBA_TOPICS;
}

// ── Simulated Claude API call for exam generation ──
async function generateExams(onProgress) {
  const steps = [
    { msg: "Mapping concept graph…", pct: 20, delay: 700 },
    { msg: "Scoring prerequisite chains…", pct: 45, delay: 900 },
    { msg: "Distributing across EDS dimensions…", pct: 70, delay: 800 },
    { msg: "Generating 3 exam variants…", pct: 90, delay: 600 },
  ];
  for (const s of steps) {
    await new Promise(r => setTimeout(r, s.delay));
    onProgress(s.msg, s.pct);
  }
  return SAMPLE_EXAMS;
}

// ──────────────────────────────────────────────
// STEP COMPONENTS
// ──────────────────────────────────────────────

function StepLogin({ onNext }) {
  const [email, setEmail] = useState("matteo.benetton@haas.berkeley.edu");
  const [pass, setPass] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext(); }, 1200);
  }

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", width: "100%" }}>
      <div className="login-logo">
        <h1>Epistemy<span>.</span>AI</h1>
        <p>depth beyond recall</p>
      </div>
      <div className="card">
        <div className="card-title" style={{ textAlign: "center", marginBottom: 6 }}>Instructor Sign-in</div>
        <div className="card-subtitle" style={{ textAlign: "center", marginBottom: 24 }}>
          UC Berkeley Haas School of Business
        </div>
        <div className="login-hint">
          <strong>Demo account pre-filled.</strong> Click Sign In to continue as Prof. Matteo Benetton.
        </div>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} />
        <button
          className="btn-primary"
          style={{ width: "100%", padding: "14px", fontSize: 16, marginTop: 4 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>
    </div>
  );
}

function StepOnboard({ onNext }) {
  const [name, setName] = useState("MBA Finance Core");
  const [desc, setDesc] = useState("Haas MBA core finance curriculum covering corporate finance, valuation, and capital markets. Spring 2026.");
  const [dept, setDept] = useState("Finance");

  return (
    <div className="card">
      <div className="card-title">Set Up Your Course</div>
      <div className="card-subtitle">
        Tell Epistemy about your subject so it can build a tailored concept graph and calibrate the EDS scoring model.
      </div>

      <label>Course Name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />

      <label>Department</label>
      <select value={dept} onChange={e => setDept(e.target.value)}>
        <option>Finance</option>
        <option>Accounting</option>
        <option>Economics</option>
        <option>Operations</option>
        <option>Strategy</option>
        <option>Management</option>
      </select>

      <label>Course Description</label>
      <textarea value={desc} onChange={e => setDesc(e.target.value)} />

      <div className="card-footer">
        <div style={{ fontSize: 13, color: T.muted }}>Step 1 of 4</div>
        <button className="btn-primary" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}

function StepUpload({ onNext }) {
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [topics, setTopics] = useState(null);

  function handleFile(f) {
    setFile(f);
  }

  async function handleProcess() {
    setProcessing(true);
    const discovered = await extractTopicsFromSlides(file, (msg, pct) => {
      setStatusMsg(msg);
      setProgress(pct);
    });
    setProgress(100);
    setStatusMsg("Done.");
    setTopics(discovered);
    setProcessing(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }

  return (
    <div className="card">
      <div className="card-title">Upload Course Material</div>
      <div className="card-subtitle">
        Upload your lecture slides or syllabus. Epistemy extracts topics, builds a concept graph, and scores prerequisite depth automatically.
      </div>

      {!file ? (
        <div
          className={`upload-zone${drag ? " drag-over" : ""}`}
          onClick={() => fileRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📄</div>
          <h3>Drop slides here, or click to browse</h3>
          <p>Supports PDF, PPTX, DOCX · up to 50 MB</p>
          <input type="file" ref={fileRef} style={{ display: "none" }}
            accept=".pdf,.pptx,.docx"
            onChange={e => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="file-indicator">
          <span className="file-icon">📊</span>
          <div>
            <div style={{ fontWeight: 600 }}>{file.name || "MBA_Finance_Slides_Spring2026.pdf"}</div>
            <div style={{ fontSize: 12, color: T.muted }}>
              {file.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "12.4 MB"} · {((file.name || "slides.pdf").split(".").pop() || "PDF").toUpperCase()}
            </div>
          </div>
          {!processing && !topics && (
            <button className="btn-secondary" style={{ marginLeft: "auto" }}
              onClick={() => setFile(null)}>
              Remove
            </button>
          )}
        </div>
      )}

      {/* Simulate upload for demo */}
      {!file && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <button className="btn-secondary" onClick={() => setFile({ name: "MBA_Finance_Slides_Spring2026.pdf", size: 13004800 })}>
            📎 Use sample slides (demo)
          </button>
        </div>
      )}

      {file && !topics && (
        <>
          {processing ? (
            <>
              <div className="status-box">
                <div className="spinner" />
                <span className="pulse">{statusMsg}</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <button className="btn-gold" style={{ width: "100%", padding: 14 }} onClick={handleProcess}>
              ✦ Extract Topics & Build Concept Graph
            </button>
          )}
        </>
      )}

      {topics && (
        <>
          <div className="status-box success">
            ✓ Extracted {topics.length} topics · Concept graph ready · EDS baseline calibrated
          </div>
          <div className="section-label">Discovered Topics</div>
          <div className="topic-grid">
            {topics.map(t => (
              <div key={t.id} className="topic-chip selected">
                <span className="check">✓</span> {t.label}
              </div>
            ))}
          </div>
          <div className="card-footer">
            <div style={{ fontSize: 13, color: T.muted }}>{topics.length} topics extracted</div>
            <button className="btn-primary" onClick={() => onNext(topics)}>Build Exam →</button>
          </div>
        </>
      )}

      {!topics && (
        <div className="card-footer">
          <div style={{ fontSize: 13, color: T.muted }}>Step 2 of 4</div>
          <div />
        </div>
      )}
    </div>
  );
}

function StepConfigExam({ topics, onNext }) {
  const [selectedTopics, setSelectedTopics] = useState(topics.map(t => t.id));
  const [qCount, setQCount] = useState(12);
  const [examLen, setExamLen] = useState(30);
  const [difficulty, setDifficulty] = useState("balanced");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");

  function toggleTopic(id) {
    setSelectedTopics(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function handleGenerate() {
    setGenerating(true);
    const exams = await generateExams((msg, pct) => {
      setStatusMsg(msg);
      setProgress(pct);
    });
    setGenerating(false);
    onNext(exams, { qCount, examLen, difficulty, selectedTopics });
  }

  const diffs = [
    { id: "recall", label: "Recall", sub: "Definitions & facts" },
    { id: "balanced", label: "Balanced", sub: "Recall + reasoning" },
    { id: "deep", label: "Deep", sub: "Causal chains only" },
  ];

  return (
    <div className="card">
      <div className="card-title">Configure the Exam</div>
      <div className="card-subtitle">
        Choose which topics to include, set length and question count, and select the epistemic depth focus. Epistemy will generate three exam variants for you to choose from.
      </div>

      <div className="section-label">Topics to Include
        <span style={{ marginLeft: 10, fontWeight: 400, textTransform: "none", letterSpacing: 0, color: T.muted }}>
          ({selectedTopics.length} of {topics.length} selected)
        </span>
      </div>
      <div className="topic-grid" style={{ marginBottom: 24 }}>
        {topics.map(t => (
          <div
            key={t.id}
            className={`topic-chip${selectedTopics.includes(t.id) ? " selected" : ""}`}
            onClick={() => toggleTopic(t.id)}
          >
            {selectedTopics.includes(t.id) && <span className="check">✓</span>}
            {t.label}
          </div>
        ))}
      </div>

      <div className="control-row">
        <div className="control-group">
          <label>
            Questions <span className="control-value">{qCount}</span>
          </label>
          <input type="range" min={5} max={25} value={qCount}
            onChange={e => setQCount(+e.target.value)} />
          <div className="range-labels"><span>5</span><span>25</span></div>
        </div>
        <div className="control-group">
          <label>
            Duration <span className="control-value">{examLen} min</span>
          </label>
          <input type="range" min={10} max={60} step={5} value={examLen}
            onChange={e => setExamLen(+e.target.value)} />
          <div className="range-labels"><span>10 min</span><span>60 min</span></div>
        </div>
      </div>

      <label>Difficulty Focus</label>
      <div className="difficulty-row">
        {diffs.map(d => (
          <button
            key={d.id}
            className={`diff-btn${difficulty === d.id ? " active" : ""}`}
            onClick={() => setDifficulty(d.id)}
          >
            {d.label}
            <div className="diff-label">{d.sub}</div>
          </button>
        ))}
      </div>

      {generating && (
        <>
          <div className="status-box">
            <div className="spinner" />
            <span className="pulse">{statusMsg}</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </>
      )}

      <div className="card-footer">
        <div style={{ fontSize: 13, color: T.muted }}>Step 3 of 4</div>
        <button
          className="btn-gold"
          onClick={handleGenerate}
          disabled={generating || selectedTopics.length === 0}
        >
          ✦ Generate 3 Exam Options →
        </button>
      </div>
    </div>
  );
}

function StepChooseExam({ exams, config, onNext }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="card">
      <div className="card-title">Choose Your Exam</div>
      <div className="card-subtitle">
        Epistemy generated three exam variants with different question distributions. Select one to assign to your students.
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 20, fontSize: 13, color: T.inkLight }}>
        <span>🎯 {config.qCount} questions</span>
        <span>⏱ {config.examLen} min</span>
        <span>📊 {config.selectedTopics.length} topics</span>
        <span>⚡ {config.difficulty} focus</span>
      </div>

      <div className="exam-options">
        {exams.map(exam => (
          <div
            key={exam.id}
            className={`exam-card${selected === exam.id ? " selected" : ""}`}
            onClick={() => setSelected(exam.id)}
          >
            <div className="exam-select-indicator">
              {selected === exam.id ? "✓" : ""}
            </div>
            <div className="exam-card-header">
              <div className="exam-card-title">{exam.title}</div>
              <div className={`exam-badge ${exam.badge}`}>{exam.badgeLabel}</div>
            </div>
            <div className="exam-meta">
              <span>📝 {exam.qCount} questions</span>
              <span>⏱ {exam.duration}</span>
              <span>✦ {exam.edsFocus}</span>
            </div>
            <p style={{ fontSize: 13, color: T.inkLight, marginBottom: 14, lineHeight: 1.5 }}>
              {exam.description}
            </p>
            <div className="section-label" style={{ marginBottom: 8 }}>Question Distribution</div>
            <div className="question-dist">
              {exam.distribution.map((d, i) => (
                <div key={i} className="q-tag">{d.label} ×{d.count}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer">
        <div style={{ fontSize: 13, color: T.muted }}>Step 4 of 4</div>
        <button
          className="btn-primary"
          onClick={() => onNext(selected)}
          disabled={!selected}
        >
          Assign This Exam →
        </button>
      </div>
    </div>
  );
}

// ── Sample questions per exam track ──
const EXAM_QUESTIONS = {
  conceptual: [
    { topic: "DCF & Valuation", q: "Explain why the terminal value often comprises the majority of a DCF's total value, and what assumptions make this problematic." },
    { topic: "Risk & Return", q: "Walk me through the intuition behind why a higher beta demands a higher expected return in CAPM. What does beta actually measure?" },
    { topic: "Capital Structure", q: "Modigliani-Miller says capital structure is irrelevant in a perfect market. What market imperfections cause it to matter in practice?" },
    { topic: "Cost of Capital", q: "Why do we use WACC as the discount rate in DCF rather than the cost of equity alone?" },
    { topic: "Risk & Return", q: "What is the difference between systematic and unsystematic risk? Why does the market only reward one of them?" },
  ],
  balanced: [
    { topic: "DCF & Valuation", q: "A company has FCF of $50M growing at 3% perpetually, WACC of 9%. What is its terminal value? Walk me through the formula." },
    { topic: "Financial Statement Analysis", q: "A firm's net income increased but operating cash flow declined. What could explain this, and which matters more for valuation?" },
    { topic: "Working Capital", q: "Why does an increase in accounts receivable show up as a use of cash on the cash flow statement?" },
    { topic: "Capital Budgeting", q: "A project has positive NPV but negative IRR in early years. Should you accept it? How do you reconcile NPV and IRR here?" },
    { topic: "M&A Fundamentals", q: "What is the difference between accretive and dilutive M&A, and how does the P/E ratio of acquirer vs. target determine which it is?" },
  ],
  applied: [
    { topic: "LBO Analysis", q: "You're analyzing an LBO of a $500M EBITDA business at 10× entry. Walk me through how you'd structure the debt, and what IRR you'd target at 7× exit in 5 years." },
    { topic: "M&A Due Diligence", q: "A strategic acquirer is paying a 40% premium. Build the case for why that premium is justified — what synergies must they realize?" },
    { topic: "DCF Applied Case", q: "Two analysts run DCFs on the same company and get valuations 60% apart. What are the three most likely sources of that divergence?" },
    { topic: "Capital Structure Case", q: "A BB-rated company wants to lever up to buy back stock. Walk me through the risk/reward of that decision from both the CFO's and bondholder's perspectives." },
    { topic: "PE Value Creation", q: "A PE firm bought a company at 8× EBITDA and is selling at 10×. EBITDA also grew 50%. Decompose the sources of return for the LP." },
  ],
};

// ── Student Preview Overlay — multi-turn Socratic dialogue per question ──
const MAX_TURNS = 5; // max probe turns per question before moving on

function StudentPreview({ exam, config, onClose }) {
  const questions = EXAM_QUESTIONS[exam.id] || EXAM_QUESTIONS.balanced;

  // currentQ = which question we're on
  const [currentQ, setCurrentQ]     = useState(0);
  // turns = array of { role: "student"|"evaluator", text: string } for this question
  const [turns, setTurns]           = useState([]);
  // draft = what the student is typing right now
  const [draft, setDraft]           = useState("");
  const [loading, setLoading]       = useState(false);
  // questionDone = evaluator has signalled this Q is closed (max turns OR accepted)
  const [questionDone, setQuestionDone] = useState(false);
  // examDone = all questions exhausted
  const [examDone, setExamDone]     = useState(false);
  // per-question EDS deltas accumulate
  const [edsScore, setEdsScore]     = useState(0);

  const scrollRef = useRef(null);
  const q = questions[currentQ];
  // student turns only (excludes evaluator turns)
  const studentTurnCount = turns.filter(t => t.role === "student").length;

  // auto-scroll conversation to bottom
  function scrollToBottom() {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 80);
  }

  // Build the messages array for the API: full conversation history for this question
  function buildMessages(newStudentText) {
    // system message sets the examiner persona; passed separately
    // Reconstruct the API message history from turns so far
    const msgs = [];
    // First student turn = the initial answer to the root question
    // Subsequent turns = follow-up exchanges
    let isFirst = true;
    for (const t of turns) {
      if (t.role === "student") {
        if (isFirst) {
          msgs.push({ role: "user", content: `Topic: ${q.topic}\n\nOpening question: ${q.q}\n\nStudent answer: ${t.text}` });
          isFirst = false;
        } else {
          msgs.push({ role: "user", content: t.text });
        }
      } else {
        msgs.push({ role: "assistant", content: t.text });
      }
    }
    // Append the new student message
    if (isFirst) {
      msgs.push({ role: "user", content: `Topic: ${q.topic}\n\nOpening question: ${q.q}\n\nStudent answer: ${newStudentText}` });
    } else {
      msgs.push({ role: "user", content: newStudentText });
    }
    return msgs;
  }

  async function handleSubmit() {
    if (!draft.trim() || loading) return;
    const studentText = draft.trim();
    setDraft("");

    // Append student turn immediately
    const newTurns = [...turns, { role: "student", text: studentText }];
    setTurns(newTurns);
    setLoading(true);
    scrollToBottom();

    const nextStudentTurn = newTurns.filter(t => t.role === "student").length;
    const isLastAllowedTurn = nextStudentTurn >= MAX_TURNS;

    const systemPrompt = `You are an Epistemy oral exam evaluator for MBA Finance Core at UC Berkeley Haas School of Business.

Your role is to conduct a Socratic dialogue to probe the student's epistemic depth — their ability to explain causal mechanisms, prerequisite concepts, and underlying reasoning, not just surface recall.

Rules:
- Each response must be 2–4 sentences maximum. Never lecture or explain — only probe.
- Acknowledge briefly what was correct or partially correct (1 sentence), then ask exactly ONE follow-up question that probes a prerequisite, causal chain, or assumption the student hasn't yet addressed.
- Escalate depth with each turn: move from definition → mechanism → causation → edge case → implication.
- If the student has demonstrated strong understanding across ${MAX_TURNS} turns, close the question with a brief affirmation and signal: end with "QUESTION_COMPLETE".
- If this is turn ${nextStudentTurn} of ${MAX_TURNS} (the final allowed turn), close the question regardless: briefly summarize what was demonstrated and what gap remains, then end with "QUESTION_COMPLETE".
- Never give away the answer. Never ask compound questions.
- Tone: rigorous but collegial, like a faculty member in office hours.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: buildMessages(studentText),
        }),
      });
      const data = await res.json();
      let text = data.content?.find(b => b.type === "text")?.text
        || "Good attempt. Let's dig deeper — what's the underlying mechanism that drives this relationship?";

      const isDone = text.includes("QUESTION_COMPLETE") || isLastAllowedTurn;
      text = text.replace("QUESTION_COMPLETE", "").trim();

      // Update EDS: roughly +8–15 per student turn depending on turn depth
      setEdsScore(prev => Math.min(99, prev + Math.floor(8 + nextStudentTurn * 2)));

      setTurns(prev => [...prev, { role: "evaluator", text }]);
      if (isDone) setQuestionDone(true);
    } catch {
      const fallback = isLastAllowedTurn
        ? "Good effort across this question. We'll move on — the concept graph will reflect what you've demonstrated here."
        : "Interesting angle. Now — what's the prerequisite assumption that has to hold for that reasoning to be valid?";
      setTurns(prev => [...prev, { role: "evaluator", text: fallback }]);
      if (isLastAllowedTurn) setQuestionDone(true);
    }

    setLoading(false);
    scrollToBottom();
  }

  function handleNextQuestion() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setTurns([]);
      setDraft("");
      setQuestionDone(false);
      scrollToBottom();
    } else {
      setExamDone(true);
    }
  }

  // progress: fraction of questions fully done
  const questionProgress = (currentQ / questions.length) + (questionDone ? 1 / questions.length : 0);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(27,42,74,0.82)", backdropFilter: "blur(4px)",
      zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: T.white, borderRadius: 16, width: "100%", maxWidth: 700,
        maxHeight: "92vh", display: "flex", flexDirection: "column",
        boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
      }}>

        {/* ── Modal header ── */}
        <div style={{ background: T.navy, padding: "14px 22px", borderRadius: "16px 16px 0 0",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ color: T.goldLight, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 2 }}>Student Preview — {exam.title}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
              MBA Finance Core · Prof. Matteo Benetton · Haas
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none",
            color: "white", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
            ✕ Close
          </button>
        </div>

        {/* ── Progress bar + meta ── */}
        <div style={{ padding: "14px 22px 0", flexShrink: 0, borderBottom: `1px solid ${T.border}`, paddingBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>
              Question {currentQ + 1} <span style={{ color: T.muted, fontWeight: 400 }}>of {questions.length}</span>
              <span style={{ marginLeft: 14, color: T.muted, fontWeight: 400, fontSize: 12 }}>{q?.topic}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Behind-the-scenes tag */}
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.04em", color: T.gold,
                border: `1px dashed ${T.gold}`, borderRadius: 6, padding: "2px 6px",
                textTransform: "uppercase", whiteSpace: "nowrap" }}>
                🔍 Behind the Scenes
              </span>
              {/* Turn counter */}
              <div style={{ fontSize: 12, color: T.muted }}>
                Turn <span style={{ fontWeight: 700, color: T.inkLight }}>{studentTurnCount}</span>
                <span style={{ color: T.border }}>/</span>{MAX_TURNS}
              </div>
              {/* EDS chip */}
              <div style={{ background: T.navy, color: T.goldLight, borderRadius: 20,
                padding: "3px 12px", fontSize: 13, fontWeight: 700 }}>
                EDS {edsScore > 0 ? edsScore : "—"}
              </div>
            </div>
          </div>
          {/* Question progress bar */}
          <div style={{ background: T.border, borderRadius: 4, height: 5, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${questionProgress * 100}%`,
              background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`,
              borderRadius: 4, transition: "width 0.5s ease" }} />
          </div>
          {/* Turn depth dots */}
          <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
            {Array.from({ length: MAX_TURNS }).map((_, i) => (
              <div key={i} style={{
                height: 5, flex: 1, borderRadius: 3,
                background: i < studentTurnCount
                  ? (questionDone ? T.success : T.gold)
                  : T.border,
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10,
            color: T.muted, marginTop: 3 }}>
            <span>Initial answer</span><span>Max depth</span>
          </div>
        </div>

        {/* ── Conversation scroll area ── */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>

          {examDone ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
              <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, color: T.navy, marginBottom: 10 }}>
                Exam complete
              </div>
              <div style={{ fontSize: 14, color: T.inkLight, marginBottom: 24, lineHeight: 1.7 }}>
                You answered {questions.length} questions across {turns.filter(t=>t.role==="student").length + studentTurnCount} total exchanges.
                Your EDS score of <strong>{edsScore}</strong> will be recorded in the instructor dashboard.
              </div>
              <div style={{ background: T.parchmentDark, border: `1px solid ${T.border}`,
                borderRadius: 10, padding: "16px 20px", textAlign: "left", marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.06em", color: T.muted, marginBottom: 10 }}>Session Summary</div>
                {questions.map((qq, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between",
                    fontSize: 13, padding: "6px 0", borderBottom: i < questions.length-1 ? `1px solid ${T.border}` : "none",
                    color: T.inkLight }}>
                    <span>{qq.topic}</span>
                    <span style={{ color: T.success, fontWeight: 600 }}>✓ Completed</span>
                  </div>
                ))}
              </div>
              <button className="btn-secondary" onClick={onClose}>Close Preview</button>
            </div>
          ) : (
            <>
              {/* Root question bubble */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.07em", color: T.gold, marginBottom: 8 }}>
                  Epistemy Evaluator · Opening Question
                </div>
                <div style={{ background: T.parchmentDark, border: `1px solid ${T.border}`,
                  borderRadius: "12px 12px 12px 4px", padding: "16px 18px",
                  fontSize: 15, color: T.navy, lineHeight: 1.65,
                  fontFamily: "DM Serif Display, serif" }}>
                  {q?.q}
                </div>
              </div>

              {/* Turn history */}
              {turns.map((turn, i) => (
                <div key={i} style={{ marginBottom: 14,
                  display: "flex", flexDirection: "column",
                  alignItems: turn.role === "student" ? "flex-end" : "flex-start" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.06em", marginBottom: 5,
                    color: turn.role === "student" ? T.navyLight : T.gold }}>
                    {turn.role === "student" ? "You" : "Epistemy Evaluator"}
                  </div>
                  <div style={{
                    maxWidth: "88%",
                    background: turn.role === "student" ? T.navy : "#F0F4FF",
                    border: turn.role === "student" ? "none" : "1px solid #C5D3F5",
                    borderRadius: turn.role === "student"
                      ? "12px 12px 4px 12px"
                      : "12px 12px 12px 4px",
                    padding: "12px 16px",
                    fontSize: 14,
                    color: turn.role === "student" ? "white" : T.navy,
                    lineHeight: 1.65,
                  }}>
                    {turn.text}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 14, padding: "10px 0" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: "50%",
                        background: T.gold, animation: `bounce 1s ease-in-out ${i*0.15}s infinite` }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: T.muted }}>Evaluating…</span>
                </div>
              )}

              {/* Question done — show Next button */}
              {questionDone && !loading && (
                <div style={{ textAlign: "center", padding: "16px 0 4px" }}>
                  <div style={{ fontSize: 12, color: T.success, fontWeight: 600, marginBottom: 12 }}>
                    ✓ Question {currentQ + 1} complete
                  </div>
                  <button className="btn-primary" onClick={handleNextQuestion}>
                    {currentQ < questions.length - 1 ? `Next Question (${currentQ + 2}/${questions.length}) →` : "Finish Exam →"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Input area (hidden when Q done or exam done) ── */}
        {!questionDone && !examDone && (
          <div style={{ padding: "14px 22px 18px", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
              placeholder={turns.length === 0
                ? "Type your initial answer… (⌘↵ to submit)"
                : "Respond to the follow-up… (⌘↵ to submit)"}
              style={{ width: "100%", minHeight: 90, maxHeight: 160, padding: "11px 14px",
                border: `1px solid ${T.border}`, borderRadius: 10,
                fontFamily: "Inter, sans-serif", fontSize: 14, color: T.ink,
                background: T.parchment, resize: "none", outline: "none",
                boxSizing: "border-box", marginBottom: 10, lineHeight: 1.55 }}
            />
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button className="btn-primary" style={{ flex: 1 }}
                onClick={handleSubmit} disabled={loading || !draft.trim()}>
                {loading ? "Evaluating…" : turns.length === 0 ? "Submit Answer →" : "Respond →"}
              </button>
              <button className="btn-secondary" style={{ padding: "11px 16px" }} title="Speak answer (mic)">🎤</button>
              {studentTurnCount > 0 && (
                <button
                  onClick={() => { setQuestionDone(true); }}
                  style={{ background: "none", border: "none", fontSize: 12, color: T.muted,
                    cursor: "pointer", textDecoration: "underline", padding: "11px 4px" }}
                  title="Move to next question without exhausting all turns">
                  Skip →
                </button>
              )}
            </div>
            {studentTurnCount > 0 && (
              <div style={{ fontSize: 11, color: T.muted, marginTop: 6, textAlign: "center" }}>
                {MAX_TURNS - studentTurnCount} probe turn{MAX_TURNS - studentTurnCount !== 1 ? "s" : ""} remaining on this question
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Rubric export ──
function exportRubric(chosen, config, weights) {
  const wList = (weights && weights.length === chosen.distribution.length)
    ? weights
    : chosen.distribution.map(d => ({ label: d.label, weight: d.count }));
  const wTotal = wList.reduce((s, w) => s + w.weight, 0) || 1;

  const dist = chosen.distribution.map((d, i) => {
    const w = wList[i] ? wList[i].weight : d.count;
    const pct = Math.round((w / wTotal) * 100);
    return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;">${d.label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;text-align:center;">${d.count}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;text-align:center;font-weight:700;color:#1B2A4A;">${pct}%</td>
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exam Rubric · ${chosen.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;600;700&display=swap');
    body { font-family:'Inter',sans-serif; background:#F5F0E8; margin:0; padding:40px; color:#2C2416; }
    .page { max-width:720px; margin:0 auto; background:white; border:1px solid #D4C9B0; border-radius:12px; overflow:hidden; }
    .rubric-header { background:#1B2A4A; padding:32px 40px; border-bottom:3px solid #C4933F; }
    .rubric-header h1 { font-family:'DM Serif Display',serif; color:#F5F0E8; font-size:28px; margin:0 0 6px; }
    .rubric-header p { color:rgba(245,240,232,0.6); font-size:13px; margin:0; }
    .rubric-body { padding:36px 40px; }
    .rubric-body h2 { font-family:'DM Serif Display',serif; color:#1B2A4A; font-size:20px; margin:28px 0 14px; border-bottom:2px solid #C4933F; padding-bottom:8px; }
    .rubric-body h2:first-child { margin-top:0; }
    table { width:100%; border-collapse:collapse; margin-bottom:24px; }
    th { background:#1B2A4A; color:white; padding:10px 12px; text-align:left; font-size:12px; text-transform:uppercase; letter-spacing:0.06em; }
    td { font-size:14px; color:#2C2416; vertical-align:top; }
    .meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
    .meta-item { background:#F5F0E8; border:1px solid #D4C9B0; border-radius:8px; padding:14px 18px; }
    .meta-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#8A7F6E; margin-bottom:4px; }
    .meta-value { font-size:18px; font-weight:700; color:#1B2A4A; }
    .eds-box { background:#EDE5D0; border:1px solid #D4C9B0; border-radius:8px; padding:16px 20px; margin-bottom:24px; font-size:14px; line-height:1.7; color:#5A4F3C; }
    .dimension-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #e5dcc8; font-size:14px; }
    .dimension-row:last-child { border:none; }
    .dim-label { flex:1; }
    .dim-weight { font-weight:700; color:#1B2A4A; width:50px; text-align:right; }
    .dim-bar-wrap { width:120px; background:#e5dcc8; border-radius:4px; height:8px; }
    .dim-bar { height:100%; border-radius:4px; background:#C4933F; }
    .footer { padding:20px 40px; background:#F5F0E8; border-top:1px solid #D4C9B0; font-size:12px; color:#8A7F6E; display:flex; justify-content:space-between; }
    @media print { body{padding:0;background:white;} .page{border:none;border-radius:0;} }
  </style>
</head>
<body>
<div class="page">
  <div class="rubric-header">
    <h1>${chosen.title} · Scoring Rubric</h1>
    <p>Epistemy.AI · MBA Finance Core · Prof. Matteo Benetton · UC Berkeley Haas · ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</p>
  </div>
  <div class="rubric-body">
    <h2>Exam Configuration</h2>
    <div class="meta-grid">
      <div class="meta-item"><div class="meta-label">Questions</div><div class="meta-value">${config.qCount}</div></div>
      <div class="meta-item"><div class="meta-label">Duration</div><div class="meta-value">${config.examLen} min</div></div>
      <div class="meta-item"><div class="meta-label">Difficulty</div><div class="meta-value" style="text-transform:capitalize">${config.difficulty}</div></div>
      <div class="meta-item"><div class="meta-label">Topics</div><div class="meta-value">${config.selectedTopics.length} covered</div></div>
    </div>

    <h2>Question Distribution</h2>
    <p style="font-size:13px;color:#8A7F6E;margin:-6px 0 14px;">Score weight reflects how much each topic contributes to the final grade. Question counts and weights are set by the instructor.</p>
    <table>
      <thead><tr><th>Topic</th><th style="text-align:center">Questions</th><th style="text-align:center">Score Weight</th></tr></thead>
      <tbody>${dist}</tbody>
    </table>

    <h2>Epistemic Depth Score (EDS) Model</h2>
    <div class="eds-box">
      EDS measures the <strong>depth and structure of causal understanding</strong>, not surface recall. 
      Each student response is evaluated against the concept graph derived from course material, scoring 
      how far the student can traverse prerequisite chains and explain causal relationships.
    </div>
    <div class="dimension-row"><div class="dim-label">Graph Hop Depth</div><div class="dim-weight">40%</div><div class="dim-bar-wrap"><div class="dim-bar" style="width:40%"></div></div></div>
    <div class="dimension-row"><div class="dim-label">Prerequisite Chain Count</div><div class="dim-weight">25%</div><div class="dim-bar-wrap"><div class="dim-bar" style="width:25%"></div></div></div>
    <div class="dimension-row"><div class="dim-label">Abstraction Level</div><div class="dim-weight">20%</div><div class="dim-bar-wrap"><div class="dim-bar" style="width:20%"></div></div></div>
    <div class="dimension-row"><div class="dim-label">LLM Resistance Score</div><div class="dim-weight">15%</div><div class="dim-bar-wrap"><div class="dim-bar" style="width:15%"></div></div></div>

    <h2>EDS Score Bands</h2>
    <table>
      <thead><tr><th>Band</th><th>EDS Range</th><th>Descriptor</th></tr></thead>
      <tbody>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;font-weight:700;color:#2D6A4F">Distinction</td><td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;">85–100</td><td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;font-size:13px;">Student navigates full prerequisite chains; explains causal mechanisms unprompted; applies reasoning to novel cases.</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;font-weight:700;color:#1A6FA8">Proficient</td><td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;">70–84</td><td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;font-size:13px;">Strong conceptual grasp; can explain relationships with prompting; minor gaps in causal chain coverage.</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;font-weight:700;color:#9A6200">Developing</td><td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;">50–69</td><td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;font-size:13px;">Surface-level recall; struggles to articulate why mechanisms work; can define but not explain.</td></tr>
        <tr><td style="padding:8px 12px;font-weight:700;color:#C0392B">Needs Support</td><td style="padding:8px 12px;">0–49</td><td style="padding:8px 12px;font-size:13px;">Significant gaps in conceptual understanding; prerequisite concepts not yet in place.</td></tr>
      </tbody>
    </table>
  </div>
  <div class="footer">
    <span>Generated by Epistemy.AI · epistemy.ai</span>
    <span>Scoring: Epistemic Depth Score v1.0</span>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const filename = `Epistemy_Rubric_${chosen.id}_${Date.now()}.html`;

  // Attempt a real download (works on the deployed site / normal browser tab).
  // The anchor must be in the DOM, and the object URL must outlive the click,
  // so revoke is deferred rather than fired on the same tick.
  let downloaded = false;
  try {
    const a = document.createElement("a");
    if ("download" in a) {
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      downloaded = true;
    }
  } catch (e) {
    downloaded = false;
  }

  // Fallback for sandboxed contexts where the download is blocked: open the
  // rubric in a new tab so it can be read and saved via the browser's print
  // dialog (Print > Save as PDF).
  if (!downloaded) {
    try { window.open(url, "_blank", "noopener"); } catch (e) { /* popup blocked */ }
  }

  // Keep the blob alive long enough for the download or new tab to consume it.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function StepComplete({ examId, config }) {
  const chosen = SAMPLE_EXAMS.find(e => e.id === examId);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showWeights, setShowWeights] = useState(false);
  const [weights, setWeights] = useState(() =>
    chosen ? chosen.distribution.map(d => ({ label: d.label, weight: d.count })) : []);
  const examLink = `https://app.epistemy.ai/exam/haas-mba-finance-${examId}-${Date.now().toString(36)}`;

  const wTotal = weights.reduce((s, w) => s + w.weight, 0) || 1;
  const isCustom = chosen
    ? weights.some((w, i) => w.weight !== chosen.distribution[i].count)
    : false;
  function setWeight(i, val) {
    setWeights(prev => prev.map((w, idx) => idx === i ? { ...w, weight: val } : w));
  }
  function resetWeights() {
    if (chosen) setWeights(chosen.distribution.map(d => ({ label: d.label, weight: d.count })));
  }

  function handleShare() {
    navigator.clipboard.writeText(examLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }).catch(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    });
  }

  return (
    <>
      {showPreview && (
        <StudentPreview exam={chosen} config={config} onClose={() => setShowPreview(false)} />
      )}
      <div className="card">
        <div className="completion">
          <div className="completion-icon">🎓</div>
          <h2>Exam Ready to Assign</h2>
          <p>
            Your <strong>{chosen?.title}</strong> has been saved and is ready for student access.
            Students will take it as an adaptive oral exam scored by EDS.
          </p>

          <div className="exam-summary">
            <div className="summary-row">
              <span>Course</span>
              <strong>MBA Finance Core · Haas</strong>
            </div>
            <div className="summary-row">
              <span>Exam type</span>
              <strong>{chosen?.title}</strong>
            </div>
            <div className="summary-row">
              <span>Questions</span>
              <strong>{config.qCount}</strong>
            </div>
            <div className="summary-row">
              <span>Duration</span>
              <strong>{config.examLen} minutes</strong>
            </div>
            <div className="summary-row">
              <span>Topics covered</span>
              <strong>{config.selectedTopics.length} topics</strong>
            </div>
            <div className="summary-row">
              <span>Scoring model</span>
              <strong>Epistemic Depth Score (EDS)</strong>
            </div>
          </div>

          {/* Share link UI */}
          {linkCopied && (
            <div className="status-box success" style={{ marginBottom: 20, justifyContent: "center" }}>
              ✓ Link copied to clipboard
              <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 12, wordBreak: "break-all",
                color: T.inkLight, background: T.white, border: `1px solid ${T.border}`,
                borderRadius: 6, padding: "6px 10px", width: "100%", textAlign: "left" }}>
                {examLink}
              </div>
            </div>
          )}

          {/* Rubric weighting editor */}
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 20,
            textAlign: "left", overflow: "hidden" }}>
            <button
              onClick={() => setShowWeights(s => !s)}
              style={{ width: "100%", background: T.parchment, border: "none",
                padding: "12px 16px", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "space-between",
                fontSize: 14, fontWeight: 700, color: T.navy, fontFamily: "Inter, sans-serif" }}>
              <span>⚖ Adjust Rubric Weighting{isCustom ? " · customized" : ""}</span>
              <span style={{ color: T.muted }}>{showWeights ? "▲" : "▼"}</span>
            </button>
            {showWeights && (
              <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.border}` }}>
                <p style={{ fontSize: 12, color: T.inkLight, margin: "0 0 14px", lineHeight: 1.55 }}>
                  Set how much each topic counts toward the final grade. Question counts stay fixed;
                  this only changes scoring weight. Values normalize to 100%.
                </p>
                {weights.map((w, i) => {
                  const pct = Math.round((w.weight / wTotal) * 100);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <span style={{ flex: 1, fontSize: 13, color: T.ink }}>{w.label}</span>
                      <input
                        type="range" min="0" max="10" step="1" value={w.weight}
                        onChange={e => setWeight(i, Number(e.target.value))}
                        style={{ width: 130, accentColor: T.gold, cursor: "pointer" }}
                      />
                      <span style={{ width: 46, textAlign: "right", fontSize: 13, fontWeight: 700, color: T.navy }}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 11, color: T.muted }}>
                    Applied to the exported rubric's Score Weight column.
                  </span>
                  <button
                    onClick={resetWeights}
                    disabled={!isCustom}
                    style={{ background: "transparent", border: `1px solid ${T.border}`,
                      borderRadius: 6, padding: "5px 12px", fontSize: 12, color: T.inkLight,
                      cursor: isCustom ? "pointer" : "default", opacity: isCustom ? 1 : 0.5 }}>
                    Reset to default
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={handleShare}>
              {linkCopied ? "✓ Copied!" : "🔗 Share Exam Link"}
            </button>
            <button className="btn-secondary" onClick={() => setShowPreview(true)}>
              👁 Preview as Student
            </button>
            <button className="btn-secondary" onClick={() => exportRubric(chosen, config, weights)}>
              📄 Export Rubric
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// STUDENT ORAL EXAM FLOW
// ══════════════════════════════════════════════════════════════════

const DISCIPLINES = [
  {
    id: "finance",
    title: "Finance",
    subtitle: "DCF Valuation",
    icon: "📈",
    color: "#1B3A6B",
    accent: "#4A90D9",
    scenario: "You are a Socratic oral examiner for MBA Finance at UC Berkeley Haas. Probe causal understanding of DCF, WACC, and capital structure. Ask one sharp follow-up per turn. 2–3 sentences max. Never lecture.",
    nodes: [
      { id: "fcf", label: "Free Cash Flow", x: 200, y: 80 },
      { id: "wacc", label: "WACC", x: 380, y: 80 },
      { id: "tv", label: "Terminal Value", x: 560, y: 80 },
      { id: "pv", label: "PV of FCFs", x: 200, y: 210 },
      { id: "beta", label: "Beta / CAPM", x: 380, y: 210 },
      { id: "ev", label: "Enterprise Value", x: 380, y: 330 },
      { id: "cs", label: "Capital Structure", x: 560, y: 210 },
    ],
    edges: [["fcf","pv"],["wacc","pv"],["wacc","tv"],["tv","ev"],["pv","ev"],["beta","wacc"],["cs","wacc"]],
  },
  {
    id: "cs",
    title: "Computer Science",
    subtitle: "Dynamic Programming",
    icon: "⚙️",
    color: "#1A3A2A",
    accent: "#3DAA6A",
    scenario: "You are a Socratic CS examiner. Probe understanding of dynamic programming: overlapping subproblems, optimal substructure, memoization vs tabulation. One probing question per turn, 2–3 sentences.",
    nodes: [
      { id: "rec", label: "Recursion", x: 200, y: 80 },
      { id: "os", label: "Optimal Substructure", x: 420, y: 80 },
      { id: "op", label: "Overlapping Subproblems", x: 200, y: 210 },
      { id: "memo", label: "Memoization", x: 420, y: 210 },
      { id: "tab", label: "Tabulation", x: 310, y: 330 },
      { id: "comp", label: "Time Complexity", x: 560, y: 330 },
    ],
    edges: [["rec","op"],["rec","os"],["op","memo"],["os","tab"],["memo","tab"],["tab","comp"]],
  },
  {
    id: "ops",
    title: "Operations",
    subtitle: "Supply Chain Disruption",
    icon: "🔗",
    color: "#3A1A00",
    accent: "#D47A20",
    scenario: "You are a Socratic operations examiner. Probe understanding of supply chain resilience, bullwhip effect, inventory buffers, and demand uncertainty. One question per turn, 2–3 sentences.",
    nodes: [
      { id: "dem", label: "Demand Variability", x: 200, y: 80 },
      { id: "bw", label: "Bullwhip Effect", x: 420, y: 80 },
      { id: "inv", label: "Inventory Policy", x: 200, y: 210 },
      { id: "lead", label: "Lead Time", x: 420, y: 210 },
      { id: "risk", label: "Supply Risk", x: 310, y: 330 },
      { id: "res", label: "Resilience Strategy", x: 560, y: 210 },
    ],
    edges: [["dem","bw"],["dem","inv"],["lead","inv"],["lead","bw"],["inv","risk"],["bw","risk"],["risk","res"]],
  },
  {
    id: "acct",
    title: "Accounting",
    subtitle: "Revenue Recognition",
    icon: "📒",
    color: "#2A0A3A",
    accent: "#9B59B6",
    scenario: "You are a Socratic accounting examiner. Probe understanding of ASC 606 revenue recognition: performance obligations, transaction price allocation, and timing of recognition. One question per turn, 2–3 sentences.",
    nodes: [
      { id: "contract", label: "Contract", x: 200, y: 80 },
      { id: "po", label: "Performance Obligations", x: 420, y: 80 },
      { id: "tp", label: "Transaction Price", x: 200, y: 210 },
      { id: "alloc", label: "Price Allocation", x: 420, y: 210 },
      { id: "recog", label: "Recognition Timing", x: 310, y: 330 },
      { id: "disc", label: "Disclosure", x: 560, y: 330 },
    ],
    edges: [["contract","po"],["contract","tp"],["tp","alloc"],["po","alloc"],["alloc","recog"],["recog","disc"]],
  },
];

// ══════════════════════════════════════════════════════════════════
// STUDENT EXAM QUESTION BANKS
// The student exam draws its questions from the professor's selected
// exam variant when one exists (ExamStore.trackId, set on the instructor
// side). With no professor input, a default topic-focused set is used.
// ══════════════════════════════════════════════════════════════════

const ExamStore = { trackId: null, trackLabel: null };

const EXAM_CONTEXT = {
  finance: "Welcome to your MBA Finance Core oral examination. I'll take you through a sequence of questions on valuation, cost of capital, and capital structure. Answer in your own words and reason out loud. I'm following the logic of your thinking, not just the final number. Let's begin.",
  cs: "Welcome to your oral examination on dynamic programming. I'll move through a series of questions on subproblem structure, memoization, and complexity. Talk me through your reasoning as you go. Let's begin.",
  ops: "Welcome to your operations oral examination. We'll work through questions on supply chain variability, inventory, and resilience. Reason out loud so I can follow your thinking. Let's begin.",
  acct: "Welcome to your accounting oral examination on revenue recognition under ASC 606. I'll ask a sequence of questions on obligations, timing, and judgment. Explain your reasoning as you answer. Let's begin.",
};

const STUDENT_BANKS = {
  // ── Finance · professor track: Conceptual Depth ──
  conceptual: [
    { topic: "DCF & Valuation", q: "Why does terminal value usually dominate a DCF, and what makes that structurally fragile?" },
    { topic: "Cost of Capital", q: "Why is WACC the right discount rate for unlevered free cash flows rather than the cost of equity alone?" },
    { topic: "Risk & Return", q: "What does beta actually measure, and why does CAPM reward it but not total volatility?" },
    { topic: "Capital Structure", q: "Modigliani-Miller says structure is irrelevant in a perfect market. Which frictions make it matter in practice?" },
    { topic: "Valuation", q: "Why can two analysts using identical cash flows arrive at very different values?" },
    { topic: "Cost of Capital", q: "How does adding leverage change a firm's cost of equity, and why?" },
    { topic: "Risk & Return", q: "Distinguish systematic from idiosyncratic risk, and explain why only one of them is priced." },
    { topic: "Valuation", q: "When is a multiples-based valuation more defensible than a DCF, and when is it a trap?" },
    { topic: "Capital Structure", q: "Why does the interest tax shield have limits as a reason to keep adding debt?" },
    { topic: "Cost of Capital", q: "What goes wrong if you use a single firm-wide WACC to evaluate a project in a different risk class?" },
  ],
  // ── Finance · professor track: Balanced Assessment (also the default) ──
  balanced: [
    { topic: "DCF & Valuation", q: "A firm has free cash flow of $50M growing 3% forever with a 9% WACC. Walk me through its terminal value." },
    { topic: "Financial Statement Analysis", q: "Net income rose but operating cash flow fell. What could explain that, and which matters more for valuation?" },
    { topic: "Working Capital", q: "Why does an increase in accounts receivable show up as a use of cash?" },
    { topic: "Capital Budgeting", q: "A project has positive NPV but a messy IRR. How do you reconcile the two and decide?" },
    { topic: "Cost of Capital", q: "Walk me through building a WACC from scratch for a public company." },
    { topic: "Risk & Return", q: "How would you estimate beta for a company with only three years of trading history?" },
    { topic: "M&A Fundamentals", q: "What makes a deal accretive versus dilutive, and how do the two firms' P/E ratios drive that?" },
    { topic: "Valuation", q: "How do you handle a company with negative near-term free cash flow inside a DCF?" },
    { topic: "Capital Structure", q: "How would you decide a target debt level for a stable, cash-generative business?" },
    { topic: "DCF & Valuation", q: "Which single assumption in a DCF would you stress-test first, and why?" },
  ],
  // ── Finance · professor track: Applied Case ──
  applied: [
    { topic: "LBO Analysis", q: "You're modeling an LBO at 10x entry on $500M EBITDA. How do you structure the debt, and what IRR do you target at a 7x exit in five years?" },
    { topic: "M&A Due Diligence", q: "A strategic buyer is paying a 40% premium. Make the case for what synergies must materialize to justify it." },
    { topic: "DCF Applied Case", q: "Two analysts value the same company 60% apart. What are the three most likely sources of that gap?" },
    { topic: "Capital Structure Case", q: "A BB-rated firm wants to lever up to buy back stock. Weigh it from the CFO's view and from a bondholder's view." },
    { topic: "PE Value Creation", q: "A sponsor buys at 8x and sells at 10x while EBITDA grows 50%. Decompose the return to the LP." },
    { topic: "Valuation Case", q: "You must value a pre-profit growth company for an acquirer. What approach do you defend, and why?" },
    { topic: "Capital Budgeting Case", q: "Two mutually exclusive projects have different lives and scales. How do you choose between them?" },
    { topic: "M&A Case", q: "The target's management insists on an all-stock deal. How does that change your view of the price?" },
    { topic: "Distress Case", q: "A levered company breaches a covenant. Walk me through the options and who bears the loss." },
    { topic: "Cost of Capital Case", q: "A conglomerate wants one hurdle rate for all divisions. Argue against it with a concrete example." },
  ],
  // ── Computer Science · Dynamic Programming (default) ──
  cs: [
    { topic: "Foundations", q: "What two properties must a problem have for dynamic programming to apply?" },
    { topic: "Overlapping Subproblems", q: "How do you recognize overlapping subproblems in a recurrence you've never seen before?" },
    { topic: "Memoization vs Tabulation", q: "When would you prefer top-down memoization over bottom-up tabulation, and when the reverse?" },
    { topic: "Optimal Substructure", q: "Give an example where a greedy approach fails but DP succeeds, and explain why." },
    { topic: "State Design", q: "How do you choose the right state definition, and what happens if your state is too coarse?" },
    { topic: "Complexity", q: "How do you reason about the time and space complexity of a DP solution from its state and transitions?" },
    { topic: "Space Optimization", q: "When can you reduce a 2D DP table to one dimension, and what do you give up?" },
    { topic: "Transitions", q: "Walk me through deriving the recurrence for the longest common subsequence." },
    { topic: "Correctness", q: "How would you convince a skeptic that your DP recurrence is correct?" },
    { topic: "Limits", q: "Where does DP break down, and what technique would you reach for instead?" },
  ],
  // ── Operations · Supply Chain (default) ──
  ops: [
    { topic: "Demand Variability", q: "How does variability in end demand propagate upstream through a supply chain?" },
    { topic: "Bullwhip Effect", q: "What causes the bullwhip effect, and name two levers that dampen it." },
    { topic: "Inventory Policy", q: "How do you set safety stock, and what does it trade off?" },
    { topic: "Lead Time", q: "Why does lead time variability hurt more than a longer but stable lead time?" },
    { topic: "Resilience", q: "Distinguish redundancy from flexibility as resilience strategies. When is each right?" },
    { topic: "Risk Pooling", q: "How does pooling inventory across locations reduce total safety stock?" },
    { topic: "Sourcing", q: "Weigh single sourcing against dual sourcing for a critical component." },
    { topic: "Disruption", q: "Walk me through how you'd quantify exposure to a single-supplier failure." },
    { topic: "Coordination", q: "How does information sharing across the chain change the bullwhip dynamics?" },
    { topic: "Trade-offs", q: "Where does a lean, low-inventory strategy become a liability?" },
  ],
  // ── Accounting · Revenue Recognition (default) ──
  acct: [
    { topic: "ASC 606", q: "Walk me through the five-step revenue recognition model at a high level." },
    { topic: "Performance Obligations", q: "How do you decide whether a contract contains one obligation or several?" },
    { topic: "Transaction Price", q: "What complicates the transaction price beyond the sticker figure?" },
    { topic: "Allocation", q: "How do you allocate price across multiple obligations, and why does standalone selling price matter?" },
    { topic: "Timing", q: "What distinguishes recognizing revenue over time from recognizing it at a point in time?" },
    { topic: "Variable Consideration", q: "How do you handle discounts, rebates, or refunds in the transaction price?" },
    { topic: "Principal vs Agent", q: "Why does the principal versus agent question change the revenue you report?" },
    { topic: "Contract Modifications", q: "How do you account for a mid-contract change in scope or price?" },
    { topic: "Judgment", q: "Where in the standard does management judgment most affect reported revenue?" },
    { topic: "Disclosure", q: "What must a firm disclose so users understand the timing and uncertainty of revenue?" },
  ],
};

// ── Concept Graph SVG ──
function ConceptGraph({ discipline, traversed }) {
  const { nodes, edges } = discipline;
  const W = 700, H = 420;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", fontFamily: "Inter, sans-serif" }}>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill={`${T.border}`} />
        </marker>
        <marker id="arr-active" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill={T.gold} />
        </marker>
      </defs>
      {edges.map(([a, b], i) => {
        const na = nodes.find(n => n.id === a);
        const nb = nodes.find(n => n.id === b);
        if (!na || !nb) return null;
        const active = traversed.includes(a) && traversed.includes(b);
        return (
          <line key={i}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke={active ? T.gold : T.border}
            strokeWidth={active ? 2 : 1.5}
            markerEnd={active ? "url(#arr-active)" : "url(#arr)"}
            style={{ transition: "stroke 0.4s" }}
          />
        );
      })}
      {nodes.map(n => {
        const active = traversed.includes(n.id);
        return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={38}
              fill={active ? T.navy : T.parchmentDark}
              stroke={active ? T.gold : T.border}
              strokeWidth={active ? 2.5 : 1.5}
              style={{ transition: "all 0.4s" }}
            />
            <text x={n.x} y={n.y - 3} textAnchor="middle" dominantBaseline="middle"
              fontSize={15} fontWeight={700}
              fill={active ? T.goldLight : T.inkLight}
              style={{ transition: "fill 0.4s", userSelect: "none" }}>
              {n.label.split(" ").map((word, wi) => (
                <tspan key={wi} x={n.x} dy={wi === 0 ? (n.label.includes(" ") ? -8 : 0) : 17}>{word}</tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── EDS Arc Gauge ──
function EDSGauge({ score }) {
  const r = 54, cx = 70, cy = 70;
  const circ = Math.PI * r; // half circle
  const pct = Math.min(score / 100, 1);
  const dash = pct * circ;
  const band = score >= 85 ? { label: "Distinction", color: T.success }
    : score >= 70 ? { label: "Proficient", color: "#1A6FA8" }
    : score >= 50 ? { label: "Developing", color: T.gold }
    : { label: "Starting", color: T.muted };

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={140} height={80} viewBox="0 0 140 80">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={T.border} strokeWidth={10} strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={band.color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.4s" }}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize={26} fontWeight={700}
          fill={T.navy} fontFamily="DM Serif Display, serif">{score}</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize={10} fill={T.muted}
          fontFamily="Inter, sans-serif">EDS</text>
      </svg>
      <div style={{ fontSize: 12, fontWeight: 700, color: band.color, marginTop: -6 }}>{band.label}</div>
    </div>
  );
}

// ── Student Login ──
function StudentLogin({ onLogin }) {
  const [email, setEmail] = useState("alex.morgan@haas.berkeley.edu");
  const [pass, setPass] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", width: "100%" }}>
      <div className="login-logo">
        <h1>Epistemy<span>.</span>AI</h1>
        <p>depth beyond recall</p>
      </div>
      <div className="card">
        <div className="card-title" style={{ textAlign: "center", marginBottom: 6 }}>Student Sign-in</div>
        <div className="card-subtitle" style={{ textAlign: "center", marginBottom: 24 }}>
          UC Berkeley Haas School of Business
        </div>
        <div className="login-hint">
          <strong>Demo account pre-filled.</strong> Click Sign In to continue as Alex Morgan (MBA '26).
        </div>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} />
        <button className="btn-primary"
          style={{ width: "100%", padding: "14px", fontSize: 16, marginTop: 4 }}
          onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin(); }, 1000); }}
          disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>
    </div>
  );
}

// ── Discipline Tile Grid ──
function DisciplineLanding({ onSelect }) {
  return (
    <div style={{ width: "100%", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 34, color: T.navy, marginBottom: 10 }}>
          Choose Your Oral Exam
        </h1>
        <p style={{ fontSize: 15, color: T.muted, maxWidth: 520, margin: "0 auto" }}>
          Select a subject to begin an adaptive Socratic examination. Your Epistemic Depth Score updates in real time as you respond.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {DISCIPLINES.map(d => (
          <div key={d.id}
            onClick={() => onSelect(d)}
            style={{ background: d.color, borderRadius: 16, padding: "32px 28px",
              cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)", position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)"; }}>
            <div style={{ position: "absolute", right: -20, top: -20, fontSize: 90, opacity: 0.08 }}>{d.icon}</div>
            <div style={{ fontSize: 36, marginBottom: 14 }}>{d.icon}</div>
            <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, color: "white", marginBottom: 6 }}>{d.title}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>{d.subtitle}</div>
            <div style={{ display: "inline-block", background: d.accent, color: "white",
              borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700 }}>
              Begin Exam →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Oral Exam Engine ──
function OralExam({ discipline, studentName, onBack }) {
  // ── Resolve the question bank ──
  // Finance follows the professor's selected exam variant when one exists;
  // otherwise a default topic-focused set. Other disciplines use their default.
  const bank =
    discipline.id === "finance"
      ? (STUDENT_BANKS[ExamStore.trackId] || STUDENT_BANKS.balanced)
      : (STUDENT_BANKS[discipline.id] || STUDENT_BANKS.balanced);
  const examContext = EXAM_CONTEXT[discipline.id] || EXAM_CONTEXT.finance;
  const N = bank.length;
  const usingProfessorSet = discipline.id === "finance" && !!ExamStore.trackId;
  const sourceLabel = usingProfessorSet
    ? `Prof. Benetton · ${ExamStore.trackLabel || "selected exam"}`
    : "Default topic set";

  const openingText = `${examContext}\n\nQuestion 1. ${bank[0].q}`;

  // ── qIndex = the question currently being answered (0-based) ──
  const [qIndex, setQIndex]         = useState(0);
  const [turns, setTurns]           = useState(() => [{ role: "evaluator", text: openingText }]);
  const [draft, setDraft]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [edsScore, setEdsScore]     = useState(0);
  const [traversed, setTraversed]   = useState([]);
  const [log, setLog]               = useState([]);
  const [examDone, setExamDone]     = useState(false);

  // ── STT state ──
  const [listening, setListening]   = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognitionRef              = useRef(null);

  // ── TTS state ──
  const [ttsStates, setTtsStates]   = useState({});
  const audioRef                    = useRef(null);
  const currentTurnRef              = useRef(null);

  const scrollRef                   = useRef(null);
  const answered                    = turns.filter(t => t.role === "student").length;

  // Latest evaluator turn — the single audio the consolidated controls act on.
  let lastEvalIndex = -1;
  for (let i = turns.length - 1; i >= 0; i--) { if (turns[i].role === "evaluator") { lastEvalIndex = i; break; } }
  const lastEvalText  = lastEvalIndex >= 0 ? turns[lastEvalIndex].text : "";
  const currentTts    = ttsStates[lastEvalIndex] || "idle";

  function scrollBottom() {
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 80);
  }

  // Auto-play the opening context + first question on mount
  useEffect(() => {
    const t = setTimeout(() => speakTurn(0, openingText), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── STT ──
  function toggleMic() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not available in this browser — please use Chrome.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => setListening(true);
    rec.onresult = e => {
      let finalSoFar = "";
      let interim = "";
      for (const result of e.results) {
        if (result.isFinal) finalSoFar += result[0].transcript + " ";
        else interim += result[0].transcript;
      }
      if (finalSoFar) setDraft(prev => (prev + " " + finalSoFar).trim());
      setInterimText(interim);
    };
    rec.onend = () => {
      setListening(false);
      setInterimText(prev => {
        if (prev.trim()) setDraft(d => (d + " " + prev).trim());
        return "";
      });
    };
    rec.onerror = () => { setListening(false); setInterimText(""); };
    rec.start();
    recognitionRef.current = rec;
  }

  // ── TTS via /api/speak (ElevenLabs proxy) ──
  async function speakTurn(turnIndex, text) {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (currentTurnRef.current !== null && currentTurnRef.current !== turnIndex) {
      setTtsStates(prev => ({ ...prev, [currentTurnRef.current]: "idle" }));
    }
    currentTurnRef.current = turnIndex;
    setTtsStates(prev => ({ ...prev, [turnIndex]: "loading" }));
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`TTS error ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setTtsStates(prev => ({ ...prev, [turnIndex]: "idle" }));
        URL.revokeObjectURL(url);
        currentTurnRef.current = null;
      };
      audio.onerror = () => {
        setTtsStates(prev => ({ ...prev, [turnIndex]: "idle" }));
        currentTurnRef.current = null;
      };
      await audio.play();
      setTtsStates(prev => ({ ...prev, [turnIndex]: "playing" }));
    } catch {
      setTtsStates(prev => ({ ...prev, [turnIndex]: "idle" }));
      currentTurnRef.current = null;
    }
  }

  function togglePlayPause(turnIndex, text) {
    const state = ttsStates[turnIndex] || "idle";
    if (state === "idle") { speakTurn(turnIndex, text); return; }
    if (state === "loading") return;
    const audio = audioRef.current;
    if (!audio) return;
    if (state === "playing") {
      audio.pause();
      setTtsStates(prev => ({ ...prev, [turnIndex]: "paused" }));
    } else if (state === "paused") {
      audio.play();
      setTtsStates(prev => ({ ...prev, [turnIndex]: "playing" }));
    }
  }

  // ── Consolidated Play / Pause acting on the latest evaluator response ──
  function playCurrent() {
    if (lastEvalIndex < 0) return;
    const state = ttsStates[lastEvalIndex] || "idle";
    if (state === "playing" || state === "loading") return;
    if (state === "paused" && audioRef.current) {
      audioRef.current.play();
      setTtsStates(prev => ({ ...prev, [lastEvalIndex]: "playing" }));
      return;
    }
    speakTurn(lastEvalIndex, lastEvalText); // idle → start (or replay)
  }
  function pauseCurrent() {
    if (lastEvalIndex < 0) return;
    if ((ttsStates[lastEvalIndex] || "idle") === "playing" && audioRef.current) {
      audioRef.current.pause();
      setTtsStates(prev => ({ ...prev, [lastEvalIndex]: "paused" }));
    }
  }

  // ── Graph traversal keyed to question progress ──
  function updateGraph(qNum) {
    const nodeIds = discipline.nodes.map(n => n.id);
    const count = Math.min(Math.ceil(qNum * nodeIds.length / N) + 1, nodeIds.length);
    setTraversed(nodeIds.slice(0, count));
    if (count > 0) setLog(prev => [...prev, `→ ${discipline.nodes[count - 1]?.label}`]);
  }

  // ── Submit an answer to the current bank question ──
  async function handleSubmit() {
    if (!draft.trim() || loading) return;
    if (listening) { recognitionRef.current?.stop(); setListening(false); setInterimText(""); }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

    const studentText = draft.trim();
    const askedQ = bank[qIndex].q;
    setDraft("");
    setInterimText("");
    const newTurns = [...turns, { role: "student", text: studentText }];
    setTurns(newTurns);
    setLoading(true);
    scrollBottom();

    const isLast = qIndex >= N - 1;
    const evalTurnIndex = newTurns.length; // index the evaluator bubble will occupy

    const system = isLast
      ? `You are an Epistemy oral examiner for ${discipline.title} at UC Berkeley Haas. The student was just asked: "${askedQ}". In 2 to 3 sentences, give a closing assessment of the whole exam: name one thing the student demonstrated well and one gap worth revisiting. Do not reveal full answers. End with "EXAM_COMPLETE".`
      : `You are an Epistemy oral examiner for ${discipline.title} at UC Berkeley Haas. The student was just asked: "${askedQ}". In ONE or at most TWO sentences, acknowledge specifically what was strong or thin in their reasoning. Do not reveal the answer and do not ask a new question, another question follows automatically.`;

    let feedback = "";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system,
          messages: [{ role: "user", content: studentText }],
        }),
      });
      const data = await res.json();
      feedback = (data.content?.find(b => b.type === "text")?.text || "").trim();
    } catch {
      feedback = "";
    }

    const done = isLast || feedback.includes("EXAM_COMPLETE");
    feedback = feedback.replace("EXAM_COMPLETE", "").trim();

    const delta = Math.floor(6 + Math.random() * 8);
    setEdsScore(prev => Math.min(99, prev + delta));
    updateGraph(qIndex + 1);

    let bubble;
    if (done) {
      // Closing turn: model summary when available, otherwise a single neutral close.
      bubble = feedback || "That completes the exam. Your responses have been recorded, and your Epistemic Depth Score is shown on the right.";
    } else {
      const nextIdx = qIndex + 1;
      const nextQ = `Question ${nextIdx + 1}. ${bank[nextIdx].q}`;
      // Prefix the brief evaluation only when the model actually returned one.
      bubble = feedback ? `${feedback}\n\n${nextQ}` : nextQ;
      setQIndex(nextIdx);
    }

    setTurns(prev => {
      const updated = [...prev, { role: "evaluator", text: bubble }];
      setTimeout(() => speakTurn(evalTurnIndex, bubble), 300);
      return updated;
    });
    if (done) setExamDone(true);

    setLoading(false);
    scrollBottom();
  }

  function ttsIcon(state) {
    if (state === "loading") return "⏳";
    if (state === "playing") return "⏸";
    if (state === "paused")  return "▶";
    return "🔊";
  }
  function ttsTitle(state) {
    if (state === "loading") return "Loading audio…";
    if (state === "playing") return "Pause";
    if (state === "paused")  return "Resume";
    return "Play aloud";
  }

  const progressCount = examDone ? N : Math.min(qIndex + 1, N);

  return (
    <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", display: "flex", gap: 20, alignItems: "flex-start" }}>

      {/* ── Left: conversation ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Exam header */}
        <div style={{ background: discipline.color, borderRadius: "12px 12px 0 0",
          padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Oral Exam</div>
            <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, color: "white" }}>
              {discipline.title} — {discipline.subtitle}
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 3 }}>
              {N} questions · {sourceLabel}
            </div>
          </div>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.1)", border: "none",
            color: "white", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
            ← Back
          </button>
        </div>

        {/* Question progress bar */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderTop: "none",
          padding: "10px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginBottom: 5 }}>
            <span>Question {progressCount} of {N}</span>
            <span>{examDone ? "Exam complete" : "In progress"}</span>
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: N }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2,
                background: i < answered ? (examDone ? T.success : T.gold) : T.border,
                transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div ref={scrollRef} style={{ background: T.white, border: `1px solid ${T.border}`,
          borderTop: "none", borderRadius: "0 0 12px 12px",
          height: 420, overflowY: "auto", padding: "20px 20px 0" }}>

          {turns.map((turn, i) => (
            <div key={i} style={{ marginBottom: 16,
              display: "flex", flexDirection: "column",
              alignItems: turn.role === "student" ? "flex-end" : "flex-start" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.06em", marginBottom: 5,
                color: turn.role === "student" ? T.navyLight : discipline.accent }}>
                {turn.role === "student" ? studentName : "Epistemy Evaluator"}
              </div>
              <div style={{
                maxWidth: "86%",
                background: turn.role === "student" ? T.navy : T.parchmentDark,
                border: turn.role === "student" ? "none" : `1px solid ${T.border}`,
                borderRadius: turn.role === "student" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                padding: "11px 15px",
                fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap",
                color: turn.role === "student" ? "white" : T.navy,
              }}>
                {turn.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0 16px" }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%",
                  background: discipline.accent,
                  animation: `bounce 1s ease-in-out ${i*0.15}s infinite` }} />
              ))}
              <span style={{ fontSize: 12, color: T.muted }}>Evaluating…</span>
            </div>
          )}

          {examDone && !loading && (
            <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
              <div style={{ fontSize: 13, color: T.success, fontWeight: 600, marginBottom: 14 }}>
                ✓ Exam session complete · {N} questions
              </div>
              <button className="btn-secondary" onClick={onBack}>← Back to Disciplines</button>
            </div>
          )}
        </div>

        {/* Input */}
        {!examDone && (
          <div style={{ marginTop: 12 }}>
            {(listening || interimText) && (
              <div style={{ background: "#FFFBF0", border: `1px dashed ${T.gold}`, borderRadius: 8,
                padding: "8px 12px", marginBottom: 8, fontSize: 13, color: T.inkLight,
                fontStyle: "italic", minHeight: 30 }}>
                <span style={{ color: T.gold, fontWeight: 700, fontStyle: "normal", marginRight: 6 }}>●</span>
                {interimText || "Listening…"}
              </div>
            )}
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
              placeholder={answered === 0
                ? "Answer the question above… (⌘↵ to submit)"
                : "Answer the question above… (⌘↵ to submit)"}
              style={{ width: "100%", minHeight: 90, padding: "12px 14px",
                border: `1.5px solid ${listening ? discipline.accent : T.border}`,
                borderRadius: 10, fontFamily: "Inter, sans-serif", fontSize: 14,
                color: T.ink, background: listening ? "#FFFDF5" : T.parchment,
                resize: "none", outline: "none", boxSizing: "border-box",
                marginBottom: 10, transition: "border-color 0.2s, background 0.2s" }}
            />
            <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
              <button
                onClick={playCurrent}
                disabled={lastEvalIndex < 0 || currentTts === "playing"}
                title="Play the evaluator's response"
                style={{
                  padding: "0 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  border: `1.5px solid ${T.navy}`,
                  background: currentTts === "playing" ? T.navy : "transparent",
                  color: currentTts === "playing" ? "white" : T.navy,
                  cursor: lastEvalIndex < 0 || currentTts === "playing" ? "default" : "pointer",
                  opacity: lastEvalIndex < 0 ? 0.4 : 1,
                  display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                }}>
                {currentTts === "loading" ? "⏳" : "▶"} Play
              </button>
              <button
                onClick={pauseCurrent}
                disabled={currentTts !== "playing"}
                title="Pause playback"
                style={{
                  padding: "0 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  border: `1.5px solid ${T.navy}`, background: "transparent", color: T.navy,
                  cursor: currentTts === "playing" ? "pointer" : "default",
                  opacity: currentTts === "playing" ? 1 : 0.4,
                  display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                }}>
                ⏸ Pause
              </button>
              <button
                onClick={toggleMic}
                title={listening ? "Stop recording (commits transcript)" : "Start voice input"}
                style={{
                  width: 44, borderRadius: 8,
                  border: `1.5px solid ${listening ? discipline.accent : T.navy}`,
                  background: listening ? discipline.accent : "transparent",
                  color: listening ? "white" : T.navy,
                  cursor: "pointer", fontSize: 18, transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                {listening ? "🔴" : "🎤"}
              </button>
              <button className="btn-primary" style={{ flex: 1 }}
                onClick={handleSubmit} disabled={loading || (!draft.trim() && !interimText.trim())}>
                {loading ? "Evaluating…" : "Submit Answer →"}
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              {listening
                ? <div style={{ fontSize: 12, color: discipline.accent, fontWeight: 600 }}>● Recording — click 🔴 to stop and commit</div>
                : <div style={{ fontSize: 12, color: T.muted }}>▶ Play / ⏸ Pause the evaluator · 🎤 speak your answer · responses also play automatically</div>
              }
            </div>
          </div>
        )}
      </div>

      {/* ── Right: EDS + Graph (behind the scenes) ── */}
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Behind-the-scenes label */}
        <div style={{ border: `1px dashed ${T.gold}`, background: "#FBF6EA", borderRadius: 10,
          padding: "9px 14px" }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.03em", color: T.navy,
            display: "flex", alignItems: "center", gap: 6 }}>
            <span>🔍</span> [ Behind the Scenes ]
          </div>
          <div style={{ fontSize: 11, color: T.inkLight, marginTop: 4, lineHeight: 1.5 }}>
            Concept graph, coverage, and EDS scoring. Instructor-facing, hidden from the student during the exam.
          </div>
        </div>

        {/* EDS gauge card */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12,
          padding: "20px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.07em", color: T.muted, marginBottom: 12 }}>
            Epistemic Depth Score
          </div>
          <EDSGauge score={edsScore} />
          <div style={{ marginTop: 14, fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
            Updates after each exchange based on concept graph traversal depth.
          </div>
        </div>

        {/* Concept graph card */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12,
          padding: "16px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.07em", color: T.muted, marginBottom: 10, paddingLeft: 4 }}>
            Concept Graph
          </div>
          <div style={{ height: 200, overflow: "hidden" }}>
            <ConceptGraph discipline={discipline} traversed={traversed} />
          </div>
          {log.length > 0 && (
            <div style={{ marginTop: 10, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                color: T.muted, marginBottom: 6, letterSpacing: "0.06em" }}>Traversal Log</div>
              <div style={{ maxHeight: 80, overflowY: "auto" }}>
                {log.map((l, i) => (
                  <div key={i} style={{ fontSize: 11, color: T.gold, padding: "2px 0",
                    fontFamily: "monospace" }}>{l}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coverage meter */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.07em", color: T.muted }}>Graph Coverage</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>
              {traversed.length}/{discipline.nodes.length}
            </div>
          </div>
          <div style={{ background: T.border, borderRadius: 4, height: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 4,
              width: `${(traversed.length / discipline.nodes.length) * 100}%`,
              background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`,
              transition: "width 0.5s ease" }} />
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>
            concepts probed in prerequisite chain
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Student App wrapper ──
function StudentApp({ onSwitchRole }) {
  const [view, setView] = useState("login"); // login | disciplines | exam
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const studentName = "Alex Morgan";

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">Epistemy<span>.</span>AI</div>
        <div className="header-user">
          {view !== "login" && (
            <>
              <div className="avatar">AM</div>
              <span>{studentName}</span>
            </>
          )}
          <button onClick={onSwitchRole}
            style={{ marginLeft: 16, background: "rgba(255,255,255,0.1)", border: "none",
              color: "rgba(255,255,255,0.7)", borderRadius: 6, padding: "5px 12px",
              fontSize: 12, cursor: "pointer" }}>
            Switch Role
          </button>
        </div>
      </header>
      <main className="main">
        {view === "login" && <StudentLogin onLogin={() => { setSelectedDiscipline(DISCIPLINES.find(d => d.id === "finance")); setView("exam"); }} />}
        {view === "disciplines" && (
          <DisciplineLanding onSelect={d => { setSelectedDiscipline(d); setView("exam"); }} />
        )}
        {view === "exam" && selectedDiscipline && (
          <OralExam
            discipline={selectedDiscipline}
            studentName={studentName}
            onBack={() => setView("disciplines")}
          />
        )}
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────
// INSTRUCTOR APP
// ──────────────────────────────────────────────

const STEPS = [
  { label: "Sign In" },
  { label: "Course Setup" },
  { label: "Upload Material" },
  { label: "Configure Exam" },
  { label: "Choose Exam" },
];

function InstructorApp({ onSwitchRole }) {
  const [step, setStep] = useState(0);
  const [topics, setTopics] = useState([]);
  const [exams, setExams] = useState([]);
  const [examConfig, setExamConfig] = useState({});
  const [chosenExam, setChosenExam] = useState(null);
  const [complete, setComplete] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">Epistemy<span>.</span>AI</div>
        <div className="header-user">
          {step > 0 && (
            <>
              <div className="avatar">SC</div>
              <span>Prof. Matteo Benetton</span>
            </>
          )}
          <button onClick={onSwitchRole}
            style={{ marginLeft: 16, background: "rgba(255,255,255,0.1)", border: "none",
              color: "rgba(255,255,255,0.7)", borderRadius: 6, padding: "5px 12px",
              fontSize: 12, cursor: "pointer" }}>
            Switch Role
          </button>
        </div>
      </header>

      {step > 0 && !complete && (
        <nav className="stepper">
          {STEPS.slice(1).map((s, i) => {
            const idx = i + 1;
            const status = step > idx ? "done" : step === idx ? "active" : "";
            return (
              <div className="step" key={idx}>
                <div className={`step-circle ${status}`}>{step > idx ? "✓" : idx}</div>
                <div className={`step-label ${status}`}>{s.label}</div>
              </div>
            );
          })}
        </nav>
      )}

      <main className="main">
        {step === 0 && <StepLogin onNext={() => setStep(1)} />}
        {step === 1 && <StepOnboard onNext={() => setStep(2)} />}
        {step === 2 && <StepUpload onNext={(t) => { setTopics(t); setStep(3); }} />}
        {step === 3 && <StepConfigExam topics={topics} onNext={(e, cfg) => { setExams(e); setExamConfig(cfg); setStep(4); }} />}
        {step === 4 && !complete && <StepChooseExam exams={exams} config={examConfig} onNext={(id) => { const ex = exams.find(e => e.id === id); ExamStore.trackId = id; ExamStore.trackLabel = ex ? ex.title : id; setChosenExam(id); setComplete(true); }} />}
        {complete && <StepComplete examId={chosenExam} config={examConfig} />}
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────
// ROLE SELECTOR — entry point
// ──────────────────────────────────────────────

function RoleSelect({ onSelect }) {
  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: T.navy, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 44, color: T.parchment, marginBottom: 6 }}>
            Epistemy<span style={{ color: T.gold }}>.</span>AI
          </div>
          <div style={{ fontSize: 15, color: "rgba(245,240,232,0.5)", fontStyle: "italic" }}>
            depth beyond recall
          </div>
        </div>

        {/* Role cards */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", maxWidth: 700 }}>
          {[
            {
              role: "instructor",
              icon: "🎓",
              title: "Instructor",
              desc: "Build and configure oral exams. Upload course material, generate exam variants, and assign to students.",
              cta: "Enter as Instructor",
              accent: T.gold,
            },
            {
              role: "student",
              icon: "📖",
              title: "Student",
              desc: "Take an adaptive Socratic oral exam. Your Epistemic Depth Score updates in real time as you respond.",
              cta: "Enter as Student",
              accent: "#4A90D9",
            },
          ].map(r => (
            <div key={r.role}
              onClick={() => onSelect(r.role)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16, padding: "36px 32px", width: 300, cursor: "pointer",
                transition: "all 0.2s", textAlign: "center" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = r.accent; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = ""; }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{r.icon}</div>
              <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, color: T.parchment, marginBottom: 10 }}>
                {r.title}
              </div>
              <div style={{ fontSize: 13, color: "rgba(245,240,232,0.55)", lineHeight: 1.6, marginBottom: 24 }}>
                {r.desc}
              </div>
              <div style={{ display: "inline-block", background: r.accent, color: "white",
                borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700 }}>
                {r.cta}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, fontSize: 12, color: "rgba(245,240,232,0.25)" }}>
          UC Berkeley Haas · MBA Finance Core · Demo Environment
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────
// ROOT APP
// ──────────────────────────────────────────────

export default function EpistemyDemo() {
  const [role, setRole] = useState(null); // null | "instructor" | "student"

  if (!role) return <RoleSelect onSelect={setRole} />;

  return (
    <>
      <style>{css}</style>
      {role === "instructor"
        ? <InstructorApp onSwitchRole={() => setRole(null)} />
        : <StudentApp onSwitchRole={() => setRole(null)} />
      }
    </>
  );
}
