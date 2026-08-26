import { describe, expect, it } from "vitest";
import { pilotInterestInput } from "./routers";

describe("pilot interest contract", () => {
  it("accepts a valid SIH pilot request", () => {
    const result = pilotInterestInput.parse({
      name: "Asha Rao",
      organisation: "District Health Office",
      email: "asha@example.org",
    });
    expect(result).toMatchObject({ name: "Asha Rao", organisation: "District Health Office" });
  });

  it("rejects invalid contact details", () => {
    expect(() => pilotInterestInput.parse({ name: "A", organisation: "", email: "not-an-email" })).toThrow();
  });
});
