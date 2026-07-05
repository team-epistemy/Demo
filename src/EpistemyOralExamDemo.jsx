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
  .step-clickable { cursor: pointer; }
  .step-clickable:hover .step-circle { border-color: ${T.gold}; color: ${T.goldLight}; }
  .step-clickable:hover .step-label { color: ${T.goldLight}; }

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
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding-right: 34px;
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

// ── Model call. Prefers the app's own /api/chat route (works on the deployed
// site and keeps the Anthropic key server-side); falls back to the direct call,
// which only works inside the Claude preview. Returns the Anthropic JSON. ──
async function callModel(payload) {
  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (r.ok) {
      const data = await r.json();
      if (data && Array.isArray(data.content)) return data;
    }
  } catch { /* route not present, fall through */ }

  const r2 = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await r2.json();
}

// ── Rough local answer-quality estimate (0..1), used only when the model
// evaluation is unavailable so that clear non-answers do not inflate EDS. ──
function answerQuality(text) {
  const t = String(text).trim().toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);
  const nonAnswer =
    words.length < 3 || t.length < 12 ||
    /\b(not sure|unsure|no idea|i don'?t know|dont know|do not know|idk|dunno|no clue|not certain|no answer|nothing|pass|skip)\b/.test(t);
  if (nonAnswer) return 0;
  return Math.min(0.85, 0.25 + words.length / 60); // can't verify correctness locally, so cap it
}

// ── Strip markdown / non-speech tokens before sending text to TTS ──
// Emphasis asterisks, code ticks, underscores, headers, bullets, arrows, and
// stray symbols read awkwardly when spoken, so remove them and tidy spacing.
function cleanForSpeech(text) {
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "$1")        // **bold**
    .replace(/\*(.*?)\*/g, "$1")            // *italic*
    .replace(/\*/g, "")                      // any stray asterisks
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")  // `code`
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")  // _emphasis_
    .replace(/~{1,2}([^~]+)~{1,2}/g, "$1")  // ~strike~
    .replace(/^#{1,6}\s*/gm, "")            // # headers
    .replace(/^\s*[-•·]\s+/gm, "")          // list bullets
    .replace(/[→←↔➜▶◀•·]/g, " ")           // arrows / bullets inline
    .replace(/[|>#]/g, " ")                 // pipes, quote/heading marks
    .replace(/\n{2,}/g, ". ")               // blank lines become a pause
    .replace(/\n/g, " ")
    .replace(/([.!?;:])\s*\.\s+/g, "$1 ")   // avoid doubled punctuation from the pause
    .replace(/\s+([.,!?;:])/g, "$1")        // no space before punctuation
    .replace(/\s{2,}/g, " ")                // collapse runs of spaces
    .trim();
}

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

      const data = await callModel({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },
            { type: "text", text: "You are building the concept map for an oral exam. From this course material, extract the 8 to 14 core topics a student would be examined on. Return ONLY a JSON array, no prose, no markdown fences, each item {\"label\": \"...\"}. Labels are short (2 to 5 words), noun phrases, no numbering." },
          ],
        }],
      });

      onProgress("Building prerequisite graph…", 70);
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
// ── Difficulty character shared by all three generated variants ──
const DIFFICULTY_META = {
  recall: {
    name: "Recall", bankKey: "balanced",
    badge: "badge-conceptual", badgeLabel: "Recall-focused",
    edsFocus: "Definition retrieval, shallow-hop checks",
    blurb: "definitional accuracy and formula recall",
  },
  balanced: {
    name: "Balanced", bankKey: "balanced",
    badge: "badge-balanced", badgeLabel: "Balanced",
    edsFocus: "Mixed recall and causal reasoning",
    blurb: "a mix of recall and causal reasoning",
  },
  deep: {
    name: "Deep", bankKey: "conceptual",
    badge: "badge-applied", badgeLabel: "Depth-focused",
    edsFocus: "High-hop traversal, causal chains",
    blurb: "causal mechanisms and prerequisite chains",
  },
};

// ── Three probing angles applied to whichever difficulty is selected ──
const VARIANT_ANGLES = [
  { key: "even", suffix: "Even Coverage", mode: "even",
    desc: (m, n) => `Probes ${m.blurb} evenly across all ${n} selected concepts. Best when every topic should carry equal weight.` },
  { key: "core", suffix: "Core Emphasis", mode: "front",
    desc: (m) => `Same ${m.blurb}, weighted toward the foundational concepts so gaps in prerequisites surface first.` },
  { key: "frontier", suffix: "Frontier Emphasis", mode: "back",
    desc: (m) => `Same ${m.blurb}, weighted toward the advanced concepts to stretch stronger students.` },
];

// ── Distribute qCount questions across selected concepts (largest-remainder) ──
function distributeQuestions(concepts, qCount, mode) {
  const n = concepts.length;
  if (n === 0) return [];
  let w;
  if (mode === "front")     w = concepts.map((_, i) => n - i);   // earlier topics heavier
  else if (mode === "back") w = concepts.map((_, i) => i + 1);   // later topics heavier
  else                      w = concepts.map(() => 1);           // even
  const wSum = w.reduce((s, x) => s + x, 0) || 1;
  const counts = w.map(x => Math.floor((x / wSum) * qCount));
  let total = counts.reduce((s, x) => s + x, 0);
  const rema = w.map((x, i) => ({ i, frac: (x / wSum) * qCount - counts[i] }))
                .sort((a, b) => b.frac - a.frac);
  let r = 0;
  while (total < qCount) { counts[rema[r % n].i]++; total++; r++; }
  return concepts.map((c, i) => ({ id: c.id, label: c.label, count: counts[i] }))
                 .filter(d => d.count > 0);
}

// ── Build three variants of the selected difficulty from the chosen concepts ──
function buildVariants(config) {
  const { difficulty, selectedTopics, topics, qCount, examLen } = config;
  const meta = DIFFICULTY_META[difficulty] || DIFFICULTY_META.balanced;
  const concepts = (topics || []).filter(t => selectedTopics.includes(t.id));
  return VARIANT_ANGLES.map(a => ({
    id: `${difficulty}-${a.key}`,
    bankKey: meta.bankKey,
    title: `${meta.name} · ${a.suffix}`,
    badge: meta.badge,
    badgeLabel: meta.badgeLabel,
    description: a.desc(meta, concepts.length),
    qCount,
    duration: `${examLen} min`,
    edsFocus: meta.edsFocus,
    distribution: distributeQuestions(concepts, qCount, a.mode),
  }));
}

// ── Question pool keyed by topic id (matches MBA_TOPICS ids). The student exam
// is assembled from the professor's chosen distribution: for each selected topic
// it pulls that topic's number of questions, so topics, counts, and the variant's
// emphasis all flow into what the student actually sees. ──
const QUESTION_POOL = {
  dcf: [
    "Walk me through building a DCF from projected free cash flows to enterprise value.",
    "Why does terminal value usually dominate a DCF, and what makes that fragile?",
    "How do you handle a company with negative near-term free cash flow in a DCF?",
    "Which single DCF assumption would you stress-test first, and why?",
  ],
  capital: [
    "Modigliani-Miller says structure is irrelevant in a perfect market. Which frictions make it matter?",
    "How would you set a target debt level for a stable, cash-generative business?",
    "Why does the interest tax shield have limits as a reason to add debt?",
    "How does adding leverage change a firm's cost of equity, and why?",
  ],
  wacc: [
    "Walk me through building a WACC from scratch for a public company.",
    "Why is WACC the right discount rate for unlevered free cash flows?",
    "What goes wrong if you use one firm-wide WACC for a project in a different risk class?",
    "How do you estimate the cost of equity, and where is it weakest?",
  ],
  fsa: [
    "Net income rose but operating cash flow fell. What explains it, and which matters more?",
    "How do the three financial statements connect to one another?",
    "What early-warning signs would you look for in a company's working capital trends?",
    "How can accrual accounting mask the cash reality of a business?",
  ],
  wc: [
    "Why does an increase in accounts receivable show up as a use of cash?",
    "How does the cash conversion cycle affect a firm's financing needs?",
    "What trade-offs come with tightening supplier payment terms?",
    "How would you free up cash from working capital without hurting operations?",
  ],
  ma: [
    "What makes a deal accretive versus dilutive, and how do P/E ratios drive that?",
    "A buyer is paying a 40% premium. What synergies must materialize to justify it?",
    "How does an all-stock deal change your view of the price versus all-cash?",
    "What are the most common reasons acquisitions destroy value?",
  ],
  risk: [
    "What does beta actually measure, and why does CAPM reward it but not total volatility?",
    "Distinguish systematic from idiosyncratic risk and explain why only one is priced.",
    "How would you estimate beta for a company with a short trading history?",
    "Where does CAPM break down in practice?",
  ],
  options: [
    "Explain the intuition for why an option's value rises with volatility.",
    "Walk me through the payoff of a protective put and when you would use it.",
    "What does put-call parity tell you, and why must it hold?",
    "How would you hedge a currency exposure using derivatives?",
  ],
  budgeting: [
    "A project has positive NPV but a messy IRR. How do you reconcile the two?",
    "Two mutually exclusive projects have different lives and scales. How do you choose?",
    "Why can NPV and IRR disagree, and which do you trust?",
    "How do you treat sunk costs and opportunity costs in a project decision?",
  ],
  dividend: [
    "Why might dividend policy be irrelevant in theory but matter in practice?",
    "How do buybacks compare to dividends as ways to return cash?",
    "What signals does a dividend cut send, and to whom?",
    "How would you decide a payout level for a maturing company?",
  ],
  realestate: [
    "How does leverage change the risk and return profile of a real estate investment?",
    "Walk me through how a cap rate relates to value and required return.",
    "What drives the gap between levered and unlevered IRR in a property deal?",
    "How would you stress-test a real estate pro forma?",
  ],
  pe: [
    "Walk me through the levers that drive returns in an LBO.",
    "You buy at 8x and sell at 10x while EBITDA grows 50%. Decompose the return.",
    "How do you structure the debt in an LBO, and what constrains how much you use?",
    "Why does entry-multiple discipline matter so much to LBO returns?",
  ],
};

const GENERIC_Q = [
  (l) => `Explain the core idea behind ${l} and why it matters.`,
  (l) => `Walk me through a key mechanism or trade-off in ${l}.`,
  (l) => `Where does ${l} most often go wrong in practice?`,
  (l) => `How would you apply ${l} to a real decision?`,
];

// Extra templates used to extend a topic's bank so the professor can add more
// questions per topic than the base pool holds.
const GENERIC_EXTRA = [
  (l) => `Give a concrete example that illustrates ${l}.`,
  (l) => `What is a common misconception about ${l}?`,
  (l) => `How would you explain ${l} to a non-expert?`,
  (l) => `Which assumption behind ${l} is most often overlooked?`,
];

// A topic's full selectable bank: real pooled questions first, then generic
// extensions, so counts can grow well beyond the base pool.
function topicBank(id, label) {
  const base = (QUESTION_POOL[id] && QUESTION_POOL[id].length)
    ? QUESTION_POOL[id].slice()
    : GENERIC_Q.map(fn => fn(label));
  const extra = GENERIC_EXTRA.map(fn => fn(label));
  const seen = new Set();
  return base.concat(extra).filter(q => (seen.has(q) ? false : (seen.add(q), true)));
}

// Assemble the student's question set from a chosen exam's distribution.
function assembleExamQuestions(distribution) {
  const out = [];
  (distribution || []).forEach(d => {
    const pool = QUESTION_POOL[d.id] || null;
    const n = d.count || 0;
    for (let i = 0; i < n; i++) {
      const q = pool ? pool[i % pool.length] : GENERIC_Q[i % GENERIC_Q.length](d.label);
      out.push({ topic: d.label, q });
    }
  });
  return out;
}

async function generateExams(config, onProgress) {
  const steps = [
    { msg: "Mapping concept graph…", pct: 20, delay: 700 },
    { msg: "Scoring prerequisite chains…", pct: 45, delay: 900 },
    { msg: "Distributing across EDS dimensions…", pct: 70, delay: 800 },
    { msg: "Assembling your exam…", pct: 90, delay: 600 },
  ];
  for (const s of steps) {
    await new Promise(r => setTimeout(r, s.delay));
    onProgress(s.msg, s.pct);
  }
  return buildVariants(config);
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
        <h1>Epistemy</h1>
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
        Let Epistemy know about your subject, so it can build a tailored assessment and calibrate scoring accordingly.
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
            <button className="btn-primary" onClick={() => onNext(topics)}>Configure Exam →</button>
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
    const cfg = { qCount, examLen, difficulty, selectedTopics, topics };
    const exams = await generateExams(cfg, (msg, pct) => {
      setStatusMsg(msg);
      setProgress(pct);
    });
    setGenerating(false);
    onNext(exams, cfg);
  }

  const diffs = [
    { id: "recall", label: "Recall", sub: "Definitions & facts" },
    { id: "balanced", label: "Balanced", sub: "Recall + reasoning" },
    { id: "deep", label: "Deep", sub: "Causal reasoning" },
  ];

  return (
    <div className="card">
      <div className="card-title">Configure the Exam</div>

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

      <label>Assessment Focus</label>
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
          ✦ Build Exam →
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
        Epistemy generated three variations of your <strong style={{ textTransform: "capitalize" }}>{config.difficulty}</strong> focus, each probing your selected concepts a little differently. Select one to assign to your students.
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
          onClick={() => onNext(exams.find(e => e.id === selected))}
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
const MAX_TURNS = 3; // max turns per question before moving on

function StudentPreview({ exam, config, onClose }) {
  const finance = DISCIPLINES.find(d => d.id === "finance") || DISCIPLINES[0];
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(20,20,30,0.6)", zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:T.parchment, borderRadius:14, width:"96vw", maxWidth:1220,
        height:"92vh", overflowY:"auto", padding:"0 20px 26px", border:`1px solid ${T.border}`, position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14,
          position:"sticky", top:0, background:T.parchment, padding:"16px 0 10px", zIndex:5 }}>
          <div>
            <div style={{ fontFamily:"DM Serif Display, serif", fontSize:20, color:T.navy }}>Preview as Student</div>
            <div style={{ fontSize:12, color:T.muted }}>Exactly what the student sees, including navigation and the behind-the-scenes panel.</div>
          </div>
          <button onClick={onClose} style={{ background:T.navy, color:"white", border:"none", borderRadius:8,
            padding:"7px 16px", cursor:"pointer", fontSize:13, fontWeight:600 }}>Close ×</button>
        </div>
        <OralExam discipline={finance} studentName="Preview Student" onBack={onClose} previewMode />
      </div>
    </div>
  );
}

function exportRubric(chosen, config, dist, qScores) {
  const rows = (dist && dist.length)
    ? dist
    : chosen.distribution.map(d => ({ label: d.label, count: d.count }));
  const totalQ = rows.reduce((s, r) => s + r.count, 0);

  const distHtml = rows.map(r => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;">${r.label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;text-align:center;font-weight:700;color:#1B2A4A;">${r.count}</td>
    </tr>`).join("");

  const scores = (qScores && qScores.length) ? qScores : [];
  const sTotal = scores.reduce((s, r) => s + r.score, 0) || 1;
  const scoreHtml = scores.map((r, i) => {
    const pct = Math.round((r.score / sTotal) * 100);
    return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;text-align:center;">${i + 1}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;font-size:13px;">${r.q}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;text-align:center;font-weight:700;color:#1B2A4A;">${r.score}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5dcc8;text-align:center;">${pct}%</td>
    </tr>`;
  }).join("");
  const scoreSection = scores.length ? `
    <h2>Question-Level Scoring</h2>
    <p style="font-size:13px;color:#8A7F6E;margin:-6px 0 14px;">Points attributed to each question by the instructor. Share shows each question's contribution to the grade.</p>
    <table>
      <thead><tr><th style="text-align:center">#</th><th>Question</th><th style="text-align:center">Points</th><th style="text-align:center">Share</th></tr></thead>
      <tbody>${scoreHtml}</tbody>
    </table>` : "";

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
    <p>Epistemy · MBA Finance Core · Prof. Matteo Benetton · UC Berkeley Haas · ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</p>
  </div>
  <div class="rubric-body">
    <h2>Exam Configuration</h2>
    <div class="meta-grid">
      <div class="meta-item"><div class="meta-label">Questions</div><div class="meta-value">${totalQ}</div></div>
      <div class="meta-item"><div class="meta-label">Duration</div><div class="meta-value">${config.examLen} min</div></div>
      <div class="meta-item"><div class="meta-label">Difficulty</div><div class="meta-value" style="text-transform:capitalize">${config.difficulty}</div></div>
      <div class="meta-item"><div class="meta-label">Topics</div><div class="meta-value">${config.selectedTopics.length} covered</div></div>
    </div>

    <h2>Question Distribution</h2>
    <p style="font-size:13px;color:#8A7F6E;margin:-6px 0 14px;">Number of questions per topic, set by the instructor.</p>
    <table>
      <thead><tr><th>Topic</th><th style="text-align:center">Questions</th></tr></thead>
      <tbody>${distHtml}</tbody>
    </table>
    ${scoreSection}

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
    <span>Generated by Epistemy</span>
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

function QuestionTranscript({ questions, scoreTotal, setQScore, resetScores, onClose }) {
  const stepStyle = (disabled) => ({
    width: 24, height: 24, borderRadius: 6, border: `1px solid ${T.border}`,
    background: T.white, color: T.navy, fontSize: 16, lineHeight: 1,
    cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1,
    display: "flex", alignItems: "center", justifyContent: "center",
  });
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,20,30,0.55)",
      zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.parchment, borderRadius: 14,
        width: "100%", maxWidth: 720, maxHeight: "86vh", display: "flex", flexDirection: "column",
        overflow: "hidden", border: `1px solid ${T.border}` }}>
        <div style={{ background: T.navy, padding: "16px 22px", display: "flex",
          alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, color: "white" }}>Scoring Weights</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 }}>
              Every question the student will be asked, with the score attributed to it.
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none",
            color: "white", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 16 }}>×</button>
        </div>

        <div style={{ padding: "16px 22px", overflowY: "auto" }}>
          <p style={{ fontSize: 12, color: T.inkLight, margin: "0 0 12px" }}>
            Adjust any score. The share each question contributes to the grade renormalizes automatically.
          </p>
          {questions.map((r, i) => {
            const pct = Math.round((r.score / scoreTotal) * 100);
            return (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start",
                padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: T.navy, color: "white",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: T.gold,
                    letterSpacing: "0.05em", marginBottom: 3 }}>{r.topic}</div>
                  <div style={{ fontSize: 14, color: T.ink, lineHeight: 1.5 }}>{r.q}</div>
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                    <button onClick={() => setQScore(i, r.score - 1)} disabled={r.score <= 0} style={stepStyle(r.score <= 0)}>−</button>
                    <input type="number" min="0" value={r.score}
                      onChange={e => setQScore(i, Math.max(0, Number(e.target.value) || 0))}
                      style={{ width: 48, textAlign: "center", fontSize: 14, fontWeight: 700, color: T.navy,
                        border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 0", background: T.white }} />
                    <button onClick={() => setQScore(i, r.score + 1)} style={stepStyle(false)}>+</button>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{pct}% of grade</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ borderTop: `1px solid ${T.border}`, background: T.white, padding: "12px 22px",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: T.ink }}>Total points: <strong style={{ color: T.navy }}>{scoreTotal}</strong></span>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={resetScores} style={{ background: "transparent", border: `1px solid ${T.border}`,
              borderRadius: 6, padding: "7px 14px", fontSize: 13, color: T.inkLight, cursor: "pointer" }}>Reset scores</button>
            <button className="btn-primary" onClick={onClose} style={{ padding: "7px 18px" }}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepComplete({ exam, config }) {
  const chosen = exam;
  const [linkCopied, setLinkCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

  const poolFor = (id, label) => topicBank(id, label);

  const initialSel = () => (chosen ? chosen.distribution : []).map(d => {
    const pool = poolFor(d.id, d.label);
    const k = Math.min(d.count, pool.length);
    return { id: d.id, label: d.label, pool, state: pool.map((_, i) => i < k) };
  });

  // Per-topic selection: each topic has its question pool + a boolean per question (in-exam / removed)
  const [sel, setSel] = useState(initialSel);

  const countFor = t => t.state.filter(Boolean).length;
  const totalQ = sel.reduce((s, t) => s + countFor(t), 0);
  const origTotal = chosen ? chosen.distribution.reduce((s, d) => s + d.count, 0) : 0;
  const custom = chosen ? sel.some((t, ti) => countFor(t) !== chosen.distribution[ti].count) : false;

  function toggleQ(ti, qi) {
    setSel(prev => prev.map((t, i) => i === ti
      ? { ...t, state: t.state.map((v, j) => j === qi ? !v : v) } : t));
  }
  function decTopic(ti) {
    setSel(prev => prev.map((t, i) => {
      if (i !== ti) return t;
      const on = t.state.map((v, j) => (v ? j : -1)).filter(j => j >= 0);
      if (!on.length) return t;
      const pick = on[Math.floor(Math.random() * on.length)]; // random question marked for removal
      return { ...t, state: t.state.map((v, j) => (j === pick ? false : v)) };
    }));
  }
  function incTopic(ti) {
    setSel(prev => prev.map((t, i) => {
      if (i !== ti) return t;
      const off = t.state.findIndex(v => !v);
      if (off < 0) return t; // no more questions in this topic's bank
      return { ...t, state: t.state.map((v, j) => (j === off ? true : v)) };
    }));
  }
  function resetSel() { if (chosen) setSel(initialSel()); }

  // Assembled selected questions -> student exam, preview, transcript, rubric
  const assembled = sel.flatMap(t => t.pool.filter((_, j) => t.state[j]).map(q => ({ topic: t.label, q })));

  // Keep the live student/preview exam in sync with the professor's edits
  useEffect(() => {
    if (chosen) ExamStore.questions = assembled.length ? assembled : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  // Per-question scores, keyed by question text so they survive add/remove edits
  const [scoreMap, setScoreMap] = useState({});
  const transcriptQs = assembled.map(a => ({ topic: a.topic, q: a.q, score: scoreMap[a.q] != null ? scoreMap[a.q] : 10 }));
  const scoreTotal = transcriptQs.reduce((s, r) => s + r.score, 0) || 1;
  function setQScore(i, val) {
    const q = transcriptQs[i] && transcriptQs[i].q;
    if (q == null) return;
    setScoreMap(prev => ({ ...prev, [q]: Math.max(0, val) }));
  }
  function resetScores() { setScoreMap({}); }

  const distForExport = sel.map(t => ({ label: t.label, count: countFor(t) }));

  const examLink = `https://app.epistemy.ai/exam/haas-mba-finance-${chosen && chosen.id}-${Date.now().toString(36)}`;
  function handleShare() {
    navigator.clipboard.writeText(examLink)
      .then(() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 3000); })
      .catch(() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 3000); });
  }

  const stepBtn = (disabled) => ({
    width: 26, height: 26, borderRadius: 6, border: `1px solid ${T.border}`,
    background: T.white, color: T.navy, fontSize: 16, lineHeight: 1,
    cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1,
    display: "flex", alignItems: "center", justifyContent: "center",
  });

  return (
    <>
      {showPreview && (
        <StudentPreview exam={chosen} config={config} onClose={() => setShowPreview(false)} />
      )}
      {showTranscript && (
        <QuestionTranscript questions={transcriptQs} scoreTotal={scoreTotal}
          setQScore={setQScore} resetScores={resetScores} onClose={() => setShowTranscript(false)} />
      )}
      <div className="card">
        <div className="completion">
          <div className="completion-icon">🎓</div>
          <h2>Exam Ready to Assign</h2>
          <p>
            Your <strong>{chosen && chosen.title}</strong> has been saved and is ready for student access.
            Students will take it as an adaptive oral exam scored by EDS.
          </p>

          <div className="exam-summary">
            <div className="summary-row"><span>Course</span><strong>MBA Finance Core · Haas</strong></div>
            <div className="summary-row"><span>Exam type</span><strong>{chosen && chosen.title}</strong></div>
            <div className="summary-row"><span>Questions</span><strong>{totalQ}</strong></div>
            <div className="summary-row"><span>Duration</span><strong>{config.examLen} minutes</strong></div>
            <div className="summary-row"><span>Topics covered</span><strong>{config.selectedTopics.length} topics</strong></div>
            <div className="summary-row"><span>Scoring model</span><strong>Epistemic Depth Score (EDS)</strong></div>
          </div>

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

          {/* Questions by topic */}
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 20,
            textAlign: "left", overflow: "hidden" }}>
            <button
              onClick={() => setShowQuestions(s => !s)}
              style={{ width: "100%", background: T.parchment, border: "none",
                padding: "12px 16px", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "space-between",
                fontSize: 14, fontWeight: 700, color: T.navy, fontFamily: "Inter, sans-serif" }}>
              <span>📋 Questions by Topic{custom ? " · customized" : ""}</span>
              <span style={{ color: T.muted }}>{showQuestions ? "▲" : "▼"}</span>
            </button>
            {showQuestions && (
              <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.border}` }}>
                <p style={{ fontSize: 12, color: T.inkLight, margin: "0 0 16px", lineHeight: 1.6 }}>
                  These are the questions students will be asked, grouped by topic. Use + to add another question
                  from the topic's bank, − to drop one at random, or × to remove a specific question.
                </p>

                {sel.map((t, ti) => {
                  const cnt = countFor(t);
                  const canAdd = t.state.some(v => !v);
                  return (
                    <div key={ti} style={{ marginBottom: 18, paddingBottom: 14,
                      borderBottom: ti < sel.length - 1 ? `1px solid ${T.border}` : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: T.navy }}>{t.label}</span>
                        <span style={{ fontSize: 11, color: T.muted }}>{cnt} question{cnt === 1 ? "" : "s"}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button onClick={() => decTopic(ti)} disabled={cnt <= 0} style={stepBtn(cnt <= 0)}>−</button>
                          <button onClick={() => incTopic(ti)} disabled={!canAdd} style={stepBtn(!canAdd)}>+</button>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {t.pool.map((q, qi) => {
                          if (!t.state[qi]) return null; // show only selected; the rest stay in the bank for +
                          return (
                            <div key={qi}
                              style={{ display: "flex", alignItems: "flex-start", gap: 10,
                                background: T.white, border: `1px solid ${T.border}`,
                                borderLeft: `3px solid ${T.gold}`, borderRadius: 8, padding: "9px 12px" }}>
                              <span style={{ flexShrink: 0, marginTop: 1, width: 16, height: 16, borderRadius: 4,
                                border: `1.5px solid ${T.gold}`, background: T.gold,
                                color: "white", fontSize: 11, fontWeight: 800, lineHeight: "13px", textAlign: "center" }}>✓</span>
                              <span style={{ flex: 1, fontSize: 13, lineHeight: 1.5, color: T.ink }}>{q}</span>
                              <button onClick={() => toggleQ(ti, qi)} title="Remove this question"
                                style={{ flexShrink: 0, background: "transparent", border: "none", color: T.muted,
                                  cursor: "pointer", fontSize: 17, lineHeight: 1, padding: "0 2px", marginTop: -1 }}>×</button>
                            </div>
                          );
                        })}
                        {cnt === 0 && (
                          <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", padding: "2px 2px 4px" }}>
                            No questions selected. Press + to add one from this topic's bank.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginTop: 4, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 13, color: T.ink }}>
                    Total questions: <strong style={{ color: T.navy }}>{totalQ}</strong>
                    {totalQ !== origTotal && (
                      <span style={{ color: T.gold, marginLeft: 8, fontSize: 12 }}>was {origTotal}</span>
                    )}
                  </span>
                  <button onClick={resetSel} disabled={!custom}
                    style={{ background: "transparent", border: `1px solid ${T.border}`,
                      borderRadius: 6, padding: "5px 12px", fontSize: 12, color: T.inkLight,
                      cursor: custom ? "pointer" : "default", opacity: custom ? 1 : 0.5 }}>
                    Reset to default
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-secondary" onClick={() => setShowPreview(true)}>
              👁 Preview as Student
            </button>
            <button className="btn-secondary" onClick={() => setShowTranscript(true)}>
              ⚖ Scoring Weights
            </button>
            <button className="btn-secondary" onClick={() => exportRubric(chosen, config, distForExport, transcriptQs)}>
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

const ExamStore = { trackId: null, trackLabel: null, questions: null };

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
        <h1>Epistemy</h1>
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
          Choose Your Exam
        </h1>
        <p style={{ fontSize: 15, color: T.muted, maxWidth: 540, margin: "0 auto" }}>
          Your assigned exam is highlighted below. Select it to begin an adaptive Socratic examination. Your Epistemic Depth Score updates in real time as you respond.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {DISCIPLINES.map(d => {
          const assigned = d.id === "finance";
          const subtitle = assigned && ExamStore.trackLabel ? ExamStore.trackLabel : d.subtitle;
          return (
            <div key={d.id}
              onClick={() => onSelect(d)}
              style={{ background: d.color, borderRadius: 16, padding: "32px 28px",
                cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: assigned ? "0 6px 26px rgba(196,147,63,0.35)" : "0 4px 20px rgba(0,0,0,0.12)",
                position: "relative", overflow: "hidden",
                border: assigned ? `2px solid ${T.gold}` : "2px solid transparent" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = assigned ? "0 6px 26px rgba(196,147,63,0.35)" : "0 4px 20px rgba(0,0,0,0.12)"; }}>
              {assigned && (
                <div style={{ position: "absolute", right: 14, top: 14, background: T.gold, color: T.navy,
                  borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 800,
                  letterSpacing: "0.05em", zIndex: 2 }}>
                  ASSIGNED
                </div>
              )}
              <div style={{ position: "absolute", right: -20, top: -20, fontSize: 90, opacity: 0.08 }}>{d.icon}</div>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{d.icon}</div>
              <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, color: "white", marginBottom: 6 }}>{d.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>{subtitle}</div>
              <div style={{ display: "inline-block", background: d.accent, color: "white",
                borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700 }}>
                {assigned ? "Start Exam →" : "Begin Exam →"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Lazy-load jsPDF from CDN (only when a transcript download is requested).
function ensureJsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf && window.jspdf.jsPDF) return resolve();
    let s = document.getElementById("epistemy-jspdf");
    if (s) { s.addEventListener("load", () => resolve()); s.addEventListener("error", reject); return; }
    s = document.createElement("script");
    s.id = "epistemy-jspdf";
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.style.display = "none";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ── Oral Exam Engine ──
function OralExam({ discipline, studentName, onBack, previewMode }) {
  // ── Resolve bank + context ──
  const derived = (discipline.id === "finance" && ExamStore.questions && ExamStore.questions.length)
    ? ExamStore.questions : null;
  const bank =
    derived ||
    (discipline.id === "finance"
      ? (STUDENT_BANKS[ExamStore.trackId] || STUDENT_BANKS.balanced)
      : (STUDENT_BANKS[discipline.id] || STUDENT_BANKS.balanced));
  const examContext = EXAM_CONTEXT[discipline.id] || EXAM_CONTEXT.finance;
  const N = bank.length;
  const usingProfessorSet = discipline.id === "finance" && (!!derived || !!ExamStore.trackId);
  const sourceLabel = usingProfessorSet
    ? `Prof. Benetton · ${ExamStore.trackLabel || "selected exam"}`
    : "Default topic set";
  const MAX_Q_TURNS = 3;

  const openingFor = (i) => i === 0
    ? `${examContext}\n\nQuestion 1. ${bank[0].q}`
    : `Question ${i + 1}. ${bank[i].q}`;

  const [current, setCurrent]   = useState(0);
  const [qData, setQData]       = useState(() => bank.map((qq, i) => ({
    turns: [{ role: "evaluator", text: openingFor(i) }],
    attempts: 0, attempted: false, done: false, score: 0, visited: i === 0, history: [],
  })));
  const [draft, setDraft]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [phase, setPhase] = useState("taking"); // taking | review | done
  const [showTx, setShowTx] = useState(false);

  const [listening, setListening]   = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef(null);
  const [ttsState, setTtsState] = useState("idle");
  const audioRef = useRef(null);
  const scrollRef = useRef(null);

  const cur = qData[current];
  const curLatestEval = (() => {
    for (let i = cur.turns.length - 1; i >= 0; i--) if (cur.turns[i].role === "evaluator") return cur.turns[i].text;
    return "";
  })();

  const attemptedCount = qData.filter(q => q.attempted).length;
  const respondedCount = qData.filter(q => q.score > 0).length;
  const visitedCount   = qData.filter(q => q.visited).length;
  const edsScore = Math.min(99, Math.round(qData.reduce((s, q) => s + q.score, 0)));

  function scrollBottom(){ setTimeout(()=>{ if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 60); }

  // ── Graph traversal for the two views ──
  function nodeIdsFor(count){
    const ids = discipline.nodes.map(n => n.id);
    const k = Math.min(ids.length, Math.ceil((count / Math.max(N,1)) * ids.length));
    return ids.slice(0, k);
  }
  const questionsTraversed = nodeIdsFor(visitedCount);
  const responsesTraversed = nodeIdsFor(respondedCount);

  // ── TTS ──
  async function speak(text){
    if (audioRef.current){ audioRef.current.pause(); audioRef.current = null; }
    setTtsState("loading");
    try{
      const res = await fetch("/api/speak", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ text: cleanForSpeech(text) }) });
      if(!res.ok) throw new Error("tts");
      const ctype = res.headers.get("content-type") || "";
      if(!ctype.includes("audio")) throw new Error("non-audio");
      const url = URL.createObjectURL(await res.blob());
      const a = new Audio(url); audioRef.current = a;
      a.onended = ()=>{ setTtsState("idle"); URL.revokeObjectURL(url); };
      a.onerror = ()=> setTtsState("idle");
      await a.play(); setTtsState("playing");
    }catch{ setTtsState("idle"); }
  }
  function playCurrent(){
    if(ttsState==="playing"||ttsState==="loading") return;
    if(ttsState==="paused" && audioRef.current){ audioRef.current.play(); setTtsState("playing"); return; }
    if(curLatestEval) speak(curLatestEval);
  }
  function pauseCurrent(){ if(ttsState==="playing" && audioRef.current){ audioRef.current.pause(); setTtsState("paused"); } }

  // Stop any spoken prompt when the student navigates to a different question.
  // Playback only starts when the Play button is pressed (no auto-play).
  useEffect(()=>{
    if(audioRef.current){ audioRef.current.pause(); audioRef.current=null; }
    setTtsState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase]);

  // ── STT ──
  function toggleMic(){
    if(!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)){ alert("Speech recognition not available — please use Chrome."); return; }
    if(listening){ recognitionRef.current?.stop(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR(); rec.continuous=true; rec.interimResults=true; rec.lang="en-US";
    rec.onstart=()=>setListening(true);
    rec.onresult=e=>{ let fin="",int=""; for(let i=e.resultIndex;i<e.results.length;i++){ const r=e.results[i]; if(r.isFinal) fin+=r[0].transcript+" "; else int+=r[0].transcript; } if(fin) setDraft(p=>(p+" "+fin).trim()); setInterimText(int); };
    rec.onend=()=>{ setListening(false); setInterimText(p=>{ if(p.trim()) setDraft(d=>(d+" "+p).trim()); return ""; }); };
    rec.onerror=()=>{ setListening(false); setInterimText(""); };
    rec.start(); recognitionRef.current=rec;
  }

  // ── Navigation ──
  function goTo(i){
    if(i<0 || i>=N || i===current) return;
    if(listening){ recognitionRef.current?.stop(); setListening(false); }
    setDraft(""); setInterimText("");
    setQData(prev=>prev.map((q,idx)=> idx===i && !q.visited ? {...q, visited:true} : q));
    setCurrent(i);
  }
  const nextIdx = current < N-1 ? current+1 : null;
  const prevIdx = current > 0 ? current-1 : null;

  // ── Answer the current question (Socratic scaffolding, up to 3 turns) ──
  async function handleAnswer(){
    if(!draft.trim() || loading) return;
    if(listening){ recognitionRef.current?.stop(); setListening(false); setInterimText(""); }
    if(audioRef.current){ audioRef.current.pause(); audioRef.current=null; }
    const studentText = draft.trim();
    const askedQ = bank[current].q;
    const history = cur.history;
    setDraft(""); setInterimText("");
    setQData(prev=>prev.map((q,idx)=> idx===current ? {...q, turns:[...q.turns,{role:"student",text:studentText}], attempted:true } : q));
    setLoading(true); scrollBottom();

    const attempt = cur.attempts + 1;
    const maxed = attempt >= MAX_Q_TURNS;

    const system =
      `You are an Epistemy oral examiner for ${discipline.title} at UC Berkeley Haas, running a Socratic oral exam. ` +
      `The current exam question is: "${askedQ}". ` +
      `You scaffold: when an answer is incomplete, you do NOT give the answer away. Instead you ask ONE smaller guiding ` +
      `sub-question about an intermediate concept or a single causal link, so the student can build toward the answer themselves. ` +
      `First decide whether the student genuinely attempted to answer THIS question with relevant content. ` +
      `Treat "I don't know", "not sure", "no idea", blank replies, gibberish, off-topic answers, refusals, or asking to skip as NOT answered. ` +
      `Assess the student's most recent answer in the running exchange for THIS question. "adequate" may be true only if "answered" is true. ` +
      `Respond ONLY with minified JSON, no prose and no code fences: ` +
      `{"answered": true or false, "adequate": true or false, "feedback": "at most one short sentence noting what was strong or thin, used when moving on", ` +
      `"probe": "if not adequate, ONE short guiding sub-question toward an intermediate step; empty string if adequate"}`;

    let ctx = `Exam question: ${askedQ}\n\n`;
    if(history.length){ ctx += "Scaffolding so far on this question:\n"; for(const h of history){ ctx += (h.role==="probe"?`Examiner sub-question: ${h.text}`:`Student: ${h.text}`)+"\n"; } ctx+="\n"; }
    ctx += `Student's latest answer: ${studentText}`;

    let answered=true, adequate=true, feedback="", probe="", modelOk=false;
    try{
      const data = await callModel({ model:"claude-sonnet-4-6", max_tokens:500, system, messages:[{role:"user",content:ctx}] });
      let txt=(data.content?.find(b=>b.type==="text")?.text||"").trim().replace(/```json|```/g,"").trim();
      const s=txt.indexOf("{"), e=txt.lastIndexOf("}"); const parsed=JSON.parse(txt.slice(s,e+1));
      adequate=!!parsed.adequate; answered=("answered"in parsed)?!!parsed.answered:answerQuality(studentText)>0;
      feedback=(parsed.feedback||"").trim(); probe=(parsed.probe||"").trim(); modelOk=true;
    }catch{ answered=answerQuality(studentText)>0; adequate=true; feedback=""; probe=""; modelOk=false; }

    let edsDelta;
    if(modelOk){ if(!answered) edsDelta=0; else if(adequate) edsDelta=8+Math.floor(Math.random()*6); else if(probe) edsDelta=3; else edsDelta=0; }
    else edsDelta=Math.round(answerQuality(studentText)*12);

    const advance = adequate || maxed || !probe;
    const bubble = advance ? (feedback || "Answer recorded.") : (feedback ? `${feedback}\n\n${probe}` : probe);

    setQData(prev=>prev.map((q,idx)=>{
      if(idx!==current) return q;
      const newHist = advance ? q.history : [...q.history, {role:"answer",text:studentText}, {role:"probe",text:probe}];
      return {
        ...q,
        turns: [...q.turns, {role:"evaluator", text:bubble}],
        attempts: attempt,
        done: advance ? true : q.done,
        score: Math.min(45, q.score + edsDelta),
        history: newHist,
      };
    }));
    setLoading(false);
    setTimeout(()=>{ scrollBottom(); }, 250);
  }

  function submitExam(){
    if(audioRef.current){ audioRef.current.pause(); audioRef.current=null; }
    setPhase("review");
  }
  function confirmSubmit(){
    if(audioRef.current){ audioRef.current.pause(); audioRef.current=null; }
    setPhase("done");
  }
  function backToExam(){ setPhase("taking"); }

  // ── Cumulative transcript (questions + responses) for the results screen ──
  const transcript = qData.map((q, i) => ({
    n: i + 1,
    topic: bank[i].topic || "",
    question: bank[i].q,
    attempted: q.attempted,
    score: Math.round(q.score),
    exchange: q.turns.slice(1).map(t => ({ who: t.role === "student" ? studentName : "Examiner", text: t.text })),
  }));

  function buildTranscriptText() {
    let out = "EPISTEMY ORAL EXAM — TRANSCRIPT\n";
    out += `Student: ${studentName}\n`;
    out += `Exam: ${discipline.title}${discipline.subtitle ? ` — ${discipline.subtitle}` : ""}\n`;
    out += `Source: ${sourceLabel}\n`;
    out += `Final EDS: ${edsScore}\n`;
    out += `Answered: ${attemptedCount} of ${N}\n`;
    transcript.forEach(t => {
      out += `\n${"=".repeat(52)}\nQuestion ${t.n} · ${t.topic}\n${t.question}\n\n`;
      if (!t.exchange.length) out += "  (skipped, no response)\n";
      else t.exchange.forEach(e => { out += `  ${e.who}: ${e.text}\n`; });
      out += `  [${t.attempted ? "Answered" : "Skipped"} · EDS +${t.score}]\n`;
    });
    return out;
  }

  async function downloadTranscript() {
    const safe = (studentName || "student").replace(/\s+/g, "_");
    try {
      await ensureJsPDF();
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth(), pageH = doc.internal.pageSize.getHeight();
      const M = 48, cw = pageW - M * 2;
      const navy = [27,42,74], gold = [196,147,63], goldL = [232,184,100], ink = [44,36,22], muted = [138,127,110], inkL = [90,79,60], line = [212,201,176];
      let y = 0;
      doc.setFillColor(...navy); doc.rect(0,0,pageW,86,"F");
      doc.setFillColor(...gold); doc.rect(0,86,pageW,3,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...goldL); doc.text("EPISTEMY.AI", M, 34);
      doc.setFontSize(17); doc.setTextColor(255,255,255); doc.text("Oral Exam Transcript", M, 58);
      doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(210,205,195);
      doc.text(`${studentName}  ·  ${discipline.title}  ·  Final EDS ${edsScore}  ·  ${attemptedCount}/${N} answered`, M, 76);
      y = 112;
      const ensure = sp => { if (y + sp > pageH - M) { doc.addPage(); y = M; } };
      const wrap = (text, size, color, font, lh) => { doc.setFont("helvetica", font || "normal"); doc.setFontSize(size); doc.setTextColor(...color); doc.splitTextToSize(text, cw).forEach(l => { ensure(size*(lh||1.35)); doc.text(l, M, y); y += size*(lh||1.35); }); };
      transcript.forEach(t => {
        ensure(44); y += 8;
        doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(...gold);
        doc.text(`QUESTION ${t.n} · ${(t.topic || "").toUpperCase()}`, M, y); y += 14;
        wrap(t.question, 12, navy, "bold", 1.3); y += 4;
        if (!t.exchange.length) wrap("(skipped, no response)", 10, muted, "italic", 1.4);
        else t.exchange.forEach(e => { wrap(`${e.who}: ${e.text}`, 10, e.who === studentName ? inkL : ink, "normal", 1.4); y += 2; });
        y += 2; wrap(`[${t.attempted ? "Answered" : "Skipped"} · EDS +${t.score}]`, 9, muted, "normal", 1.3);
        y += 6; doc.setDrawColor(...line); doc.setLineWidth(0.5); ensure(6); doc.line(M, y, M + cw, y); y += 8;
      });
      const pages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pages; i++) { doc.setPage(i); doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...muted); doc.text(`Epistemy Transcript · ${studentName}`, M, pageH - 20); doc.text(`${i} / ${pages}`, pageW - M, pageH - 20, { align: "right" }); }
      doc.save(`Epistemy_Transcript_${safe}.pdf`);
    } catch {
      downloadBlob(`Epistemy_Transcript_${safe}.txt`, new Blob([buildTranscriptText()], { type: "text/plain" }));
    }
  }

  // Shared status list (per-question answered/skipped)
  const statusList = (
    <div style={{ textAlign:"left", maxWidth:540, margin:"0 auto 22px" }}>
      {qData.map((q,i)=>(
        <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:14, padding:"8px 0", borderBottom:`1px solid ${T.border}`, fontSize:13 }}>
          <span style={{ color:T.ink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Q{i+1}. {bank[i].topic || bank[i].q}</span>
          <span style={{ color: q.attempted ? T.success : T.muted, fontWeight:700, flexShrink:0 }}>{q.attempted ? "Answered" : "Skipped"}</span>
        </div>
      ))}
    </div>
  );

  // ── Review view: "Exam Ready to Submit" ──
  if(phase === "review"){
    return (
      <div style={{ width:"100%", maxWidth:760, margin:"0 auto" }}>
        <div style={{ background:T.white, border:`1px solid ${T.border}`, borderRadius:16, padding:"40px 32px", textAlign:"center" }}>
          <div style={{ fontSize:44, marginBottom:8 }}>📝</div>
          <h1 style={{ fontFamily:"DM Serif Display, serif", color:T.navy, fontSize:28, margin:"0 0 6px" }}>Exam Ready to Submit</h1>
          <p style={{ color:T.muted, marginBottom:20 }}>{attemptedCount} of {N} questions answered · {N-attemptedCount} skipped.</p>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}><EDSGauge score={edsScore} /></div>
          {statusList}

          <div style={{ background:T.successBg, border:`1px solid ${T.gold}`, borderRadius:10,
            padding:"12px 16px", maxWidth:540, margin:"0 auto 22px", fontSize:13, color:T.ink }}>
            ⚠ Once you submit, your responses can't be changed.
          </div>

          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-secondary" onClick={backToExam}>← Back to exam</button>
            <button className="btn-primary" onClick={confirmSubmit}>Submit ✓</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Submitted view: "Exam Submitted" ──
  if(phase === "done"){
    return (
      <div style={{ width:"100%", maxWidth:760, margin:"0 auto" }}>
        <div style={{ background:T.white, border:`1px solid ${T.border}`, borderRadius:16, padding:"40px 32px", textAlign:"center" }}>
          <div style={{ fontSize:44, marginBottom:8 }}>✓</div>
          <h1 style={{ fontFamily:"DM Serif Display, serif", color:T.navy, fontSize:28, margin:"0 0 6px" }}>Exam Submitted</h1>
          <p style={{ color:T.muted, marginBottom:20 }}>Your responses have been recorded. {attemptedCount} of {N} questions answered.</p>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}><EDSGauge score={edsScore} /></div>
          {statusList}

          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:showTx ? 20 : 22 }}>
            <button className="btn-secondary" onClick={()=>setShowTx(s=>!s)}>
              {showTx ? "Hide transcript" : "📄 View full transcript"}
            </button>
            <button className="btn-secondary" onClick={downloadTranscript}>⬇ Download transcript</button>
          </div>

          {showTx && (
            <div style={{ textAlign:"left", maxWidth:640, margin:"0 auto 24px", maxHeight:420, overflowY:"auto",
              border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px", background:T.parchment }}>
              {transcript.map(t=>(
                <div key={t.n} style={{ marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", color:T.gold, letterSpacing:"0.05em", marginBottom:4 }}>
                    Question {t.n} · {t.topic}
                  </div>
                  <div style={{ fontSize:14, color:T.navy, fontWeight:600, marginBottom:8, lineHeight:1.5 }}>{t.question}</div>
                  {t.exchange.length === 0
                    ? <div style={{ fontSize:13, color:T.muted, fontStyle:"italic" }}>Skipped, no response.</div>
                    : t.exchange.map((e,ei)=>(
                        <div key={ei} style={{ marginBottom:6, fontSize:13, lineHeight:1.55 }}>
                          <span style={{ fontWeight:700, color: e.who===studentName ? T.navyLight : discipline.accent }}>{e.who}: </span>
                          <span style={{ color:T.ink, whiteSpace:"pre-wrap" }}>{e.text}</span>
                        </div>
                      ))}
                  <div style={{ fontSize:11, color:T.muted, marginTop:6 }}>{t.attempted ? "Answered" : "Skipped"} · EDS +{t.score}</div>
                </div>
              ))}
            </div>
          )}

          <button className="btn-primary" onClick={onBack}>← Back to Exams</button>
        </div>
      </div>
    );
  }

  // ── Exam view ──
  return (
    <div style={{ width:"100%", maxWidth:1150, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ background: discipline.color, borderRadius:"12px 12px 0 0", padding:"16px 22px",
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
        <div>
          <div style={{ color:"rgba(255,255,255,0.55)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>
            Oral Exam{previewMode ? " · Preview" : ""}
          </div>
          <div style={{ fontFamily:"DM Serif Display, serif", fontSize:20, color:"white" }}>
            {discipline.title} — {discipline.subtitle}
          </div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:3 }}>{N} questions · {sourceLabel}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"white", borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:13 }}>← Back</button>
          <button onClick={submitExam} style={{ background:T.gold, border:"none", color:T.navy, borderRadius:8, padding:"7px 16px", cursor:"pointer", fontSize:13, fontWeight:700 }}>Submit Exam</button>
        </div>
      </div>

      {/* Question grid (green = attempted) */}
      <div style={{ background:T.white, border:`1px solid ${T.border}`, borderTop:"none", padding:"10px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.muted, marginBottom:8 }}>
          <span>Question {current+1} of {N}</span>
          <span>{attemptedCount} answered · {N-attemptedCount} remaining</span>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {qData.map((q,i)=>{
            const isCur = i===current;
            const bg = q.attempted ? T.success : (isCur ? T.gold : T.parchmentDark);
            const color = (q.attempted || isCur) ? "white" : T.inkLight;
            return (
              <button key={i} onClick={()=>goTo(i)} title={`Question ${i+1}${q.attempted?" · answered":""}`}
                style={{ width:30, height:30, borderRadius:8, border: isCur?`2px solid ${T.navy}`:`1px solid ${T.border}`,
                  background:bg, color, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                {i+1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display:"flex", gap:20, alignItems:"flex-start", background:T.white, border:`1px solid ${T.border}`,
        borderTop:"none", borderRadius:"0 0 12px 12px", padding:"18px 18px 20px" }}>

        {/* Left: current question screen */}
        <div style={{ flex:1, minWidth:0 }}>
          <div ref={scrollRef} style={{ maxHeight:360, overflowY:"auto", paddingRight:4, marginBottom:14 }}>
            {cur.turns.map((t,i)=>(
              <div key={i} style={{ marginBottom:14, display:"flex", flexDirection:"column",
                alignItems: t.role==="student" ? "flex-end" : "flex-start" }}>
                <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5,
                  color: t.role==="student" ? T.navyLight : discipline.accent }}>
                  {t.role==="student" ? studentName : "Epistemy Evaluator"}
                </div>
                <div style={{ maxWidth:"88%",
                  background: t.role==="student" ? T.navy : T.parchmentDark,
                  border: t.role==="student" ? "none" : `1px solid ${T.border}`,
                  borderRadius: t.role==="student" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                  padding:"11px 15px", fontSize:14, lineHeight:1.65, whiteSpace:"pre-wrap",
                  color: t.role==="student" ? "white" : T.navy }}>
                  {t.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0 12px" }}>
                {[0,1,2].map(i=>(<div key={i} style={{ width:7, height:7, borderRadius:"50%", background:discipline.accent, animation:`bounce 1s ease-in-out ${i*0.15}s infinite` }} />))}
                <span style={{ fontSize:12, color:T.muted }}>Evaluating…</span>
              </div>
            )}
          </div>

          {/* Input or done note */}
          {cur.done ? (
            <div style={{ background:T.successBg, border:`1px solid ${T.success}`, borderRadius:10, padding:"11px 14px",
              fontSize:13, color:T.success, fontWeight:600, marginBottom:6 }}>
              ✓ Answer recorded. Use the navigation below to continue.
            </div>
          ) : (
            <div>
              {(listening || interimText) && (
                <div style={{ background:"#FFFBF0", border:`1px dashed ${T.gold}`, borderRadius:8, padding:"8px 12px",
                  marginBottom:8, fontSize:13, color:T.inkLight, fontStyle:"italic" }}>
                  <span style={{ color:T.gold, fontWeight:700, fontStyle:"normal", marginRight:6 }}>●</span>
                  {interimText || "Listening…"}
                </div>
              )}
              <textarea
                value={draft}
                onChange={e=>setDraft(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter" && (e.metaKey||e.ctrlKey)) handleAnswer(); }}
                placeholder="Answer the question above… (⌘↵ to submit)"
                style={{ width:"100%", minHeight:84, padding:"12px 14px",
                  border:`1.5px solid ${listening?discipline.accent:T.border}`, borderRadius:10,
                  fontFamily:"Inter, sans-serif", fontSize:14, color:T.ink,
                  background: listening?"#FFFDF5":T.parchment, resize:"none", outline:"none", boxSizing:"border-box", marginBottom:10 }}
              />
              <div style={{ display:"flex", gap:8, alignItems:"stretch" }}>
                <button onClick={playCurrent} disabled={!curLatestEval || ttsState==="playing"}
                  style={{ padding:"0 14px", borderRadius:8, fontSize:13, fontWeight:600, border:`1.5px solid ${T.navy}`,
                    background: ttsState==="playing"?T.navy:"transparent", color: ttsState==="playing"?"white":T.navy,
                    cursor:(!curLatestEval||ttsState==="playing")?"default":"pointer", opacity:!curLatestEval?0.4:1, whiteSpace:"nowrap" }}>
                  {ttsState==="loading"?"⏳":"▶"} Play
                </button>
                <button onClick={pauseCurrent} disabled={ttsState!=="playing"}
                  style={{ padding:"0 14px", borderRadius:8, fontSize:13, fontWeight:600, border:`1.5px solid ${T.navy}`,
                    background:"transparent", color:T.navy, cursor: ttsState==="playing"?"pointer":"default", opacity: ttsState==="playing"?1:0.4, whiteSpace:"nowrap" }}>
                  ⏸ Pause
                </button>
                <button onClick={toggleMic} title={listening?"Stop recording":"Start voice input"}
                  style={{ width:44, borderRadius:8, border:`1.5px solid ${listening?discipline.accent:T.navy}`,
                    background: listening?discipline.accent:"transparent", color: listening?"white":T.navy,
                    cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {listening?"🔴":"🎤"}
                </button>
                <button className="btn-primary" style={{ flex:1 }} onClick={handleAnswer}
                  disabled={loading || (!draft.trim() && !interimText.trim())}>
                  {loading ? "Evaluating…" : "Submit Answer →"}
                </button>
              </div>
            </div>
          )}

          {/* Navigation row */}
          <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:14 }}>
            <button className="btn-secondary" onClick={()=>prevIdx!==null && goTo(prevIdx)} disabled={prevIdx===null}
              style={{ opacity: prevIdx===null?0.4:1 }}>← Previous</button>
            <div style={{ flex:1 }} />
            {nextIdx!==null
              ? <button className="btn-secondary" onClick={()=>goTo(nextIdx)}>{cur.attempted ? "Next →" : "Skip →"}</button>
              : <button className="btn-primary" onClick={submitExam}>Submit Exam →</button>}
          </div>
        </div>

        {/* Right: Behind the Scenes */}
        <div style={{ width:290, flexShrink:0 }}>
          <div style={{ border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
            <div style={{ background:"#FBF6EA", borderBottom:`1px dashed ${T.gold}`, padding:"10px 14px" }}>
              <div style={{ fontSize:12, fontWeight:800, letterSpacing:"0.03em", color:T.navy, display:"flex", alignItems:"center", gap:6 }}>
                <span>🔍</span> Behind the Scenes
              </div>
              <div style={{ fontSize:11, color:T.inkLight, marginTop:3, lineHeight:1.5 }}>
                Instructor-facing analytics, hidden from the student during the exam.
              </div>
            </div>

            {/* Concept graphs: questions and responses, stacked vertically */}
            {[
              { key:"questions", title:"Concept Graph · By Questions", caption:"Concepts covered by the questions reached so far.", traversed:questionsTraversed },
              { key:"responses", title:"Concept Graph · By Responses", caption:"Concepts demonstrated by the student's responses.", traversed:responsesTraversed },
            ].map(v => {
              const c = v.traversed.length;
              return (
                <div key={v.key} style={{ padding:"14px 12px", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:T.muted, marginBottom:5, paddingLeft:4 }}>
                    {v.title}
                  </div>
                  <div style={{ fontSize:10, color:T.muted, marginBottom:8, paddingLeft:4, lineHeight:1.5 }}>
                    {v.caption}
                  </div>
                  <div style={{ height:170, overflow:"hidden" }}>
                    <ConceptGraph discipline={discipline} traversed={v.traversed} />
                  </div>
                  <div style={{ marginTop:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:5 }}>
                      <span style={{ color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>Coverage</span>
                      <span style={{ color:T.navy, fontWeight:700 }}>{c}/{discipline.nodes.length}</span>
                    </div>
                    <div style={{ background:T.border, borderRadius:4, height:7, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:4, width:`${(c/discipline.nodes.length)*100}%`,
                        background:`linear-gradient(90deg, ${T.gold}, ${T.goldLight})`, transition:"width 0.5s ease" }} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* EDS score (moved to the bottom) */}
            <div style={{ padding:"16px 14px", textAlign:"center" }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:T.muted, marginBottom:12 }}>
                Epistemic Depth Score
              </div>
              <EDSGauge score={edsScore} />
              <div style={{ marginTop:12, fontSize:11, color:T.muted, lineHeight:1.5 }}>
                Accumulates as responses demonstrate causal understanding.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:0.5;}50%{transform:translateY(-5px);opacity:1;}}`}</style>
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
        <div className="header-logo">Epistemy</div>
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
        {view === "login" && <StudentLogin onLogin={() => setView("disciplines")} />}
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
];

function InstructorApp({ onSwitchRole }) {
  const [step, setStep] = useState(0);
  const [topics, setTopics] = useState([]);
  const [exams, setExams] = useState([]);
  const [examConfig, setExamConfig] = useState({});
  const [chosenExam, setChosenExam] = useState(null);
  const [complete, setComplete] = useState(false);

  // Effective position (4 = completion screen) and the furthest step you can jump back to.
  const current = complete ? 4 : step;
  const maxReached = complete ? 3 : step;
  function goToStep(idx) {
    if (idx >= 1 && idx <= maxReached) { setComplete(false); setStep(idx); }
  }
  function goBack() {
    if (complete) { setComplete(false); setStep(3); return; }
    if (step > 1) setStep(step - 1);
  }
  const canGoBack = complete || step > 1;
  const backTarget = complete ? "Configure Exam" : (STEPS[step - 1] ? STEPS[step - 1].label : "");

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">Epistemy</div>
        <div className="header-user">
          {step > 0 && (
            <>
              <div className="avatar">MB</div>
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

      {step > 0 && (
        <nav className="stepper">
          {STEPS.slice(1).map((s, i) => {
            const idx = i + 1;
            const status = current > idx ? "done" : current === idx ? "active" : "";
            const clickable = idx <= maxReached;
            return (
              <div className={`step${clickable ? " step-clickable" : ""}`} key={idx}
                onClick={() => clickable && goToStep(idx)}
                title={clickable ? `Go to ${s.label}` : undefined}>
                <div className={`step-circle ${status}`}>{current > idx ? "✓" : idx}</div>
                <div className={`step-label ${status}`}>{s.label}</div>
              </div>
            );
          })}
        </nav>
      )}

      {canGoBack && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px 0", width: "100%", boxSizing: "border-box" }}>
          <button onClick={goBack}
            style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8,
              padding: "7px 14px", fontSize: 13, color: T.inkLight, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 6 }}>
            ← Back{backTarget ? ` to ${backTarget}` : ""}
          </button>
        </div>
      )}

      <main className="main">
        {step === 0 && <StepLogin onNext={() => setStep(1)} />}
        {step === 1 && !complete && <StepOnboard onNext={() => setStep(2)} />}
        {step === 2 && !complete && <StepUpload onNext={(t) => { setTopics(t); setStep(3); }} />}
        {step === 3 && !complete && <StepConfigExam topics={topics} onNext={(e, cfg) => {
          setExams(e); setExamConfig(cfg);
          const def = e && e.length ? e[0] : null;
          if (def) {
            ExamStore.trackId = def.bankKey;
            ExamStore.trackLabel = def.title;
            ExamStore.questions = assembleExamQuestions(def.distribution);
            setChosenExam(def);
          }
          setComplete(true);
        }} />}
        {complete && <StepComplete exam={chosenExam} config={examConfig} />}
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
            Epistemy
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
              desc: "Build and configure oral assessments. Upload course material, generate assessment variants, and assign to students.",
              cta: "Enter as Instructor",
              accent: T.gold,
            },
            {
              role: "student",
              icon: "📖",
              title: "Student",
              desc: "Take an adaptive Socratic oral assessment. Your Epistemic Depth Score updates in real time as you respond.",
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
