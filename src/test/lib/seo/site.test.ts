import { describe, it, expect } from "vitest";
import { SITE_URL, extractFirstParagraph } from "@/lib/seo/site";

describe("SITE_URL", () => {
  it("is a valid URL", () => {
    expect(() => new URL(SITE_URL)).not.toThrow();
  });

  it("uses https", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
  });
});

describe("extractFirstParagraph", () => {
  it("extracts first paragraph text", () => {
    const content = JSON.stringify([
      { type: "h2", text: "Heading", id: "h1" },
      { type: "p", text: "This is the first paragraph." },
    ]);
    expect(extractFirstParagraph(content)).toBe("This is the first paragraph.");
  });

  it("truncates long text", () => {
    const text = "A".repeat(200);
    const content = JSON.stringify([{ type: "p", text }]);
    const result = extractFirstParagraph(content, 100);
    expect(result!.length).toBeLessThanOrEqual(100);
    expect(result).toMatch(/…$/);
  });

  it("returns undefined for empty content", () => {
    expect(extractFirstParagraph("[]")).toBeUndefined();
    expect(extractFirstParagraph("invalid json")).toBeUndefined();
  });

  it("skips non-paragraph blocks", () => {
    const content = JSON.stringify([
      { type: "h2", text: "Heading", id: "h1" },
      { type: "ul", items: ["item"] },
      { type: "p", text: "Real paragraph." },
    ]);
    expect(extractFirstParagraph(content)).toBe("Real paragraph.");
  });
});
