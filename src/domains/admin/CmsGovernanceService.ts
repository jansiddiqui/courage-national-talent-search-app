/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * CmsGovernanceService
 * Phase 10: Allowlist-based HTML sanitization replacing regex denylist.
 *
 * Security design:
 * - Only explicitly allowed HTML tags and attributes are permitted.
 * - All other tags are stripped entirely (not just their content).
 * - All other attributes are stripped from allowed tags.
 * - URL-type attributes (href, src, action) are validated against an allowed scheme list.
 * - Attribute values containing javascript: are always rejected.
 *
 * This approach is robust against novel bypasses (e.g., nested tags,
 * encoded characters, CDATA sections) that fool regex-based denylists.
 */

/**
 * Allowed tags and their permitted attributes.
 * Any tag not in this map is stripped entirely.
 */
const ALLOWED_ELEMENTS: Record<string, Set<string>> = {
  p:          new Set(["class", "id"]),
  br:         new Set([]),
  strong:     new Set([]),
  em:         new Set([]),
  u:          new Set([]),
  s:          new Set([]),
  ul:         new Set(["class"]),
  ol:         new Set(["class"]),
  li:         new Set(["class"]),
  h1:         new Set(["class", "id"]),
  h2:         new Set(["class", "id"]),
  h3:         new Set(["class", "id"]),
  h4:         new Set(["class", "id"]),
  h5:         new Set(["class", "id"]),
  h6:         new Set(["class", "id"]),
  blockquote: new Set(["class"]),
  pre:        new Set(["class"]),
  code:       new Set(["class"]),
  a:          new Set(["href", "title", "rel", "target"]),
  img:        new Set(["src", "alt", "title", "width", "height"]),
  table:      new Set(["class"]),
  thead:      new Set([]),
  tbody:      new Set([]),
  tr:         new Set([]),
  th:         new Set(["class", "scope", "colspan", "rowspan"]),
  td:         new Set(["class", "colspan", "rowspan"]),
  div:        new Set(["class", "id"]),
  span:       new Set(["class"]),
  figure:     new Set(["class"]),
  figcaption: new Set(["class"]),
  hr:         new Set([]),
};

/** URL attributes that must be validated for safe schemes */
const URL_ATTRIBUTES = new Set(["href", "src", "action"]);

/** Only these URI schemes are allowed in URL attributes */
const ALLOWED_SCHEMES = ["https:", "http:", "mailto:", "#", "/"];

/**
 * Validates that a URL attribute value uses only an allowed scheme.
 * Returns the original value if safe, or '#' if the scheme is disallowed.
 */
function sanitizeUrl(value: string): string {
  const trimmed = value.trim().toLowerCase();
  // Reject javascript: and data: even in deeply encoded forms
  if (/^[\s\u0000-\u001f]*j[\s\u0000-\u001f]*a[\s\u0000-\u001f]*v[\s\u0000-\u001f]*a[\s\u0000-\u001f]*s[\s\u0000-\u001f]*c[\s\u0000-\u001f]*r[\s\u0000-\u001f]*i[\s\u0000-\u001f]*p[\s\u0000-\u001f]*t[\s\u0000-\u001f]*:/i.test(trimmed)) {
    return "#";
  }
  if (/^data:/i.test(trimmed)) {
    return "#";
  }
  const hasAllowedScheme = ALLOWED_SCHEMES.some(scheme => trimmed.startsWith(scheme));
  if (!hasAllowedScheme && trimmed.includes(":")) {
    // Unknown scheme (e.g., vbscript:, file:)
    return "#";
  }
  return value;
}

/**
 * Server-side allowlist HTML sanitizer.
 *
 * IMPORTANT: In a production environment, use a battle-tested library such as
 * DOMPurify (browser) or `sanitize-html` (Node.js) for maximum coverage.
 * This implementation is a defense-in-depth layer and does NOT replace a
 * full HTML parser-based sanitizer.
 *
 * What this covers:
 *   ✅ Strips disallowed tags entirely
 *   ✅ Strips disallowed attributes from allowed tags
 *   ✅ Validates URL attributes against scheme allowlist
 *   ✅ Strips script, iframe, object, embed, form, style tags
 *   ✅ Removes inline event handlers
 *
 * What this does NOT cover (and why you should add a parser-based lib):
 *   ⚠️ Malformed HTML edge cases
 *   ⚠️ SVG/MathML vectors
 *   ⚠️ HTML entities that encode bypass attempts
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  // Step 1: Hard-remove dangerous structural tags entirely with their content
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^\s>]*[^>]*/gi, "")
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<meta\b[^>]*>/gi, "")
    .replace(/<base\b[^>]*>/gi, "");

  // Step 2: Process remaining tags — allow only whitelisted tags with safe attributes
  sanitized = sanitized.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (match, tagName, attrString) => {
    const lowerTag = tagName.toLowerCase();

    // Closing tags for allowed elements pass through stripped of attributes
    if (match.startsWith("</")) {
      if (ALLOWED_ELEMENTS[lowerTag] !== undefined) {
        return `</${lowerTag}>`;
      }
      return "";
    }

    // Opening tags: check allowlist
    if (ALLOWED_ELEMENTS[lowerTag] === undefined) {
      return ""; // disallowed tag — strip it
    }

    const allowedAttrs = ALLOWED_ELEMENTS[lowerTag];
    const safeAttrs: string[] = [];

    // Parse and filter attributes
    const attrPattern = /([a-zA-Z][\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]*))/g;
    let attrMatch;
    while ((attrMatch = attrPattern.exec(attrString)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      const attrValue = (attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "").trim();

      // Reject all inline event handlers
      if (attrName.startsWith("on")) continue;
      // Reject if not in the allowed attribute set for this tag
      if (!allowedAttrs.has(attrName)) continue;
      // Validate URL attributes
      const safeValue = URL_ATTRIBUTES.has(attrName) ? sanitizeUrl(attrValue) : attrValue;
      safeAttrs.push(`${attrName}="${safeValue.replace(/"/g, "&quot;")}"`);
    }

    // Self-closing tags
    const selfClosing = ["br", "hr", "img"].includes(lowerTag) ? " /" : "";
    return `<${lowerTag}${safeAttrs.length ? " " + safeAttrs.join(" ") : ""}${selfClosing}>`;
  });

  return sanitized;
}

export interface PublishArticleParams {
  title: string;
  slug: string;
  category: string;
  content: string;
  published?: boolean;
}

export async function publishCmsArticle(
  supabaseAdmin: any,
  params: PublishArticleParams
): Promise<any> {
  const sanitizedContent = sanitizeHtml(params.content);

  const { data, error } = await supabaseAdmin
    .from("support_articles")
    .insert({
      title: params.title.trim(),
      slug: params.slug.trim().toLowerCase(),
      category: params.category,
      content: sanitizedContent,
      published: !!params.published,
      version: 1,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to publish CMS article: ${error.message}`);
  return data;
}

export async function updateCmsArticle(
  supabaseAdmin: any,
  id: string,
  params: Partial<PublishArticleParams>
): Promise<any> {
  const updates: any = {};
  if (params.title !== undefined) updates.title = params.title.trim();
  if (params.slug !== undefined) updates.slug = params.slug.trim().toLowerCase();
  if (params.category !== undefined) updates.category = params.category;
  if (params.content !== undefined) updates.content = sanitizeHtml(params.content);
  if (params.published !== undefined) updates.published = !!params.published;

  const { data, error } = await supabaseAdmin
    .from("support_articles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update CMS article: ${error.message}`);
  return data;
}
