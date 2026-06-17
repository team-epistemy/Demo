import { useState, useEffect, useRef, useCallback } from "react";

const NAVY  = "#0D1F3C";
const GOLD  = "#C9A84C";
const PARCH = "#F5EDD6";
const SMOKE = "#E8E0CC";
const MUTED = "#7A8BA0";
const GREEN = "#4CAF7D";
const RED   = "#C0392B";

const DEMO_TOKEN = "epistemy-demo-2026";

// ── Writing I concepts (6) ────────────────────────────────────────────────────
const WRITING1_CONCEPTS = [
  "Audience Analysis",
  "Claim",
  "Argument Structure",
  "Bad News Pattern",
  "Tone",
  "Anchor Sentences"
];

// ── Writing I scenarios (3) ───────────────────────────────────────────────────
const WRITING1_SCENARIOS = [
  {
    id: "budget-rejection",
    icon: "✉",
    label: "Budget Rejection Memo",
    sublabel: "Senior Marketing Manager → VP + colleague",
    audience: "VP of Marketing (data-driven, reads fast, trusts your judgment) and Priya your colleague (emotionally invested, professional relationship at stake)",
    context: `You are a Senior Marketing Manager at a mid-size SaaS company. Your colleague Priya, a Product Manager you have worked with for two years and respect, has submitted a proposal for a $200K customer research initiative. You have reviewed it and believe the timing is wrong. The company just missed Q3 targets and the CFO has signaled a freeze on discretionary spend. You need to write a memo to your VP of Marketing recommending rejection of Priya's proposal. Priya will also receive a copy.`,
    document: "Internal rejection memo, 1 page",
    concepts: WRITING1_CONCEPTS,
    maxTurns: 10,
    isWriting1: true,
    systemPrompt: `You are an oral examiner running a 10-turn Writing I exam grounded in this scenario: a Senior Marketing Manager must write a memo to their VP recommending rejection of a colleague Priya's $200K research proposal, after a missed Q3 and a discretionary spend freeze. Priya will also receive the memo.

The audience is: VP of Marketing (data-driven, reads fast, trusts your judgment) and Priya (emotionally invested, professional relationship at stake).

Your job is to build the student's document bottom-up across 10 turns in this sequence:
Turns 1-2: reader model and core claim
Turns 3-5: structure, bad news integration, tone
Turns 6-8: anchor sentences, micro-structure, POV
Turns 9-10: rebuttal anticipation and full document synthesis

In turns 8-10 ask for comprehensive, multi-part responses that require the student to synthesise what they built in prior turns. Explicitly call back to decisions the student made earlier. Ask ONE focused question per turn. Never lecture. Never confirm correctness mid-exam. Do not use em dashes anywhere in your questions.`,
    openingQuestion: "Before you write a single word of this memo — who are you actually writing for, and what does each reader need to walk away believing?"
  },
  {
    id: "policy-announcement",
    icon: "⬡",
    label: "Policy Change Announcement",
    sublabel: "HR Director → 400 employees, remote work reversal",
    audience: "All 400 employees — mixed seniority, mixed remote and hybrid preferences, some in different time zones, 70% opposed to the change",
    context: `You are an HR Director at a 400-person tech company. The executive team has decided to end fully remote work and require employees to come in three days a week starting in 60 days. You did not make this decision, but you are responsible for communicating it. Employee surveys show 70% of staff prefer fully remote. You anticipate significant pushback, some attrition, and questions the policy does not yet answer such as relocation support and exceptions. You need to write the all-hands internal memo announcing this change.`,
    document: "All-hands announcement memo, 1.5 pages",
    concepts: WRITING1_CONCEPTS,
    maxTurns: 10,
    isWriting1: true,
    systemPrompt: `You are an oral examiner running a 10-turn Writing I exam grounded in this scenario: an HR Director must write an all-hands memo announcing a return-to-office policy change that 70% of employees oppose. The director did not make the decision but must own the communication.

The audience is: all 400 employees, mixed seniority and preferences, some remote in different time zones, majority against the change.

Your job is to build the student's document bottom-up across 10 turns in this sequence:
Turns 1-2: reader model and core claim
Turns 3-5: structure, bad news integration, tone
Turns 6-8: anchor sentences, micro-structure, POV
Turns 9-10: rebuttal anticipation and full document synthesis

In turns 8-10 ask for comprehensive, multi-part responses that require the student to synthesise what they built in prior turns. Explicitly call back to decisions the student made earlier. Ask ONE focused question per turn. Never lecture. Never confirm correctness mid-exam. Do not use em dashes anywhere in your questions.`,
    openingQuestion: "You are writing to 400 people, most of whom will not want to hear what you have to say. Before you think about structure or tone — what does this audience actually need from you in this moment, and what would make them stop reading?"
  },
  {
    id: "executive-briefing",
    icon: "◈",
    label: "Executive Briefing Memo",
    sublabel: "Strategy Analyst → time-constrained CEO, acquisition decision",
    audience: "CEO of a regional hospital network — reads 40 memos a week, makes decisions quickly, wants the recommendation first, will drill into reasoning only if she disagrees",
    context: `You are a Strategy Analyst at a consulting firm. Your client is the CEO of a regional hospital network facing a decision: acquire a struggling competitor for $85M or invest that capital in upgrading their own facilities. You have two weeks of analysis. The CEO reads 40 or more memos a week, makes decisions quickly, and is notoriously impatient with background she already knows. You have one page to give her your recommendation and the three reasons behind it.`,
    document: "Executive briefing memo, 1 page",
    concepts: WRITING1_CONCEPTS,
    maxTurns: 10,
    isWriting1: true,
    systemPrompt: `You are an oral examiner running a 10-turn Writing I exam grounded in this scenario: a Strategy Analyst at a consulting firm must write a one-page executive briefing memo to a CEO who reads 40 memos a week and wants a recommendation first. The decision is whether to acquire a competitor for $85M or reinvest in their own facilities.

The audience is: a CEO who is time-constrained, high pattern recognition, wants the recommendation before the reasoning, and will push back hard if she disagrees.

Your job is to build the student's document bottom-up across 10 turns in this sequence:
Turns 1-2: reader model and core claim
Turns 3-5: structure, bad news integration, tone
Turns 6-8: anchor sentences, micro-structure, POV
Turns 9-10: rebuttal anticipation and full document synthesis

In turns 8-10 ask for comprehensive, multi-part responses that require the student to synthesise what they built in prior turns. Explicitly call back to decisions the student made earlier. Ask ONE focused question per turn. Never lecture. Never confirm correctness mid-exam. Do not use em dashes anywhere in your questions.`,
    openingQuestion: "You have one page and a reader who has already read 39 memos this week. What is the single most important thing your opening sentence needs to do, and why does everything else in the document depend on it?"
  }
];

// ── Standard disciplines (unchanged) ─────────────────────────────────────────
const DISCIPLINES = [
  {
    id: "finance", label: "Finance", topic: "DCF Valuation", icon: "◈",
    systemPrompt: `You are an oral examiner testing deep understanding of DCF valuation. Probe in sequence: surface recall → application → causal mechanism → edge-case ambiguity. Ask ONE short question per turn. Never lecture. Never confirm correctness mid-exam.`,
    concepts: ["Terminal Value","WACC","Free Cash Flow","Discount Rate","Beta","Capital Structure","Growth Rate","Risk Premium"],
    openingQuestion: "Walk me through what a DCF is trying to calculate and why it matters.",
    maxTurns: 5
  },
  {
    id: "cs", label: "Computer Science", topic: "Dynamic Programming", icon: "⬡",
    systemPrompt: `You are an oral examiner testing deep understanding of dynamic programming. Probe in sequence: surface recall → application → causal mechanism → edge-case ambiguity. Ask ONE short question per turn. Never lecture. Never confirm correctness mid-exam.`,
    concepts: ["Memoization","Overlapping Subproblems","Optimal Substructure","Tabulation","State Space","Recurrence","Bottom-up","Top-down"],
    openingQuestion: "What's the core insight that makes dynamic programming different from plain recursion?",
    maxTurns: 5
  },
  {
    id: "operations", label: "Operations", topic: "Supply Chain Disruption", icon: "⬢",
    systemPrompt: `You are an oral examiner testing deep understanding of supply chain disruption management. Probe in sequence: surface recall → application → causal mechanism → edge-case ambiguity. Ask ONE short question per turn. Never lecture. Never confirm correctness mid-exam.`,
    concepts: ["Bullwhip Effect","Safety Stock","Lead Time","Single Sourcing","Demand Variability","Buffer Inventory","Supplier Risk","Resilience"],
    openingQuestion: "What makes a supply chain fragile, and what's the first signal you'd look for?",
    maxTurns: 5
  },
  {
    id: "accounting", label: "Accounting", topic: "Revenue Recognition", icon: "◎",
    systemPrompt: `You are an oral examiner testing deep understanding of ASC 606 revenue recognition. Probe in sequence: surface recall → application → causal mechanism → edge-case ambiguity. Ask ONE short question per turn. Never lecture. Never confirm correctness mid-exam.`,
    concepts: ["Performance Obligation","Transaction Price","Contract Modification","Variable Consideration","Point in Time","Over Time","Principal vs Agent","Constraint"],
    openingQuestion: "Under ASC 606, when exactly is revenue recognized — and what determines that timing?",
    maxTurns: 5
  },
  { id: "communications", label: "Communications", topic: "Writing I", icon: "✦", isComms: true }
];

const DEPTH_LABELS = ["Surface","Applied","Causal","Ambiguous"];

// ── EDS normalization ─────────────────────────────────────────────────────────
// Max raw score per turn = depthBonus(28) + lengthBonus(6) = 34
// For 10 turns: max raw = 10 * 34 = 340
// For 5 turns:  max raw = 5  * 34 = 170
// Normalize: normalizedEDS = (rawAccumulated / maxRaw) * 100
function getMaxRaw(maxTurns) {
  return maxTurns * 34;
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const rad = d => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(startDeg)), y1 = cy + r * Math.sin(rad(startDeg));
  const x2 = cx + r * Math.cos(rad(endDeg)),   y2 = cy + r * Math.sin(rad(endDeg));
  return `M ${x1} ${y1} A ${r} ${r} 0 ${endDeg - startDeg > 180 ? 1 : 0} 1 ${x2} ${y2}`;
}

function EDSGauge({ score }) {
  const pct = Math.min(score / 100, 1);
  const end = 150 + 240 * pct;
  return (
    <div style={{ textAlign:"center" }}>
      <svg width="160" height="120" viewBox="0 0 160 120">
        <path d={arcPath(80,80,58,150,390)} fill="none" stroke="#1E3358" strokeWidth="10" strokeLinecap="round"/>
        {pct > 0 && <path d={arcPath(80,80,58,150,end)} fill="none" stroke={GOLD} strokeWidth="10" strokeLinecap="round" style={{transition:"all 0.6s ease"}}/>}
        <text x="80" y="88" textAnchor="middle" fill={PARCH} fontSize="26" fontWeight="700" fontFamily="Georgia,serif">{score}</text>
        <text x="80" y="104" textAnchor="middle" fill={MUTED} fontSize="9" letterSpacing="2" fontFamily="system-ui">EDS</text>
      </svg>
      <div style={{fontSize:10,color:MUTED,letterSpacing:2,marginTop:-8,fontFamily:"system-ui"}}>EPISTEMIC DEPTH</div>
    </div>
  );
}

function ConceptGraph({ concepts, active, visited, size=220 }) {
  const N = concepts.length;
  const cx = size/2, cy = size*0.48;
  const rx = size*0.4, ry = size*0.36;
  const pos = concepts.map((_,i) => {
    const a = (2*Math.PI*i/N) - Math.PI/2;
    return { x: cx + rx*Math.cos(a), y: cy + ry*Math.sin(a) };
  });
  const h = size * 0.92;
  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
      {pos.map((p,i) => pos.slice(i+1).map((q,j) =>
        <line key={`e${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#1E3358" strokeWidth="1" opacity="0.4"/>
      ))}
      {concepts.map((c,i) => {
        const isA = active===i, isV = visited.includes(i);
        const r = size < 240 ? (isA?14:10) : (isA?16:11);
        return (
          <g key={c}>
            <circle cx={pos[i].x} cy={pos[i].y} r={r}
              fill={isA?GOLD:isV?"#2A4A6E":"#162840"}
              stroke={isA?GOLD:isV?"#3A6A9E":"#1E3358"}
              strokeWidth={isA?2:1} style={{transition:"all 0.4s"}}/>
            <text x={pos[i].x} y={pos[i].y+r+10} textAnchor="middle"
              fill={isA?GOLD:isV?SMOKE:MUTED} fontSize={size<240?"9":"10"} fontWeight="700" fontFamily="system-ui">
              {c.length>12?c.slice(0,11)+"…":c}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Waveform({ active, color, bars=16 }) {
  const [hs, setHs] = useState(() => Array(bars).fill(4));
  useEffect(() => {
    if (!active) { setHs(Array(bars).fill(4)); return; }
    const id = setInterval(() => setHs(Array.from({length:bars},()=>4+Math.random()*24)), 120);
    return () => clearInterval(id);
  }, [active, bars]);
  return (
    <svg width={bars*6} height="32" viewBox={`0 0 ${bars*6} 32`}>
      {hs.map((h,i) => <rect key={i} x={i*6} y={(32-h)/2} width="4" height={h} rx="2"
        fill={color||GOLD} opacity={active?0.85:0.2} style={{transition:"height 0.1s,y 0.1s"}}/>)}
    </svg>
  );
}

function Bubble({ role, text, depth }) {
  const isE = role==="examiner";
  return (
    <div style={{display:"flex",flexDirection:isE?"row":"row-reverse",gap:10,marginBottom:16,alignItems:"flex-start"}}>
      <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:isE?GOLD:"#2A4A6E",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:isE?NAVY:PARCH,fontWeight:700}}>
        {isE?"E":"S"}
      </div>
      <div style={{maxWidth:"75%"}}>
        {isE && depth!==undefined && (
          <div style={{fontSize:12,color:GOLD,letterSpacing:2,marginBottom:4,fontFamily:"system-ui",textTransform:"uppercase"}}>
            {DEPTH_LABELS[Math.min(depth,3)]||"Surface"} probe
          </div>
        )}
        <div style={{
          background:isE?"#162840":"#1A3050",
          border:`1px solid ${isE?"#2A4A6E":"#2E5070"}`,
          borderRadius:isE?"4px 16px 16px 16px":"16px 4px 16px 16px",
          padding:"10px 14px",color:PARCH,fontSize:18,lineHeight:1.8,fontFamily:"Georgia,serif"
        }}>{text}</div>
      </div>
    </div>
  );
}

function ScenarioCard({ scenario, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background:hov?"#0D1A2E":"#070F1C",
        border:`1px solid ${hov?GOLD:"#1E3358"}`,
        borderRadius:14,padding:"20px 18px",
        cursor:"pointer",textAlign:"left",transition:"all 0.2s",
        display:"flex",flexDirection:"column",gap:6
      }}>
      <div style={{fontSize:22,marginBottom:2}}>{scenario.icon}</div>
      <div style={{color:PARCH,fontSize:18,fontFamily:"Georgia,serif",lineHeight:1.3}}>{scenario.label}</div>
      <div style={{color:MUTED,fontSize:14,fontFamily:"system-ui",lineHeight:1.5}}>{scenario.sublabel}</div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function EpistemyOralExamDemo() {
  const [screen, setScreen]             = useState("landing");
  const [discipline, setDiscipline]     = useState(null);
  const [scenario, setScenario]         = useState(null);
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [streaming, setStreaming]       = useState("");
  const [rawEds, setRawEds]             = useState(0);  // raw accumulated score
  const [activeNode, setActiveNode]     = useState(null);
  const [visited, setVisited]           = useState([]);
  const [probeDepth, setProbeDepth]     = useState(0);
  const [travLog, setTravLog]           = useState([]);
  const [ttsActive, setTtsActive]       = useState(false);
  const [ttsLoading, setTtsLoading]     = useState(false);
  const [micState, setMicState]         = useState("idle");
  const [liveText, setLiveText]         = useState("");
  const [voiceMode, setVoiceMode]       = useState(true);
  const [micAvail, setMicAvail]         = useState(false);
  const [permError, setPermError]       = useState("");
  const [ttsError, setTtsError]         = useState("");
  const [feedback, setFeedback]         = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const chatEnd  = useRef(null);
  const recRef   = useRef(null);
  const audioRef = useRef(null);
  const msgRef   = useRef(messages);
  const discRef  = useRef(discipline);
  const scenRef  = useRef(scenario);
  const depthRef = useRef(probeDepth);
  const loadRef  = useRef(loading);
  const vmRef    = useRef(voiceMode);
  const rawEdsRef = useRef(rawEds);

  useEffect(()=>{ msgRef.current    = messages;  },[messages]);
  useEffect(()=>{ discRef.current   = discipline; },[discipline]);
  useEffect(()=>{ scenRef.current   = scenario;   },[scenario]);
  useEffect(()=>{ depthRef.current  = probeDepth; },[probeDepth]);
  useEffect(()=>{ loadRef.current   = loading;    },[loading]);
  useEffect(()=>{ vmRef.current     = voiceMode;  },[voiceMode]);
  useEffect(()=>{ rawEdsRef.current = rawEds;     },[rawEds]);

  useEffect(()=>{
    setMicAvail(!!(window.SpeechRecognition||window.webkitSpeechRecognition));
  },[]);

  useEffect(()=>{ chatEnd.current?.scrollIntoView({behavior:"smooth"}); },[messages,streaming]);

  // ── Normalized EDS (0-100) ────────────────────────────────────────────────
  const activeConfig = scenario || discipline;
  const maxTurns = activeConfig?.maxTurns || 5;
  const normalizedEds = Math.min(Math.round((rawEds / getMaxRaw(maxTurns)) * 100), 100);

  // ── Stop audio ────────────────────────────────────────────────────────────
  const stopAudio = useCallback(()=>{
    if(audioRef.current){ audioRef.current.pause(); audioRef.current=null; }
    setTtsActive(false); setTtsLoading(false);
  },[]);

  // ── ElevenLabs TTS ────────────────────────────────────────────────────────
  const speak = useCallback(async(text)=>{
    if(!vmRef.current||!text?.trim()) return;
    stopAudio(); setTtsError(""); setTtsLoading(true);
    try{
      const res=await fetch("/api/speak",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-demo-token":DEMO_TOKEN},
        body:JSON.stringify({text})
      });
      if(!res.ok){ const e=await res.json().catch(()=>({})); setTtsError(`Voice error: ${e.error||res.status}`); setTtsLoading(false); return; }
      const blob=await res.blob(), url=URL.createObjectURL(blob), audio=new Audio(url);
      audioRef.current=audio;
      audio.onplay=()=>{ setTtsLoading(false); setTtsActive(true); };
      audio.onended=()=>{ stopAudio(); URL.revokeObjectURL(url); };
      audio.onerror=()=>{ stopAudio(); URL.revokeObjectURL(url); setTtsError("Audio playback failed."); };
      await audio.play();
    }catch(err){ setTtsLoading(false); setTtsError(`Voice error: ${err.message}`); }
  },[stopAudio]);

  // ── STT ───────────────────────────────────────────────────────────────────
  const toggleMic = useCallback(()=>{
    if(micState==="listening"){ recRef.current?.stop(); setMicState("idle"); return; }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ setPermError("Use Chrome or Edge for mic support."); return; }
    if(recRef.current){ try{ recRef.current.abort(); }catch(e){} }
    const rec=new SR();
    rec.continuous=true; rec.interimResults=true; rec.lang="en-US"; rec.maxAlternatives=1;
    rec.onstart=()=>{ setMicState("listening"); setPermError(""); setLiveText(""); };
    rec.onresult=(e)=>{
      let interim="",final="";
      for(let i=e.resultIndex;i<e.results.length;i++){
        if(e.results[i].isFinal) final+=e.results[i][0].transcript;
        else interim+=e.results[i][0].transcript;
      }
      setLiveText(interim||final);
      if(final){ setInput(prev=>(prev?prev+" ":"")+final.trim()); setLiveText(""); }
    };
    rec.onerror=(e)=>{
      setMicState("error");
      if(e.error==="not-allowed") setPermError("Microphone access denied.");
      else if(e.error==="no-speech") setPermError("No speech detected. Try again.");
      else setPermError(`Mic error: ${e.error}`);
      setTimeout(()=>setMicState("idle"),2000);
    };
    rec.onend=()=>{ setMicState(s=>s==="listening"?"idle":s); setLiveText(""); };
    recRef.current=rec;
    try{ rec.start(); }catch(err){ setPermError("Could not start mic: "+err.message); setMicState("idle"); }
  },[micState]);

  // ── Graph advance ─────────────────────────────────────────────────────────
  const advanceGraph = useCallback((config)=>{
    const n=config.concepts.length;
    const next=Math.floor(Math.random()*n);
    setActiveNode(next);
    setVisited(prev=>[...new Set([...prev,next])]);
    setTravLog(prev=>[config.concepts[next],...prev].slice(0,6));
  },[]);

  // ── Generate feedback (Writing I only) ───────────────────────────────────
  const generateFeedback = useCallback(async(msgs, sc)=>{
    setFeedbackLoading(true);
    try{
      const transcript = msgs
        .filter(m=>m.role==="student")
        .map((m,i)=>`Response ${i+1}: ${m.text}`)
        .join("\n\n");

      const feedbackPrompt = `You are a writing instructor giving brief qualitative feedback to a student who just completed an oral writing exam.

Scenario: ${sc.label}
Context: ${sc.context}
Audience: ${sc.audience}

Student responses across the exam:
${transcript}

Write exactly 5 sentences of feedback in a teacher's voice. Cite specific things the student said at least twice using their exact words in quotes. Cover argument construction, tone awareness, and structural choices. End with one concrete next-step writing exercise. Do not mention scores, numbers, or grades. Do not use em dashes anywhere in the feedback.`;

      const res=await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-demo-token":DEMO_TOKEN},
        body:JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:400,
          system:"You are a writing instructor. Be concise, specific, and encouraging without being vague. Do not use em dashes.",
          stream:false,
          messages:[{role:"user",content:feedbackPrompt}]
        })
      });
      const feedData=await res.json();
      const full=feedData.content?.[0]?.text||"";
      setFeedback(full);
    }catch(err){ setFeedback("Feedback could not be generated at this time."); }
    setFeedbackLoading(false);
  },[]);

  // ── Claude ────────────────────────────────────────────────────────────────
  const callClaude = useCallback(async(msgs, config, depth)=>{
    setLoading(true); setStreaming("");
    try{
      const res=await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-demo-token":DEMO_TOKEN},
        body:JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:1000,
          system:config.systemPrompt, stream:false,
          messages:msgs.map(m=>({role:m.role==="examiner"?"assistant":"user",content:m.text}))
        })
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data=await res.json();
      const full=data.content?.[0]?.text||"";
      if(!full) throw new Error("Empty response");
      setMessages(prev=>[...prev,{role:"examiner",text:full,depth}]);
      setStreaming("");
      advanceGraph(config);
      setProbeDepth(prev=>Math.min(prev+1,3));
      if(vmRef.current) speak(full);
    }catch(err){
      setMessages(prev=>[...prev,{role:"examiner",text:`Error: ${err.message}`,depth:0}]);
      setStreaming("");
    }
    setLoading(false);
  },[advanceGraph,speak]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const submit = useCallback(async()=>{
    const ans=input.trim(); if(!ans||loadRef.current) return;
    if(micState==="listening"){ recRef.current?.stop(); setMicState("idle"); }
    stopAudio();
    const config=scenRef.current||discRef.current;
    const sm={role:"student",text:ans};
    const next=[...msgRef.current,sm];
    setMessages(next); setInput(""); setLiveText("");
    const depth=depthRef.current;
    // accumulate raw EDS
    const bonus=[5,10,18,28][Math.min(depth,3)]||5;
    const lenBonus=Math.min(ans.length/40,6);
    setRawEds(prev=>prev+bonus+lenBonus);
    const studentCount=next.filter(m=>m.role==="student").length;
    const mt=config.maxTurns||5;
    if(studentCount>=mt){
      // generate feedback for Writing I before showing results
      if(config.isWriting1) await generateFeedback(next, config);
      setScreen("results");
      return;
    }
    await callClaude(next,config,Math.min(depth+1,3));
  },[input,micState,stopAudio,callClaude,generateFeedback]);

  // ── Start exam ────────────────────────────────────────────────────────────
  const startExam = useCallback((config)=>{
    setMessages([]); setRawEds(0); setActiveNode(null);
    setVisited([]); setProbeDepth(0); setTravLog([]); setInput(""); setLiveText("");
    setPermError(""); setTtsError(""); setMicState("idle"); setFeedback(""); stopAudio();
    const opening={role:"examiner",text:config.openingQuestion,depth:0};
    setMessages([opening]); setScreen("exam");
    if(vmRef.current) setTimeout(()=>speak(config.openingQuestion),300);
    advanceGraph(config);
  },[advanceGraph,speak,stopAudio]);

  const handleDisciplineClick = useCallback((disc)=>{
    if(disc.isComms){ setDiscipline(disc); setScenario(null); setScreen("scenario-picker"); }
    else{ setDiscipline(disc); setScenario(null); startExam(disc); }
  },[startExam]);

  const handleScenarioClick = useCallback((sc)=>{ setScenario(sc); startExam(sc); },[startExam]);

  const replay=useCallback(()=>{
    const last=[...msgRef.current].reverse().find(m=>m.role==="examiner");
    if(last) speak(last.text);
  },[speak]);

  const micListening = micState==="listening";
  const micErr       = micState==="error";
  const currentConfig = scenario || discipline;

  // ── LANDING ─────────────────────────────────────────────────────────────
  if(screen==="landing") return (
    <div style={{minHeight:"100vh",background:NAVY,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:"40px 24px",fontFamily:"Georgia,serif"}}>
      <div style={{fontSize:11,letterSpacing:6,color:GOLD,fontFamily:"system-ui",fontWeight:700,marginBottom:8}}>EPISTEMY</div>
      <h1 style={{color:PARCH,fontSize:36,fontWeight:400,textAlign:"center",margin:"0 0 10px",lineHeight:1.2}}>Oral Examination</h1>
      <p style={{color:MUTED,fontSize:16,textAlign:"center",maxWidth:440,lineHeight:1.7,margin:"0 0 28px",fontStyle:"italic"}}>
        Four depth levels. Questions spoken aloud. Answer by voice or keyboard.
      </p>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28,
        background:"#070F1C",border:"1px solid #1E3358",borderRadius:10,padding:"10px 18px"}}>
        <span style={{color:MUTED,fontSize:11,fontFamily:"system-ui",letterSpacing:1}}>VOICE MODE</span>
        <button onClick={()=>setVoiceMode(v=>!v)} style={{
          width:48,height:26,borderRadius:13,border:"none",cursor:"pointer",
          background:voiceMode?GOLD:"#1E3358",position:"relative",transition:"background 0.3s"}}>
          <div style={{width:20,height:20,borderRadius:"50%",background:PARCH,position:"absolute",
            top:3,left:voiceMode?24:4,transition:"left 0.3s"}}/>
        </button>
        <span style={{color:voiceMode?GOLD:MUTED,fontSize:12,fontFamily:"system-ui"}}>
          {voiceMode?"On — ElevenLabs + mic":"Off — text only"}
        </span>
        {voiceMode&&!micAvail&&<span style={{color:RED,fontSize:10,fontFamily:"system-ui"}}>Use Chrome/Edge for mic</span>}
      </div>

      <button onClick={()=>handleDisciplineClick(DISCIPLINES[4])} style={{
        width:"100%",maxWidth:560,background:"#070F1C",border:"1px solid #1E3358",borderRadius:14,
        padding:"32px 28px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",
        display:"flex",alignItems:"center",gap:24}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.background="#0D1A2E";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="#1E3358";e.currentTarget.style.background="#070F1C";}}>
        <div style={{fontSize:36}}>✦</div>
        <div>
          <div style={{color:PARCH,fontSize:22,marginBottom:6,fontFamily:"Georgia,serif"}}>Communications</div>
          <div style={{color:GOLD,fontSize:11,letterSpacing:2,fontFamily:"system-ui"}}>WRITING I · INFORMATIVE BUSINESS DOCUMENTS →</div>
        </div>
      </button>
      <div style={{color:"#243550",fontSize:10,marginTop:28,letterSpacing:2,fontFamily:"system-ui"}}>UC BERKELEY SKYDECK · PAD-13</div>
    </div>
  );

  // ── SCENARIO PICKER ──────────────────────────────────────────────────────
  if(screen==="scenario-picker") return (
    <div style={{minHeight:"100vh",background:NAVY,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:"40px 24px",fontFamily:"Georgia,serif"}}>
      <button onClick={()=>setScreen("landing")} style={{
        alignSelf:"flex-start",background:"transparent",color:MUTED,border:"none",
        cursor:"pointer",fontSize:12,fontFamily:"system-ui",marginBottom:20}}>
        Back
      </button>
      <div style={{fontSize:11,letterSpacing:5,color:GOLD,fontFamily:"system-ui",fontWeight:700,marginBottom:8}}>COMMUNICATIONS · WRITING I</div>
      <h1 style={{color:PARCH,fontSize:28,fontWeight:400,textAlign:"center",margin:"0 0 8px",lineHeight:1.2}}>
        Choose your scenario
      </h1>
      <p style={{color:MUTED,fontSize:15,textAlign:"center",maxWidth:480,lineHeight:1.6,margin:"0 0 10px",fontStyle:"italic"}}>
        Informative business documents. 10-turn exam. Your document is built question by question.
      </p>
      <p style={{color:MUTED,fontSize:14,textAlign:"center",maxWidth:480,lineHeight:1.6,margin:"0 0 28px",fontFamily:"system-ui"}}>
        Qualitative feedback is generated at the end of each session.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,width:"100%",maxWidth:680}}>
        {WRITING1_SCENARIOS.map(sc=>(
          <ScenarioCard key={sc.id} scenario={sc} onClick={()=>handleScenarioClick(sc)}/>
        ))}
      </div>
      <div style={{color:"#243550",fontSize:10,marginTop:24,letterSpacing:2,fontFamily:"system-ui"}}>UC BERKELEY HAAS · UGBA100 · WEEK 4</div>
    </div>
  );

  // ── RESULTS ──────────────────────────────────────────────────────────────
  if(screen==="results") {
    const sm=messages.filter(m=>m.role==="student");
    const avgLen=sm.reduce((s,m)=>s+m.text.length,0)/Math.max(sm.length,1);
    const isW1=!!currentConfig?.isWriting1;
    return (
      <div style={{minHeight:"100vh",background:NAVY,display:"flex",flexDirection:"column",
        alignItems:"center",padding:"40px 24px",fontFamily:"Georgia,serif",overflowY:"auto"}}>
        <div style={{fontSize:10,letterSpacing:4,color:GOLD,fontFamily:"system-ui",marginBottom:14}}>EXAM COMPLETE</div>
        <h2 style={{color:PARCH,fontSize:28,fontWeight:400,margin:"0 0 6px"}}>Epistemic Depth Report</h2>
        {isW1 && (
          <div style={{color:MUTED,fontSize:12,fontFamily:"system-ui",marginBottom:20,letterSpacing:1}}>
            {currentConfig.label.toUpperCase()}
          </div>
        )}
        <EDSGauge score={normalizedEds}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,margin:"24px 0",width:"100%",maxWidth:480}}>
          {[
            {label:"Depth Reached",value:DEPTH_LABELS[Math.min(probeDepth,3)]},
            {label:"Concepts",value:`${visited.length} / ${currentConfig?.concepts?.length||0}`},
            {label:"Turns",value:`${sm.length} / ${currentConfig?.maxTurns||5}`}
          ].map(s=>(
            <div key={s.label} style={{background:"#070F1C",border:"1px solid #1E3358",
              borderRadius:10,padding:"14px 12px",textAlign:"center"}}>
              <div style={{color:GOLD,fontSize:22,fontWeight:700,marginBottom:4}}>{s.value}</div>
              <div style={{color:MUTED,fontSize:12,letterSpacing:1,fontFamily:"system-ui"}}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Feedback blurb — Writing I only */}
        {isW1 && (
          <div style={{width:"100%",maxWidth:560,background:"#0A1828",border:"1px solid #1E3358",
            borderRadius:12,padding:"20px 22px",marginBottom:24}}>
            <div style={{fontSize:10,letterSpacing:3,color:GOLD,fontFamily:"system-ui",marginBottom:12}}>
              INSTRUCTOR FEEDBACK
            </div>
            {feedbackLoading ? (
              <div style={{color:MUTED,fontSize:13,fontStyle:"italic"}}>Generating feedback...</div>
            ) : (
              <div style={{color:PARCH,fontSize:18,lineHeight:1.9,fontFamily:"Georgia,serif"}}>
                {feedback || "No feedback available."}
              </div>
            )}
          </div>
        )}

        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>{ stopAudio(); startExam(currentConfig); }} style={{background:GOLD,color:NAVY,
            border:"none",borderRadius:8,padding:"12px 24px",fontSize:14,cursor:"pointer",fontFamily:"Georgia,serif"}}>
            Retake
          </button>
          {isW1 ? (
            <button onClick={()=>{ stopAudio(); setScreen("scenario-picker"); }} style={{background:"transparent",
              color:PARCH,border:"1px solid #1E3358",borderRadius:8,padding:"12px 24px",fontSize:14,
              cursor:"pointer",fontFamily:"Georgia,serif"}}>
              New scenario
            </button>
          ) : (
            <button onClick={()=>{ stopAudio(); setScreen("landing"); }} style={{background:"transparent",
              color:PARCH,border:"1px solid #1E3358",borderRadius:8,padding:"12px 24px",fontSize:14,
              cursor:"pointer",fontFamily:"Georgia,serif"}}>
              Change topic
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── EXAM ─────────────────────────────────────────────────────────────────
  const isW1 = !!currentConfig?.isWriting1;
  const studentTurns = messages.filter(m=>m.role==="student").length;
  const totalTurns   = currentConfig?.maxTurns || 5;
  const turnLabel    = `${studentTurns} / ${totalTurns}`;

  return (
    <div style={{minHeight:"100vh",background:NAVY,display:"grid",
      gridTemplateColumns:"1fr 300px",fontFamily:"Georgia,serif"}}>

      {/* Left: chat */}
      <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"}}>

        {/* header */}
        <div style={{padding:"13px 20px",borderBottom:"1px solid #1E3358",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          background:"#070F1C",flexShrink:0}}>
          <div style={{minWidth:0}}>
            <span style={{color:GOLD,fontSize:11,letterSpacing:3,fontFamily:"system-ui",fontWeight:700}}>EPISTEMY</span>
            <span style={{color:MUTED,fontSize:13,marginLeft:12,fontFamily:"system-ui",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {isW1 ? currentConfig.label : `${currentConfig?.label} · ${currentConfig?.topic}`}
            </span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            {/* turn counter */}
            <span style={{fontSize:12,color:MUTED,fontFamily:"system-ui",letterSpacing:1}}>
              TURN {turnLabel}
            </span>
            {ttsLoading&&<span style={{color:MUTED,fontSize:9,fontFamily:"system-ui",letterSpacing:1}}>LOADING...</span>}
            {ttsActive&&(
              <span style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:GOLD,display:"inline-block",animation:"pulse 1s infinite"}}/>
                <span style={{color:GOLD,fontSize:9,fontFamily:"system-ui",letterSpacing:1}}>SPEAKING</span>
              </span>
            )}
            {micListening&&(
              <span style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:RED,display:"inline-block",animation:"pulse 0.6s infinite"}}/>
                <span style={{color:RED,fontSize:9,fontFamily:"system-ui",letterSpacing:1}}>LISTENING</span>
              </span>
            )}
            <button onClick={()=>{stopAudio();recRef.current?.abort();setScreen("landing");}}
              style={{background:"transparent",color:MUTED,border:"none",cursor:"pointer",fontSize:11,fontFamily:"system-ui"}}>
              Exit
            </button>
          </div>
        </div>

        {/* scenario context banner */}
        {isW1 && (
          <div style={{background:"#070F1C",borderBottom:"1px solid #1E3358",padding:"10px 20px",flexShrink:0}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{fontSize:18,flexShrink:0}}>{currentConfig.icon}</span>
              <div>
                <div style={{color:GOLD,fontSize:9,letterSpacing:2,fontFamily:"system-ui",marginBottom:3}}>SCENARIO</div>
                <div style={{color:SMOKE,fontSize:15,fontFamily:"system-ui",lineHeight:1.5,marginBottom:3}}>
                  {currentConfig.sublabel}
                </div>
                <div style={{color:MUTED,fontSize:14,fontFamily:"system-ui",lineHeight:1.5}}>
                  <span style={{color:GOLD,opacity:.7}}>Audience: </span>{currentConfig.audience}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* messages */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 20px 10px",
          scrollbarWidth:"thin",scrollbarColor:"#1E3358 transparent"}}>
          {messages.map((m,i)=><Bubble key={i} role={m.role} text={m.text} depth={m.depth}/>)}
          {streaming&&<Bubble role="examiner" text={streaming+"▌"} depth={probeDepth}/>}
          {loading&&!streaming&&(
            <div style={{color:MUTED,fontSize:15,padding:"4px 0 10px",fontStyle:"italic"}}>Considering...</div>
          )}
          <div ref={chatEnd}/>
        </div>

        {/* turn progress bar */}
        <div style={{padding:"6px 20px 0",background:"#070F1C",flexShrink:0}}>
          <div style={{background:"#1E3358",borderRadius:3,height:3,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:3,background:GOLD,
              width:`${(studentTurns/totalTurns)*100}%`,transition:"width 0.4s"}}/>
          </div>
        </div>

        {/* input */}
        <div style={{padding:"12px 20px 16px",borderTop:"1px solid #1E3358",background:"#070F1C",flexShrink:0}}>
          {(micListening||liveText)&&(
            <div style={{background:"#0D1A2E",border:"1px solid #2A4A6E",borderRadius:8,
              padding:"8px 14px",marginBottom:8,color:SMOKE,fontSize:13,fontStyle:"italic",minHeight:34,lineHeight:1.5}}>
              {liveText||<span style={{color:MUTED}}>Listening — speak now...</span>}
            </div>
          )}
          {permError&&(
            <div style={{background:"#2A0A0A",border:"1px solid #C0392B",borderRadius:8,
              padding:"8px 14px",marginBottom:8,color:"#FF8A80",fontSize:12,fontFamily:"system-ui"}}>{permError}</div>
          )}
          {ttsError&&(
            <div style={{background:"#2A1A00",border:"1px solid #C08030",borderRadius:8,
              padding:"8px 14px",marginBottom:8,color:"#FFB870",fontSize:12,fontFamily:"system-ui"}}>{ttsError}</div>
          )}
          <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
            <textarea value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit();}}}
              placeholder={micAvail&&voiceMode?"Click mic to speak, or type here...":"Type your answer and press Enter..."}
              rows={isW1?3:2}
              style={{flex:1,background:"#0D1A2E",border:"1px solid #1E3358",borderRadius:10,
                padding:"10px 14px",color:PARCH,fontSize:18,fontFamily:"Georgia,serif",
                resize:"none",outline:"none",lineHeight:1.5}}
            />
            {micAvail&&voiceMode&&(
              <button onClick={toggleMic} title={micListening?"Stop":"Speak"} style={{
                width:50,height:50,borderRadius:"50%",border:"none",cursor:"pointer",flexShrink:0,
                background:micListening?RED:micErr?"#4A1010":"#162840",
                display:"flex",alignItems:"center",justifyContent:"center",
                transition:"background 0.2s",boxShadow:micListening?`0 0 0 5px ${RED}44`:"none",outline:"none"}}>
                {micListening?(
                  <svg width="18" height="18" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill={PARCH}/></svg>
                ):(
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="12" rx="3" fill={micErr?RED:MUTED}/>
                    <path d="M5 11a7 7 0 0 0 14 0" stroke={micErr?RED:MUTED} strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <line x1="12" y1="18" x2="12" y2="22" stroke={micErr?RED:MUTED} strokeWidth="2" strokeLinecap="round"/>
                    <line x1="8" y1="22" x2="16" y2="22" stroke={micErr?RED:MUTED} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            )}
            {voiceMode&&(
              <button onClick={replay} title="Replay question" style={{
                width:50,height:50,borderRadius:"50%",border:"none",cursor:"pointer",
                background:ttsLoading||ttsActive?"#1E3A5A":"#162840",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,outline:"none"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12a8 8 0 1 0 8-8" stroke={ttsActive?GOLD:MUTED} strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <polyline points="4 6 4 12 10 12" stroke={ttsActive?GOLD:MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <polygon points="10,8 10,16 17,12" fill={ttsActive?GOLD:MUTED}/>
                </svg>
              </button>
            )}
            <button onClick={submit} disabled={loading||!input.trim()} style={{
              width:50,height:50,borderRadius:"50%",border:"none",cursor:"pointer",flexShrink:0,
              background:input.trim()&&!loading?GOLD:"#162840",
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"background 0.2s",outline:"none"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <line x1="22" y1="2" x2="11" y2="13" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round"/>
                <polygon points="22,2 15,22 11,13 2,9" fill={NAVY}/>
              </svg>
            </button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10}}>
            <Waveform active={ttsActive} color={GOLD} bars={14}/>
            <span style={{color:MUTED,fontSize:9,fontFamily:"system-ui",letterSpacing:1,minWidth:100,textAlign:"center"}}>
              {ttsLoading?"LOADING VOICE...":ttsActive?"EXAMINER SPEAKING":micListening?"RECORDING":"STANDBY"}
            </span>
            <Waveform active={micListening} color={GREEN} bars={14}/>
          </div>
        </div>
      </div>

      {/* Right: sidebar — 300px wide */}
      <div style={{borderLeft:"1px solid #1E3358",background:"#070F1C",
        display:"flex",flexDirection:"column",padding:"18px 16px",gap:20,overflowY:"auto"}}>

        {/* EDS */}
        <div>
          <div style={{fontSize:12,color:MUTED,letterSpacing:2,fontFamily:"system-ui",marginBottom:8}}>SCORE</div>
          <EDSGauge score={normalizedEds}/>
          {isW1 && (
            <div style={{fontSize:12,color:MUTED,fontFamily:"system-ui",textAlign:"center",marginTop:4}}>
              Normalized · 10-turn scale
            </div>
          )}
        </div>

        {/* Probe depth */}
        <div>
          <div style={{fontSize:12,color:MUTED,letterSpacing:2,fontFamily:"system-ui",marginBottom:8}}>PROBE DEPTH</div>
          {DEPTH_LABELS.map((l,i)=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",
                background:i<=probeDepth?GOLD:"#1E3358",transition:"background 0.4s"}}/>
              <span style={{color:i<=probeDepth?PARCH:MUTED,fontSize:11,
                fontFamily:"system-ui",transition:"color 0.4s",fontSize:14}}>{l}</span>
            </div>
          ))}
        </div>

        {/* Concept map — larger for 300px sidebar */}
        {currentConfig?.concepts && (
          <>
            <div>
              <div style={{fontSize:12,color:MUTED,letterSpacing:2,fontFamily:"system-ui",marginBottom:6}}>CONCEPT MAP</div>
              <ConceptGraph
                concepts={currentConfig.concepts}
                active={activeNode}
                visited={visited}
                size={268}
              />
            </div>

            {/* Traversal log */}
            <div>
              <div style={{fontSize:12,color:MUTED,letterSpacing:2,fontFamily:"system-ui",marginBottom:6}}>TRAVERSAL LOG</div>
              {travLog.length===0
                ?<div style={{color:"#1E3358",fontSize:11,fontFamily:"system-ui"}}>—</div>
                :travLog.map((c,i)=>(
                  <div key={i} style={{fontSize:11,fontFamily:"system-ui",marginBottom:4,
                    color:i===0?GOLD:MUTED,opacity:1-i*0.13,fontSize:14}}>
                    {i===0?"▸ ":"  "}{c}
                  </div>
                ))
              }
            </div>

            {/* Coverage */}
            <div>
              <div style={{fontSize:12,color:MUTED,letterSpacing:2,fontFamily:"system-ui",marginBottom:6}}>COVERAGE</div>
              <div style={{background:"#1E3358",borderRadius:4,height:6,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:4,background:GOLD,
                  width:`${(visited.length/currentConfig.concepts.length)*100}%`,transition:"width 0.5s"}}/>
              </div>
              <div style={{color:MUTED,fontSize:13,fontFamily:"system-ui",marginTop:4}}>
                {visited.length} / {currentConfig.concepts.length}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#1E3358;border-radius:2px}
      `}</style>
    </div>
  );
}
