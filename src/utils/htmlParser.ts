export function stripHtml(html: string): string {
  if (!html) return "";

  // Strip script and style blocks completely
  let clean = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");

  // Strip other tags
  clean = clean.replace(/<[^>]+>/g, " ");

  // Decode basic HTML entities
  clean = clean
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  // Normalize spaces
  return clean.replace(/\s+/g, " ").trim();
}

export function extractInternalLinks(html: string, baseUrl: string): string[] {
  const links: string[] = [];
  if (!html || !baseUrl) return links;

  try {
    const urlObj = new URL(baseUrl);
    const domain = urlObj.hostname;

    const regex = /href=(["'])(.*?)\1/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      let rawHref = match[2].trim();
      if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("javascript:")) continue;

      try {
        const resolved = new URL(rawHref, baseUrl);
        if (resolved.hostname === domain && resolved.protocol.startsWith("http")) {
          // Normalize (strip hash/query)
          resolved.hash = "";
          const linkStr = resolved.toString();
          if (!links.includes(linkStr)) {
            links.push(linkStr);
          }
        }
      } catch (e) {
        // malformed URL
      }
    }
  } catch (err) {
    // base URL is invalid
  }

  return links;
}
