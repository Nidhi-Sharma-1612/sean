export interface LegalSection {
  id: string;
  title: string;
  blocks: (string | string[])[];
}

/**
 * Converts a section's admin-edited body text back into the paragraph/bullet
 * block shape LegalPage renders. A line starting with "- " is a bullet;
 * consecutive bullet lines are grouped into one list. Blank lines are just
 * separators and are otherwise ignored.
 */
export function parseLegalBody(body: string): (string | string[])[] {
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const blocks: (string | string[])[] = [];
  let currentList: string[] | null = null;
  for (const line of lines) {
    if (line.startsWith("- ")) {
      const item = line.slice(2).trim();
      if (currentList) {
        currentList.push(item);
      } else {
        currentList = [item];
        blocks.push(currentList);
      }
    } else {
      currentList = null;
      blocks.push(line);
    }
  }
  return blocks;
}

/** The inverse of parseLegalBody, used only to seed/export existing content. */
export function serializeLegalBlocks(blocks: (string | string[])[]): string {
  return blocks
    .map((block) => (Array.isArray(block) ? block.map((item) => `- ${item}`).join("\n") : block))
    .join("\n");
}
