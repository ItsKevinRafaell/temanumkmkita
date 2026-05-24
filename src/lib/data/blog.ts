export type ContentBlock =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "cta-inline" }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "divider" }
  | { type: "columns"; count: 2 | 3; columns: ContentBlock[][] };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  featured?: boolean;
  content: ContentBlock[];
}

export const categories = [
  "Semua",
  "Website",
  "SEO",
  "Sosial Media",
  "Branding",
  "Tips Bisnis",
] as const;

export type Category = (typeof categories)[number];

export function extractHeadings(content: ContentBlock[]): { id: string; text: string; level: 2 | 3 }[] {
  return content
    .filter((b): b is Extract<ContentBlock, { type: "h2" | "h3" }> => b.type === "h2" || b.type === "h3")
    .map((b) => ({ id: b.id, text: b.text, level: b.type === "h2" ? 2 : 3 }));
}
