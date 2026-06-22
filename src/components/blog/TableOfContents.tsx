"use client";

import { useEffect, useState } from "react";

interface TocItem {
  text: string;
  id: string;
  level: number;
}

interface TableOfContentsProps {
  markdown: string;
}

export default function TableOfContents({ markdown }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    const lines = markdown.split("\n");
    const parsedHeadings: TocItem[] = [];

    for (const line of lines) {
      if (line.startsWith("## ")) {
        const text = line.replace("## ", "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        parsedHeadings.push({ text, id, level: 2 });
      } else if (line.startsWith("### ")) {
        const text = line.replace("### ", "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        parsedHeadings.push({ text, id, level: 3 });
      }
    }

    setHeadings(parsedHeadings);
  }, [markdown]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-inner">
      <h3 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider mb-3.5 pb-2 border-b border-slate-150">
        In This Article
      </h3>
      <ul className="space-y-2 text-xs font-medium">
        {headings.map((heading, i) => (
          <li
            key={i}
            className={`transition-all ${
              heading.level === 3 
                ? "pl-4 text-slate-500 hover:text-blue-800" 
                : "text-slate-700 hover:text-blue-800"
            }`}
          >
            <a 
              href={`#${heading.id}`} 
              className="hover:underline flex items-center gap-1.5 leading-snug"
            >
              {heading.level === 2 && (
                <span className="w-1 h-1 rounded-full bg-blue-600 shrink-0" />
              )}
              <span>{heading.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
