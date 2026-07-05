/**
 * Portfolio content configuration.
 *
 * This is the single source of truth for everything shown on the site.
 * Edit here — not in the markup. The build/render layer reads this object
 * and paints the DOM, so content stays cleanly separated from presentation.
 *
 * @typedef {"live" | "feature" | "soon"} ProjectStatus
 */

export const config = {
  name: "Tarishi Geetey",
  initials: "TG",
  avatar: "assets/avatar.png", // set to "" to fall back to initials
  role: "Data + AI Engineer",

  // Hero
  heroTitleHTML: "I build <em>production</em> AI systems, not demos.",
  lede:
    "Full-stack Java engineer moving into AI engineering. I build retrieval " +
    "systems, LLM agents, and the backend plumbing that makes them reliable " +
    "in production — with tests, monitoring, and Docker, not notebooks.",
  status: "Open to Data + AI Engineer roles",

  // Contact / links (leave "" to hide that icon)
  email: "tarishi.geetey@gmail.com",
  github: "https://github.com/tarishigeetey",
  linkedin: "https://linkedin.com/in/tarishigeetey",
  resumeUrl: "", // optional: link to a hosted PDF
  footLine: "Looking for a Data + AI Engineer who can ship? Let's talk.",

  // Live bot:
  //   ""          -> offline mode (canned answers below, no API needed)
  //   "/api/chat" -> calls the serverless function (real LLM)
  botEndpoint: "",
  botIntro:
    "Hi — I'm a bot that answers questions about Tarishi. Ask about the RAG " +
    "project, her tech stack, or whether she's a fit for your role.",

  // Canned answers: offline mode + instant fallback if the API call fails.
  cannedChips: [
    {
      q: "Tell me about the RAG project",
      a:
        "The headline project is a production agentic RAG system — an arXiv " +
        "research assistant — built by working through an advanced production-RAG " +
        "course, end to end. It combines OpenSearch hybrid retrieval (BM25 keyword " +
        "+ vector search) with a LangGraph agent that guards against out-of-scope " +
        "questions, grades whether retrieved documents are actually relevant, and " +
        "rewrites the query and retries when they aren't. It's wrapped in a FastAPI " +
        "service with Airflow ingestion, Redis caching, Langfuse tracing, a full " +
        "pytest suite, and Docker Compose. Tarishi understands every layer of that stack.",
    },
    {
      q: "What's your strongest skill?",
      a:
        "Bringing real software-engineering discipline to AI systems. Coming from " +
        "years of full-stack Java, Tarishi handles the part most AI-curious " +
        "candidates skip — API design, testing, containerization, monitoring — " +
        "which is exactly what makes an LLM reliable in production rather than just " +
        "working in a notebook.",
    },
    {
      q: "Are you a fit for a Data + AI Engineer role?",
      a:
        "Yes. Tarishi pairs solid software-engineering fundamentals (years of " +
        "full-stack Java) with hands-on RAG, agents, and data-pipeline work. She's " +
        "built and fully understands a production-grade agentic RAG system, and is " +
        "actively shipping more AI projects. If your role is about making LLMs " +
        "reliable in production, that's her focus.",
    },
    {
      q: "Why the switch from Java?",
      a:
        "Tarishi likes building systems people rely on, and AI is where the " +
        "hardest, most interesting reliability problems are right now. Her Java " +
        "background isn't something she's leaving behind — it's why she can build " +
        "AI systems that hold up in production instead of just working in a demo.",
    },
  ],

  fallbackAnswer:
    "Good question — for specifics like that, the best move is to reach out " +
    "directly using the links at the bottom of the page. Short version: Tarishi " +
    "is a full-stack Java engineer moving into AI, building production-grade RAG " +
    "and agent systems, and looking for a Data + AI Engineer role.",

  // Projects. status: "live" | "feature" | "soon"
  projects: [
    {
      status: "feature",
      title: "Agentic RAG research assistant",
      role: "Built end to end · following an advanced production-RAG course",
      desc:
        "An arXiv paper curator that answers research questions with citations. A " +
        "LangGraph agent guards scope, grades retrieved documents for relevance, " +
        "and rewrites-and-retries when retrieval falls short. Hybrid OpenSearch " +
        "retrieval (BM25 + vectors), FastAPI service, Airflow ingestion, Redis " +
        "cache, Langfuse tracing, full pytest suite, Docker Compose — understood " +
        "layer by layer.",
      stack: [
        "FastAPI",
        "LangGraph",
        "OpenSearch",
        "Airflow",
        "Redis",
        "Langfuse",
        "Docker",
        "pytest",
      ],
      repo: "https://github.com/tarishigeetey/arxiv-paper-curator",
      demo: "",
    },
    {
      status: "live",
      title: "Muzik",
      role: "Personal project · emotion-driven music",
      desc:
        "Share how you're feeling and Muzik builds a playlist to match. Uses " +
        "emotion detection and sentiment analysis to map a mood to the right " +
        "tracks, with a focus on music-API integrations and scalable system design.",
      stack: ["Sentiment analysis", "APIs", "System design"],
      repo: "https://github.com/tarishigeetey/muzik",
      demo: "",
    },
    {
      status: "live",
      title: "Lexa",
      role: "Personal project · conversational language tutor",
      desc:
        "A situational conversational AI for learning and practicing German " +
        "through real-world scenarios — ordering food, shopping, everyday " +
        "interactions — with immersive back-and-forth dialogue to build proficiency.",
      stack: ["Conversational AI", "LLM", "NLP"],
      repo: "https://github.com/tarishigeetey/lexa",
      demo: "",
    },
    {
      status: "soon",
      title: "Coming soon",
      role: "In progress · 4–6 weeks",
      desc: "An LLM evaluation harness — automated scoring for accuracy, hallucination, and latency on every change.",
      stack: ["Python", "evals"],
      repo: "",
      demo: "",
    },
    {
      status: "soon",
      title: "Coming soon",
      role: "In progress · 4–6 weeks",
      desc: "A multi-tool LLM agent that plans, calls external APIs, and self-corrects.",
      stack: ["Agents", "tools"],
      repo: "",
      demo: "",
    },
    {
      status: "soon",
      title: "Coming soon",
      role: "In progress · 4–6 weeks",
      desc: "A streaming data → vector-store ingestion pipeline.",
      stack: ["Pipelines"],
      repo: "",
      demo: "",
    },
  ],

  // Skills, each with a one-line proof.
  skills: [
    { k: "AI", b: "Production LLM apps", n: "Full agentic RAG stack, understood end to end" },
    { k: "AI", b: "Agentic systems", n: "LangGraph agents with guardrails + doc grading" },
    { k: "ENG", b: "Backend engineering", n: "Years of full-stack Java, now Python + FastAPI" },
    { k: "ENG", b: "Production discipline", n: "Tests, Docker, tracing, caching — not notebooks" },
    { k: "DATA", b: "Data pipelines", n: "Airflow ingestion into a hybrid search store" },
    { k: "AI", b: "Retrieval + search", n: "OpenSearch hybrid BM25 + vector retrieval" },
  ],

  skillTags: [
    "Python",
    "Java",
    "FastAPI",
    "LangGraph",
    "RAG",
    "OpenSearch",
    "Airflow",
    "Redis",
    "Docker",
    "pytest",
    "Langfuse",
    "SQL",
  ],
};

export default config;
