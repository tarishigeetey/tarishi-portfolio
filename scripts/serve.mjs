#!/usr/bin/env node
/**
 * Zero-dependency local dev server with API support.
 * Serves public/ as static files and routes /api/chat to the chat handler.
 * Loads .env for local testing of the live bot.
 *
 * Run: `npm run dev`  ->  http://localhost:3000
 */
import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handler as chatHandler } from "../api/chat.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
const PORT = process.env.PORT || 3000;

// Load .env file for local testing
async function loadEnv() {
  try {
    const envFile = path.join(root, ".env");
    const content = await fs.readFile(envFile, "utf-8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...vals] = trimmed.split("=");
        const value = vals.join("=").replace(/^["']|["']$/g, "");
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    });
    console.log("✓ .env loaded");
  } catch {
    console.log("⚠ No .env file found — bot will run in offline mode");
  }
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  try {
    // Route /api/chat to the chat handler
    if (req.url === "/api/chat" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        try {
          const parsedReq = {
            method: "POST",
            body: body ? JSON.parse(body) : {},
          };
          const response = {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: null,
            status: (code) => {
              response.statusCode = code;
              return response;
            },
            json: (data) => {
              response.body = JSON.stringify(data);
            },
            end: () => {},
          };
          await chatHandler(parsedReq, response);
          res.writeHead(response.statusCode, response.headers);
          res.end(response.body);
        } catch (e) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: "Server error", reply: null }));
        }
      });
      return;
    }

    // Serve static files
    let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (rel === "/") rel = "/index.html";
    const file = path.join(pub, rel);
    if (!file.startsWith(pub)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    const data = await fs.readFile(file);
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
  }
});

await loadEnv();
server.listen(PORT, () => {
  console.log(`\n  Portfolio dev server → http://localhost:${PORT}\n`);
});
