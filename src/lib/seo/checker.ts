import type { ContentBlock } from "@/lib/data/blog";

export interface SEOInput {
  title: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  blocks: ContentBlock[];
}

export type RuleStatus = "pass" | "improve" | "fail";

export interface SEORule {
  id: string;
  label: string;
  description: string;
  status: RuleStatus;
  score: number;
  maxScore: number;
}

export interface SEOResult {
  totalScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  rules: SEORule[];
}

function extractTextFromBlocks(blocks: ContentBlock[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.type === "p" || b.type === "h2" || b.type === "h3" || b.type === "blockquote") {
      parts.push(b.text);
    } else if (b.type === "ul" || b.type === "ol") {
      parts.push(...b.items);
    } else if (b.type === "faq") {
      for (const item of b.items) {
        parts.push(item.question, item.answer);
      }
    } else if (b.type === "howto") {
      for (const step of b.steps) {
        parts.push(step.name, step.text);
      }
    } else if (b.type === "columns") {
      for (const col of b.columns) {
        parts.push(extractTextFromBlocks(col));
      }
    }
  }
  return parts.join(" ");
}

function firstParaText(blocks: ContentBlock[]): string {
  for (const b of blocks) {
    if (b.type === "p" && b.text.trim()) return b.text;
    if (b.type === "columns") {
      for (const col of b.columns) {
        const t = firstParaText(col);
        if (t) return t;
      }
    }
  }
  return "";
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function kwMatch(text: string, keyword: string): boolean {
  if (!keyword.trim()) return false;
  return text.toLowerCase().includes(keyword.toLowerCase().trim());
}

function hasBlockTypeLocal(blocks: ContentBlock[], type: ContentBlock["type"]): boolean {
  return blocks.some((b) => {
    if (b.type === type) return true;
    if (b.type === "columns") return b.columns.some((col) => hasBlockTypeLocal(col, type));
    return false;
  });
}

function gradeFromScore(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  if (score >= 30) return "D";
  return "F";
}

export function checkSEO(input: SEOInput): SEOResult {
  const { title, seoTitle, metaDescription, focusKeyword, slug, excerpt, coverImage, blocks } = input;
  const kw = focusKeyword.trim().toLowerCase();
  const effectiveTitle = (seoTitle || title).toLowerCase();
  const effectiveMeta = (metaDescription || excerpt).toLowerCase();
  const allText = extractTextFromBlocks(blocks);
  const wordCount = countWords(allText);
  const hasFaqOrHowto = hasBlockTypeLocal(blocks, "faq") || hasBlockTypeLocal(blocks, "howto");

  const rules: SEORule[] = [];

  // kw-in-title (12)
  {
    const pass = kw ? effectiveTitle.includes(kw) : false;
    rules.push({
      id: "kw-in-title",
      label: "Keyword di judul",
      description: "Masukkan focus keyword ke judul artikel (atau SEO title).",
      status: kw ? (pass ? "pass" : "fail") : "fail",
      score: kw && pass ? 12 : 0,
      maxScore: 12,
    });
  }

  // kw-in-meta (10)
  {
    const pass = kw ? effectiveMeta.includes(kw) : false;
    rules.push({
      id: "kw-in-meta",
      label: "Keyword di meta description",
      description: "Masukkan focus keyword ke meta description (atau excerpt).",
      status: kw ? (pass ? "pass" : "fail") : "fail",
      score: kw && pass ? 10 : 0,
      maxScore: 10,
    });
  }

  // kw-in-intro (10)
  {
    const intro = firstParaText(blocks).toLowerCase();
    const introWords = intro.split(/\s+/).slice(0, 100).join(" ");
    const pass = kw ? introWords.includes(kw) : false;
    rules.push({
      id: "kw-in-intro",
      label: "Keyword di 100 kata pertama",
      description: "Tulis focus keyword di paragraf pembuka artikel.",
      status: kw ? (pass ? "pass" : "fail") : "fail",
      score: kw && pass ? 10 : 0,
      maxScore: 10,
    });
  }

  // kw-in-slug (8)
  {
    const kwWords = kw.split(/\s+/).filter(Boolean);
    const pass = kw ? kwWords.some((w) => slug.includes(w)) : false;
    rules.push({
      id: "kw-in-slug",
      label: "Keyword di URL/slug",
      description: "Pastikan slug URL mengandung kata dari focus keyword.",
      status: kw ? (pass ? "pass" : "fail") : "fail",
      score: kw && pass ? 8 : 0,
      maxScore: 8,
    });
  }

  // kw-in-heading (8)
  {
    const headings = blocks
      .filter((b): b is Extract<ContentBlock, { type: "h2" | "h3" }> => b.type === "h2" || b.type === "h3")
      .map((b) => b.text.toLowerCase());
    const pass = kw ? headings.some((h) => h.includes(kw)) : false;
    rules.push({
      id: "kw-in-heading",
      label: "Keyword di subheading",
      description: "Gunakan focus keyword di minimal satu H2 atau H3.",
      status: kw ? (pass ? "pass" : "fail") : "fail",
      score: kw && pass ? 8 : 0,
      maxScore: 8,
    });
  }

  // kw-in-alt (5)
  {
    const images = blocks.filter((b): b is Extract<ContentBlock, { type: "image" }> => b.type === "image");
    let status: RuleStatus;
    let score: number;
    if (images.length === 0) {
      status = "improve";
      score = 2;
    } else if (!kw) {
      status = "fail";
      score = 0;
    } else {
      const pass = images.some((img) => img.alt.toLowerCase().includes(kw));
      status = pass ? "pass" : "fail";
      score = pass ? 5 : 0;
    }
    rules.push({
      id: "kw-in-alt",
      label: "Keyword di alt gambar",
      description: "Tambahkan focus keyword ke alt text minimal satu gambar.",
      status,
      score,
      maxScore: 5,
    });
  }

  // meta-length (10)
  {
    const len = effectiveMeta.length;
    let status: RuleStatus;
    let score: number;
    if (len >= 120 && len <= 160) {
      status = "pass";
      score = 10;
    } else if ((len >= 100 && len < 120) || (len > 160 && len <= 180)) {
      status = "improve";
      score = 6;
    } else {
      status = "fail";
      score = 0;
    }
    rules.push({
      id: "meta-length",
      label: "Panjang meta description",
      description: `Meta description ideal 120–160 karakter. Saat ini: ${len} karakter.`,
      status,
      score,
      maxScore: 10,
    });
  }

  // word-count (15)
  {
    const threshold = hasFaqOrHowto ? 300 : 600;
    const improveThreshold = Math.floor(threshold * 0.8);
    let status: RuleStatus;
    let score: number;
    if (wordCount >= threshold) {
      status = "pass";
      score = 15;
    } else if (wordCount >= improveThreshold) {
      status = "improve";
      score = 8;
    } else {
      status = "fail";
      score = 0;
    }
    rules.push({
      id: "word-count",
      label: "Panjang konten",
      description: `Konten butuh minimal ${threshold} kata${hasFaqOrHowto ? " (dikurangi karena ada FAQ/HowTo)" : ""}. Saat ini: ${wordCount} kata.`,
      status,
      score,
      maxScore: 15,
    });
  }

  // readability (10)
  {
    const sentences = allText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const avgWordsPerSentence =
      sentences.length > 0
        ? sentences.reduce((sum, s) => sum + countWords(s), 0) / sentences.length
        : 0;
    let status: RuleStatus;
    let score: number;
    if (avgWordsPerSentence <= 20 || sentences.length === 0) {
      status = "pass";
      score = 10;
    } else if (avgWordsPerSentence <= 25) {
      status = "improve";
      score = 6;
    } else {
      status = "fail";
      score = 0;
    }
    rules.push({
      id: "readability",
      label: "Keterbacaan kalimat",
      description: `Rata-rata ${Math.round(avgWordsPerSentence)} kata/kalimat. Idealnya ≤20 kata per kalimat.`,
      status,
      score,
      maxScore: 10,
    });
  }

  // has-cover (7)
  {
    const pass = Boolean(coverImage?.trim());
    rules.push({
      id: "has-cover",
      label: "Ada cover image",
      description: "Tambahkan cover image untuk og:image dan tampilan artikel.",
      status: pass ? "pass" : "fail",
      score: pass ? 7 : 0,
      maxScore: 7,
    });
  }

  // has-excerpt (5)
  {
    const pass = Boolean(excerpt?.trim());
    rules.push({
      id: "has-excerpt",
      label: "Ada excerpt / ringkasan",
      description: "Tulis ringkasan singkat artikel di field excerpt.",
      status: pass ? "pass" : "fail",
      score: pass ? 5 : 0,
      maxScore: 5,
    });
  }

  const totalScore = Math.min(100, rules.reduce((s, r) => s + r.score, 0));

  return {
    totalScore,
    grade: gradeFromScore(totalScore),
    rules,
  };
}
