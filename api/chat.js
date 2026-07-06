// api/chat.js — FREE bot backend using Groq (no credit card required)
//
// WHY THIS EXISTS:
// A public web page can't hold your API key — anyone could "view source" and
// steal it. This function runs on the server, holds the key as an environment
// variable, and is the only thing that talks to the LLM. Your page calls THIS.
// The key never reaches the browser.
//
// WHY GROQ:
// Free tier, no credit card. Just sign up with email at console.groq.com/keys.
// OpenAI-compatible endpoint, runs Llama 3.3 70B fast. Free limits (~30 req/min,
// 14,400 req/day) are far more than a portfolio bot will ever use.
//
// SETUP (Vercel):
//   1. This file lives at /api/chat.js — Vercel deploys it as a serverless function.
//   2. Get a free key at https://console.groq.com/keys  (email signup, no card).
//   3. Vercel -> Project -> Settings -> Environment Variables, add:
//        GROQ_API_KEY = gsk_...
//   4. In src/config/portfolio.config.js set:  botEndpoint: "/api/chat"
//   5. Redeploy. Done — the bot now answers with a real LLM, for free.
//
// (Want Gemini instead? See the note at the bottom of this file.)

const SYSTEM_PROMPT = `
You are the portfolio assistant for a candidate transitioning from full-stack
Java developer to Data + AI Engineer. Answer visitor questions (usually
recruiters or hiring managers) about the candidate, honestly and concisely
(2-4 sentences). Be warm and confident, never inflate.

FACTS YOU KNOW:
- Background: several years as a full-stack Java engineer, now moving into AI engineering.
- Headline project: a production agentic RAG system (an arXiv research assistant),
  built end to end while following an advanced production-RAG course. It uses
  OpenSearch hybrid retrieval (BM25 keyword + vector search) and a LangGraph agent
  that: guards against out-of-scope queries, grades whether retrieved documents are
  relevant, and rewrites the query and retries when they aren't. Wrapped in a FastAPI
  service with Airflow ingestion, Redis caching, Langfuse tracing, a pytest suite,
  and Docker Compose.
- Two other GitHub projects: Muzik and Lexa (personal projects).
- Three more AI projects in progress, shipping in the next 4-6 weeks.
- Strongest skill: taking an LLM from notebook to reliable, deployed production
  service — the backend/engineering discipline most AI-curious candidates lack.
- Goal: land a Data + AI Engineer role.

RULES:
- Only claim what's above. If asked something you don't know (salary, exact dates,
  personal details), say you don't have that and point them to the contact links.
- Never invent projects, employers, metrics, or credentials.
- If asked "should we hire them," make the honest positive case tied to the facts.
`.trim();

export const handler = async function (req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    res.status(500).json({ error: "Server not configured", reply: null });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const incoming = Array.isArray(body?.messages) ? body.messages : [];
    const turns = incoming.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 2000),
    }));

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + key,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 400,
        temperature: 0.6,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...turns],
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      res.status(502).json({ error: "Upstream error", detail, reply: null });
      return;
    }
    const data = await r.json();
    const reply = (data.choices?.[0]?.message?.content || "").trim();
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: "Bad request", reply: null });
  }
}

// ---------------------------------------------------------------
// PREFER GEMINI (also free, no card, higher daily limit)?
// Get a key at https://aistudio.google.com/apikey, set GEMINI_API_KEY,
// and replace the fetch above with:
//
//   const r = await fetch(
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + key,
//     { method: "POST", headers: { "content-type": "application/json" },
//       body: JSON.stringify({
//         system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
//         contents: turns.map(t => ({ role: t.role === "assistant" ? "model" : "user",
//                                     parts: [{ text: t.content }] }))
//       }) });
//   const data = await r.json();
//   const reply = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
// ---------------------------------------------------------------

// Default export for Vercel
export default handler;
