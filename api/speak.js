export const config = { runtime: "edge" };

// Voice IDs — change VOICE_ID below to swap
// Rachel  21m00Tcm4TlvDq8ikWAM  calm, clear, American
// Adam    pNInz6obpgDQGcFmaJgB  deep, authoritative
// Daniel  onwK4e9ZLuTAKqWW03F9  British, measured — default
// Antoni  ErXwobaYiN019PkySvjV  warm, natural

const VOICE_ID = "onwK4e9ZLuTAKqWW03F9"; // Daniel

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-demo-token"
      }
    });
  }

  const token = req.headers.get("x-demo-token");
  if (token !== process.env.DEMO_TOKEN) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  let text, voiceId;
  try {
    const body = await req.json();
    text    = body.text;
    voiceId = body.voiceId || VOICE_ID;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!text?.trim()) {
    return new Response(JSON.stringify({ error: "No text provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
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
    return new Response(JSON.stringify({ error: err }), {
      status: upstream.status,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
