import { normalizeRichText } from '../../src/shared/lib/richText';

// Mirrors RichTextRenderer: every non-empty line is its own paragraph and
// consecutive bullet lines become a single tight markdown list.
export const richTextToBlocks = (text: string): string[] => {
  const blocks: string[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length > 0) {
      blocks.push(bullets.map((bullet) => `- ${bullet}`).join('\n'));
      bullets = [];
    }
  };

  for (const rawLine of normalizeRichText(text).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === '') continue;

    const bullet = line.match(/^[●•*◦▪-]\s*(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }

    flushBullets();
    blocks.push(line);
  }

  flushBullets();
  return blocks;
};
