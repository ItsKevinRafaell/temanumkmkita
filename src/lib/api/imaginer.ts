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

export async function generateCover(articleId: string): Promise<GenerateCoverResponse> {
  return req<GenerateCoverResponse>(`/api/admin/articles/${articleId}/generate-cover`, {
    method: "POST",
  });
}

export async function generateCoversBulk(): Promise<BulkGenerateProgress> {
  return req<BulkGenerateProgress>("/api/admin/articles/generate-covers-bulk", {
    method: "POST",
  });
}
