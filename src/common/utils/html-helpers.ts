/**
 * Utility to find and cleanly extract the text after a label (e.g., "Court Location: Probate and Mental Health")
 */
export function extractCleanText(
  $: cheerio.Root,
  label: string,
): string | undefined {
  // Find strong elements containing the label
  const el = $(`strong:contains("${label}")`)
    .filter((_, e) => {
      const text = $(e).text().trim();
      return text.includes(`${label}:`) || text === `${label}`;
    })
    .first();

  if (!el.length) return undefined;

  // Get the parent element (usually a <p> tag)
  const parent = el.parent();

  // Extract the full text from parent and normalize whitespace
  const parentText = parent.text();
  const normalizedText = parentText.replace(/\s+/g, ' ').trim();

  // Create regex to match "Label: value" - escape special regex characters
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match label: followed by value, stopping at next label or end
  const regex = new RegExp(
    `${escapedLabel}:\\s*([^:]+?)(?:\\s*<br|\\s*$|\\s*(?=[A-Z][a-z]+:))`,
    'i',
  );

  const match = normalizedText.match(regex);
  if (match && match[1]) {
    // Clean up the extracted value - remove <br> tags and extra spaces
    return match[1].replace(/<[^>]+>/g, '').trim();
  }

  // Fallback: simple text extraction after the label
  const labelIndex = normalizedText.indexOf(`${label}:`);
  if (labelIndex !== -1) {
    const afterLabel = normalizedText.substring(labelIndex + label.length + 1);
    // Take text until next label pattern or <br>
    const valueMatch = afterLabel.match(
      /^([^:<]+?)(?:\s*<br|\s*(?=[A-Z][a-z]+:)|$)/,
    );
    if (valueMatch && valueMatch[1]) {
      return valueMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    // Last resort: take first meaningful chunk
    const cleaned = afterLabel.split(/[<:]/)[0].trim();
    if (cleaned) {
      return cleaned;
    }
  }

  return undefined;
}

/**
 * Normalizes text by trimming and collapsing extra whitespace.
 */
export function normalizeText(value?: string): string | undefined {
  return value ? value.replace(/\s+/g, ' ').trim() : undefined;
}
