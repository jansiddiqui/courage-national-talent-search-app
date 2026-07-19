export function stripHtml(html: string): string {
  if (!html) return "";

  let result = "";
  let currentIndex = 0;

  while (currentIndex < html.length) {
    const nextTagStart = html.indexOf("<", currentIndex);
    if (nextTagStart === -1) {
      result += html.substring(currentIndex);
      break;
    }

    result += html.substring(currentIndex, nextTagStart);

    const tagContent = html.substring(nextTagStart, nextTagStart + 15).toLowerCase();
    
    if (tagContent.startsWith("<script") || tagContent.startsWith("<style")) {
      const isScript = tagContent.startsWith("<script");
      const closeTag = isScript ? "</script>" : "</style>";
      
      const nextTagEnd = html.toLowerCase().indexOf(closeTag, nextTagStart);
      if (nextTagEnd === -1) {
        break;
      }
      currentIndex = nextTagEnd + closeTag.length;
    } else {
      const nextTagEnd = html.indexOf(">", nextTagStart);
      if (nextTagEnd === -1) {
        result += html.substring(nextTagStart);
        break;
      }
      result += " ";
      currentIndex = nextTagEnd + 1;
    }
  }

  // Decode basic HTML entities
  let clean = result
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
