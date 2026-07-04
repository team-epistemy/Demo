// api/speak.js
// Vercel serverless function. The browser calls /api/speak with { text } and
// gets back MP3 audio. Your ElevenLabs key stays server-side.
//
// Setup:
//   1. Put this file at the project root under  api/speak.js  (sibling of src/, NOT inside it).
//   2. In Vercel: Project Settings -> Environment Variables, add:
//        ELEVENLABS_API_KEY  = <your ElevenLabs key>
//        ELEVENLABS_VOICE_ID = <a voice id from your ElevenLabs account>   (optional; default below)
//        ELEVENLABS_MODEL    = eleven_multilingual_v2                       (optional)
//      Then redeploy (env vars only take effect on a new deployment).
//
// Find your voice id in the ElevenLabs dashboard under Voices. The default
// below is ElevenLabs' stock "Rachel" voice, which most accounts can use.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ELEVENLABS_API_KEY is not set in this deployment" });
    return;
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const modelId = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const text = (body.text || "").toString().slice(0, 5000);
    if (!text.trim()) {
      res.status(400).json({ error: "No text provided" });
      return;
    }

    const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "content-type": "application/json",
        "accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: { stability: 0.4, similarity_boost: 0.75 },
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      res.status(upstream.status).json({ error: "ElevenLabs error", detail: detail.slice(0, 500) });
      return;
    }

    const audio = Buffer.from(await upstream.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(audio);
  } catch (err) {
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
}
