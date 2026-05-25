export const SITE_URL = "https://www.temanumkmkita.com";

export function extractFirstParagraph(contentJson: string, maxLen = 160): string | undefined {
  try {
    const blocks = JSON.parse(contentJson);
    for (const b of blocks) {
      if (b.type === "p" && b.text?.trim()) {
        const text = b.text.replace(/<[^>]+>/g, "").trim();
        return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
      }
    }
  } catch {}
  return undefined;
}
