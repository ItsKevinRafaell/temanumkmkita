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
  | { type: "columns"; count: 2 | 3; columns: ContentBlock[][] }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | { type: "howto"; steps: { name: string; text: string; image?: string }[] }
  | { type: "key-takeaway"; items: string[] }
  | { type: "source"; items: { label: string; url: string; accessed?: string }[] }
  | { type: "expert-quote"; quote: string; author_name: string; author_title: string; author_company?: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  updatedAt?: string;
  readTime: number;
  featured?: boolean;
  cover_image?: string;
  content: ContentBlock[];
  author?: {
    name: string;
    slug: string;
    role: string | null;
    bio: string | null;
    photo_url: string | null;
    linkedin_url: string | null;
  };
}

export function hasBlockType(content: ContentBlock[], type: ContentBlock["type"]): boolean {
  return content.some((b) => {
    if (b.type === type) return true;
    if (b.type === "columns") return b.columns.some((col) => hasBlockType(col, type));
    return false;
  });
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
