"use client";

import { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";

interface SafeHtmlProps {
  html: string;
  className?: string;
  as?: "div" | "span" | "p";
}

export function SafeHtml({ html, className, as: Tag = "div" }: SafeHtmlProps) {
  const [cleanHtml, setCleanHtml] = useState("");

  useEffect(() => {
    const sanitized = DOMPurify.sanitize(html, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    });
    setCleanHtml(sanitized);
  }, [html]);

  if (!cleanHtml) {
      return null; 
  }

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}