"use client";

import { useEffect } from "react";

interface BlogPostViewsTrackerProps {
  slug: string;
}

export function BlogPostViewsTracker({ slug }: BlogPostViewsTrackerProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Send a custom page_view or view_blog_post event to GA4
        if ((window as any).gtag) {
          (window as any).gtag("event", "view_blog_post", {
            post_slug: slug,
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
          });
        }
      } catch (err) {
        console.error("Failed to track blog view event", err);
      }
    }
  }, [slug]);

  return null;
}
