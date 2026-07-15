import { describe, it, expect } from "vitest";
import { hasBlockType, extractHeadings, type ContentBlock } from "@/lib/data/blog";

describe("hasBlockType", () => {
  it("detects block type at top level", () => {
    const blocks: ContentBlock[] = [
      { type: "h2", text: "Test", id: "1" },
      { type: "p", text: "Hello" },
    ];
    expect(hasBlockType(blocks, "h2")).toBe(true);
    expect(hasBlockType(blocks, "faq")).toBe(false);
  });

  it("detects block type nested in columns", () => {
    const blocks: ContentBlock[] = [
      {
        type: "columns",
        count: 2,
        columns: [[{ type: "faq", items: [{ question: "Q", answer: "A" }] }], []],
      },
    ];
    expect(hasBlockType(blocks, "faq")).toBe(true);
  });

  it("returns false for empty array", () => {
    expect(hasBlockType([], "p")).toBe(false);
  });
});

describe("extractHeadings", () => {
  it("extracts h2 and h3 headings with ids", () => {
    const blocks: ContentBlock[] = [
      { type: "h2", text: "Main", id: "main" },
      { type: "p", text: "Para" },
      { type: "h3", text: "Sub", id: "sub" },
    ];
    const headings = extractHeadings(blocks);
    expect(headings).toEqual([
      { id: "main", text: "Main", level: 2 },
      { id: "sub", text: "Sub", level: 3 },
    ]);
  });

  it("ignores non-heading blocks", () => {
    const blocks: ContentBlock[] = [
      { type: "p", text: "Not a heading" },
      { type: "ul", items: ["item"] },
    ];
    expect(extractHeadings(blocks)).toEqual([]);
  });
});
