import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal("localStorage", localStorageMock);

describe("admin API - req function", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("returns JSON on success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "1", name: "Test" }),
    });

    const { req } = await import("@/lib/api/admin");
    const result = await req("/api/articles");
    expect(result).toEqual({ id: "1", name: "Test" });
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ detail: "Not found" }),
    });

    const { req } = await import("@/lib/api/admin");
    await expect(req("/api/articles/999")).rejects.toThrow("Not found");
  });
});
