import { req } from "./admin";

export interface GenerateCoverResponse {
  article_id: string;
  slug: string;
  cover_image_url: string;
  prompt_used: string;
}

export interface BulkGenerateProgress {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  results: GenerateCoverResponse[];
  errors: Array<{ slug: string; error: string }>;
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 4, baseDelayMs = 8000): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      const msg = err instanceof Error ? err.message : String(err);
      const retryable =
        msg.includes("500") ||
        msg.includes("429") ||
        msg.toLowerCase().includes("internal server error") ||
        msg.toLowerCase().includes("too many requests");
      if (!retryable || i === attempts - 1) throw err;
      const wait = baseDelayMs * Math.pow(2, i);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw last;
}

export async function generateCover(
  articleId: string
): Promise<GenerateCoverResponse> {
  return withRetry(() =>
    req<GenerateCoverResponse>(
      `/api/admin/articles/${articleId}/generate-cover`,
      { method: "POST" }
    )
  );
}

export async function generateCoversBulk(): Promise<BulkGenerateProgress> {
  return req<BulkGenerateProgress>("/api/admin/articles/generate-covers-bulk", {
    method: "POST",
  });
}
