/**
 * Unit tests for the offline bot answer logic.
 * Run with: `npm test`  (uses the built-in node:test runner, no deps).
 *
 * We guard the DOM-dependent parts of render.js so this file can import
 * `localAnswer` in a plain Node context.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

// render.js guards `document` access, so importing it in Node is safe.
import { localAnswer } from "./render.js";
import { config } from "./config/portfolio.config.js";

test("exact chip question returns its canned answer", () => {
  const chip = config.cannedChips[0];
  assert.equal(localAnswer(chip.q), chip.a);
});

test("exact match is case-insensitive", () => {
  const chip = config.cannedChips[0];
  assert.equal(localAnswer(chip.q.toUpperCase()), chip.a);
});

test("keyword overlap finds a relevant answer", () => {
  // "RAG" appears in the first canned answer's text.
  const ans = localAnswer("can you explain the RAG system");
  assert.ok(ans.length > 0);
  assert.notEqual(ans, config.fallbackAnswer);
});

test("unrelated query falls back gracefully", () => {
  const ans = localAnswer("what is your favorite pizza topping");
  assert.equal(ans, config.fallbackAnswer);
});

test("empty query falls back", () => {
  assert.equal(localAnswer(""), config.fallbackAnswer);
});
