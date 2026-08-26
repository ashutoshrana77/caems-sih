import { describe, expect, it } from "vitest";
import { chatInput } from "./routers";

describe("chatbot contract", () => {
  it("accepts a CAEMS chat message", () => {
    const result = chatInput.parse({ messages: [{ role: "user", content: "How do I prepare for flooding?" }] });
    expect(result.messages[0]?.role).toBe("user");
  });

  it("rejects empty or oversized messages", () => {
    expect(() => chatInput.parse({ messages: [{ role: "user", content: "" }] })).toThrow();
    expect(() => chatInput.parse({ messages: Array.from({ length: 13 }, () => ({ role: "user", content: "status" })) })).toThrow();
  });
});
