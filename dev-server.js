import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import express from "express";
import cors from "cors";

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ── Auth middleware ───────────────────────────────────────────────────────────
function checkToken(req, res, next) {
  const token = req.headers["x-demo-token"];
  if (token !== process.env.DEMO_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ── /api/chat — Anthropic proxy ───────────────────────────────────────────────
app.post("/api/chat", checkToken, async (req, res) => {
  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    const reader = upstream.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    };
    pump();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── /api/speak — ElevenLabs proxy ────────────────────────────────────────────
const VOICE_ID = "onwK4e9ZLuTAKqWW03F9"; // Daniel — change to swap voice

app.post("/api/speak", checkToken, async (req, res) => {
  const { text, voiceId } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: "No text provided" });

  try {
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || VOICE_ID}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!upstream.ok) {
      const err = await upstream.text();
      return res.status(upstream.status).json({ error: err });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-cache");
    const reader = upstream.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    };
    pump();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Dev proxy running on http://localhost:${PORT}`);
  console.log(`ANTHROPIC_API_KEY:  ${process.env.ANTHROPIC_API_KEY  ? "✓ loaded" : "✗ missing"}`);
  console.log(`ELEVENLABS_API_KEY: ${process.env.ELEVENLABS_API_KEY ? "✓ loaded" : "✗ missing"}`);
  console.log(`DEMO_TOKEN:         ${process.env.DEMO_TOKEN         ? "✓ loaded" : "✗ missing"}`);
});
