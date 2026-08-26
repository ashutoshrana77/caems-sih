import { describe, expect, it } from "vitest";

describe("Google AI Studio credential", () => {
  it("can access the Gemini model catalog", async () => {
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    expect(apiKey, "GOOGLE_AI_STUDIO_API_KEY must be configured").toBeTruthy();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey!)}`);
    expect(response.ok, `Google AI Studio returned ${response.status}`).toBe(true);

    const payload = await response.json() as { models?: unknown[] };
    expect(Array.isArray(payload.models)).toBe(true);
  }, 15000);
});
