// api/chat.js
// Vercel serverless function. The browser calls /api/chat instead of Anthropic
// directly, so your API key stays server-side and there is no CORS problem.
//
// Setup:
//   1. Put this file at the project root under  api/chat.js  (sibling of src/, NOT inside it).
//   2. In Vercel: Project Settings -> Environment Variables, add:
//        ANTHROPIC_API_KEY = sk-ant-...            (your key)
//        ANTHROPIC_MODEL   = <a model your key can access>   (see note below)
//      Then redeploy (env vars only take effect on a new deployment).
//
// Model note: set ANTHROPIC_MODEL to a model ID your account can call. Check the
// exact current IDs in the Anthropic Console or at docs.claude.com/en/docs/about-claude/models.
// The default below is a fallback only and may not match your account.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY is not set in this deployment" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { system, messages, max_tokens } = body;

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        // The server owns the model choice; the browser's model field is ignored.
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: max_tokens || 1000,
        ...(system ? { system } : {}),
        messages: Array.isArray(messages) ? messages : [],
      }),
    });

    const data = await upstream.json();
    // Pass Anthropic's response straight back (same shape the client already parses).
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
}
