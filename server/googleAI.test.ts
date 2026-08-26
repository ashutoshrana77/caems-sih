import { afterEach, describe, expect, it, vi } from "vitest";
import { askCAEMS } from "./googleAI";

afterEach(() => vi.restoreAllMocks());

describe("CAEMS Gemini helper", () => {
  it("extracts assistant text from a Gemini response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: "Move to higher ground and follow official instructions." }] } }] }),
    }));
    await expect(askCAEMS([{ role: "user", content: "What should I do during a flood?" }])).resolves.toBe("Move to higher ground and follow official instructions.");
  });

  it("rejects an empty Gemini response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ candidates: [] }) }));
    await expect(askCAEMS([{ role: "user", content: "Hello" }])).rejects.toThrow("empty response");
  });
});
