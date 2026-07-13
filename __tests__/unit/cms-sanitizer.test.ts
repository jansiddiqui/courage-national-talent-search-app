/**
 * Phase 12 Integration & Security Tests
 * V3.3 Required Test Matrix
 *
 * CmsGovernanceService — allowlist sanitizer
 */

import { sanitizeHtml } from "../../src/domains/admin/CmsGovernanceService";

describe("CmsGovernanceService.sanitizeHtml — allowlist sanitizer", () => {
  // Allowed content passes through
  test("passes through allowed tags and attributes", () => {
    const input = '<p class="intro"><strong>Hello</strong> <em>world</em></p>';
    const result = sanitizeHtml(input);
    expect(result).toContain("<p");
    expect(result).toContain("<strong>");
    expect(result).toContain("<em>");
  });

  // Disallowed tags are stripped
  test("strips <script> tags entirely", () => {
    const input = '<p>Safe</p><script>alert("XSS")</script>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script");
    expect(result).not.toContain("alert");
    expect(result).toContain("Safe");
  });

  test("strips <iframe> tags entirely", () => {
    const input = '<iframe src="https://evil.com"></iframe>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<iframe");
  });

  test("strips <style> tags entirely", () => {
    const input = '<style>body { display: none; }</style><p>text</p>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<style");
    expect(result).not.toContain("display: none");
  });

  test("strips <object> tags entirely", () => {
    const result = sanitizeHtml('<object data="file.swf"></object>');
    expect(result).not.toContain("<object");
  });

  test("strips <form> tags entirely", () => {
    const result = sanitizeHtml('<form action="http://evil.com/steal" method="post"></form>');
    expect(result).not.toContain("<form");
  });

  // Inline event handlers
  test("strips inline event handlers from allowed tags", () => {
    const result = sanitizeHtml('<p onclick="alert(1)">text</p>');
    expect(result).not.toContain("onclick");
    expect(result).toContain("text");
  });

  test("strips onload from img tag", () => {
    const result = sanitizeHtml('<img src="x.jpg" onload="steal()">');
    expect(result).not.toContain("onload");
  });

  // javascript: URI rejection
  test("sanitizes javascript: href to #", () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain("javascript:");
  });

  test("sanitizes javascript: with whitespace encoding to #", () => {
    const result = sanitizeHtml('<a href="java\tscript:alert(1)">click</a>');
    expect(result).not.toContain("alert");
  });

  test("sanitizes data: URIs in src attribute", () => {
    const result = sanitizeHtml('<img src="data:text/html,<script>alert(1)</script>">');
    expect(result).not.toContain("data:");
  });

  // Disallowed attributes on otherwise allowed tags
  test("strips disallowed attributes from allowed tags", () => {
    const result = sanitizeHtml('<p style="color:red" data-custom="val">text</p>');
    expect(result).not.toContain("style=");
    expect(result).not.toContain("data-custom");
  });

  // Disallowed tags are stripped, content preserved where applicable
  test("strips disallowed div children but retains text nodes", () => {
    const result = sanitizeHtml('<unknown-tag>hello</unknown-tag>');
    expect(result).not.toContain("<unknown-tag");
  });

  // Passes through https links
  test("allows https:// href on anchor", () => {
    const result = sanitizeHtml('<a href="https://example.com">link</a>');
    expect(result).toContain('href="https://example.com"');
  });

  // Empty and null inputs
  test("returns empty string for empty input", () => {
    expect(sanitizeHtml("")).toBe("");
  });

  test("handles null-like input gracefully", () => {
    expect(sanitizeHtml(null as any)).toBe("");
  });
});
