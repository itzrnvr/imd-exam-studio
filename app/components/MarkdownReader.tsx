"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Focus, ListTree, Search, X } from "lucide-react";

type Heading = {
  level: number;
  text: string;
  id: string;
};

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textFromNode((node as { props: { children?: ReactNode } }).props.children ?? "");
  }
  return "";
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractHeadings(content: string): Heading[] {
  return content
    .split("\n")
    .map((line) => {
      const match = /^(#{1,3})\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      const text = match[2].replace(/\*\*|`/g, "").trim();
      return { level: match[1].length, text, id: slugify(text) };
    })
    .filter((heading): heading is Heading => Boolean(heading));
}

export function MarkdownBody({ content, compact = false }: { content: string; compact?: boolean }) {
  return (
    <article className={`markdown-body ${compact ? "compact" : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 id={slugify(textFromNode(children))}>{children}</h1>,
          h2: ({ children }) => <h2 id={slugify(textFromNode(children))}>{children}</h2>,
          h3: ({ children }) => <h3 id={slugify(textFromNode(children))}>{children}</h3>,
          h4: ({ children }) => <h4 id={slugify(textFromNode(children))}>{children}</h4>,
          a: ({ children, href }) => <a href={href}>{children}</a>,
          table: ({ children }) => <div className="table-scroll"><table>{children}</table></div>,
          pre: ({ children }) => <pre className="formula-block">{children}</pre>,
          code: ({ children, className }) => <code className={className}>{children}</code>,
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

export function MarkdownReader({
  content,
  compact = false,
  label = "On this page",
}: {
  content: string;
  compact?: boolean;
  label?: string;
}) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [query, setQuery] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return headings;
    return headings.filter((heading) => heading.text.toLowerCase().includes(normalized));
  }, [headings, query]);

  useEffect(() => {
    const update = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? Math.min(100, Math.max(0, (window.scrollY / available) * 100)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`reader-shell ${focusMode ? "focus-mode" : ""}`}>
      <div className="reader-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <aside className="reader-tools" aria-label="Document navigation">
        <div className="reader-tool-heading">
          <span><ListTree size={16} aria-hidden="true" /> {label}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setFocusMode(true)}
            aria-label="Enter focus reading mode"
          >
            <Focus size={17} />
          </button>
        </div>
        <label className="search-box">
          <Search size={15} aria-hidden="true" />
          <span className="sr-only">Search headings</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a topic..."
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={14} />
            </button>
          ) : null}
        </label>
        <div className="toc-list">
          {filtered.length ? (
            filtered.map((heading, index) => (
              <button
                key={`${heading.id}-${index}`}
                type="button"
                className={`toc-level-${heading.level}`}
                onClick={() => jumpTo(heading.id)}
              >
                {heading.text}
              </button>
            ))
          ) : (
            <p>No matching heading. Try CNN, attention, GAN, or bias.</p>
          )}
        </div>
      </aside>
      <div className="reader-content">
        {focusMode ? (
          <button type="button" className="button secondary exit-focus" onClick={() => setFocusMode(false)}>
            <X size={16} aria-hidden="true" /> Exit focus mode
          </button>
        ) : null}
        <MarkdownBody content={content} compact={compact} />
      </div>
    </div>
  );
}
