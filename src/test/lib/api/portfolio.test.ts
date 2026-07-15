import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("fetchPortfolios", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns portfolios for a given service slug", async () => {
    const fakeData = [
      { id: "1", title: "Toko A", service_slug: "web-development", image_url: "/img.jpg" },
    ];
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeData),
    });

    const { fetchPortfolios } = await import("@/lib/api/portfolio");
    const result = await fetchPortfolios("web-development");
    expect(result).toEqual(fakeData);
    expect(mockFetch).toHaveBeenCalled();
  });

  it("returns empty array on error", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    const { fetchPortfolios } = await import("@/lib/api/portfolio");
    const result = await fetchPortfolios("web-development");
    expect(result).toEqual([]);
  });
});
