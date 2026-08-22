"use client";

import * as React from "react";

interface MarkdownMessageProps {
  text: string;
  className?: string;
}

// Color mapping for time slots / cost highlights
const COST_REGEX = /(\$[\d,]+(?:\.\d{2})?(?:–\$[\d,]+)?|\d+[\d,]*\s*(?:USD|₹|EUR|GBP))/g;
const EMOJI_HEADER_REGEX = /^(#{1,3})\s*([\u{1F000}-\u{1FFFF}\u2600-\u27BF\u{FE00}-\u{FEFF}\s]*\d*[️⃣]?\s*.+)$/u;

const SLOT_COLORS: Record<string, string> = {
  Morning:   "bg-amber-400",
  Afternoon: "bg-orange-400",
  Evening:   "bg-violet-500",
  Night:     "bg-indigo-600",
};

function CostPill({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] leading-none mx-0.5 border border-emerald-200 dark:border-emerald-800">
      {value}
    </span>
  );
}

function renderInline(text: string): React.ReactNode[] {
  // First handle cost highlights, then bold/italic/code
  const parts: React.ReactNode[] = [];
  const fullPattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\$[\d,]+(?:\.\d{2})?(?:–\$[\d,]+)?|\d[\d,]*\s*(?:USD|₹|EUR|GBP))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = fullPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={`b-${keyIdx++}`} className="font-bold text-zinc-900 dark:text-zinc-50">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      parts.push(
        <em key={`i-${keyIdx++}`} className="italic text-zinc-500 dark:text-zinc-400">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code key={`c-${keyIdx++}`} className="rounded px-1 py-0.5 bg-zinc-200/70 dark:bg-zinc-800 text-[11px] font-mono text-primary">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      // Cost highlight
      parts.push(<CostPill key={`cost-${keyIdx++}`} value={token} />);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length ? parts : [text];
}

interface Section {
  level: number;
  emoji: string;
  title: string;
  lines: string[];
}

function parseSections(lines: string[]): (Section | string[])[] {
  const result: (Section | string[])[] = [];
  let current: Section | null = null;
  let plainLines: string[] = [];

  const flushPlain = () => {
    if (plainLines.length) {
      result.push([...plainLines]);
      plainLines = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    // Match ## 1️⃣ Title or ### Title style
    const hMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (hMatch) {
      flushPlain();
      if (current) result.push(current);
      const levelNum = hMatch[1].length;
      const rawTitle = hMatch[2];
      // Extract leading emoji
      const emojiMatch = rawTitle.match(/^([\p{Emoji}\s\d]+?)\s*([A-Z].*)/u);
      current = {
        level: levelNum,
        emoji: emojiMatch ? emojiMatch[1].trim() : "",
        title: emojiMatch ? emojiMatch[2] : rawTitle,
        lines: [],
      };
    } else if (current) {
      current.lines.push(line);
    } else {
      plainLines.push(line);
    }
  }

  flushPlain();
  if (current) result.push(current);
  return result;
}

function renderLines(lines: string[]): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;
  let keyIdx = 0;

  const flushList = () => {
    if (!listItems.length || !listType) return;
    if (listType === "ul") {
      elements.push(
        <ul key={`ul-${keyIdx++}`} className="my-2 space-y-1 pl-4 list-none">
          {listItems}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`ol-${keyIdx++}`} className="my-2 space-y-1.5 pl-1 list-none counter-reset-none">
          {listItems}
        </ol>
      );
    }
    listItems = [];
    listType = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    if (/^---+$/.test(trimmed)) {
      flushList();
      elements.push(
        <div key={`hr-${index}`} className="my-3 h-px bg-gradient-to-r from-primary/30 via-secondary/20 to-transparent rounded-full" />
      );
      return;
    }

    // Blockquote / italic disclaimer lines like *(text)*
    if (trimmed.startsWith(">") || (trimmed.startsWith("*(") && trimmed.endsWith(")*"))) {
      flushList();
      const content = trimmed.startsWith(">") ? trimmed.slice(1).trim() : trimmed.slice(2, -2);
      elements.push(
        <p key={`bq-${index}`} className="text-[11px] italic text-zinc-400 dark:text-zinc-500 border-l-2 border-zinc-300 dark:border-zinc-700 pl-3 my-1">
          {renderInline(content)}
        </p>
      );
      return;
    }

    const ulMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (ulMatch) {
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(
        <li key={`li-${index}`} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
          <span>{renderInline(ulMatch[1])}</span>
        </li>
      );
      return;
    }

    const olMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (olMatch) {
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(
        <li key={`li-${index}`} className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <span className="shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center mt-0.5">
            {olMatch[1]}
          </span>
          <span className="flex-1">{renderInline(olMatch[2])}</span>
        </li>
      );
      return;
    }

    flushList();
    elements.push(
      <p key={`p-${index}`} className="text-xs leading-relaxed my-1 text-zinc-700 dark:text-zinc-300">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();
  return elements;
}

const SECTION_GRADIENTS = [
  "from-blue-500 to-indigo-500",
  "from-violet-500 to-purple-500",
  "from-orange-500 to-amber-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-sky-500",
  "from-fuchsia-500 to-violet-500",
];

function SectionCard({ section, index }: { section: Section; index: number }) {
  const [open, setOpen] = React.useState(true);
  const gradient = SECTION_GRADIENTS[index % SECTION_GRADIENTS.length];
  const isTop = section.level === 1;

  if (isTop) {
    return (
      <div className="my-3">
        <h1 className={`text-sm font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent tracking-tight`}>
          {section.emoji && <span className="mr-1.5 not-italic">{section.emoji}</span>}
          {section.title}
        </h1>
        <div className="mt-1.5 space-y-0.5">{renderLines(section.lines)}</div>
      </div>
    );
  }

  if (section.level === 2) {
    return (
      <div className="my-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors group"
        >
          {section.emoji ? (
            <span className={`shrink-0 h-7 w-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-sm`}>
              {section.emoji}
            </span>
          ) : (
            <span className={`shrink-0 h-1.5 w-4 rounded-full bg-gradient-to-r ${gradient}`} />
          )}
          <span className={`font-bold text-xs bg-gradient-to-r ${gradient} bg-clip-text text-transparent flex-1`}>
            {section.title}
          </span>
          <span className={`text-zinc-400 text-[10px] transition-transform ${open ? "rotate-180" : ""} ml-auto shrink-0`}>
            ▲
          </span>
        </button>
        {open && (
          <div className="px-4 pb-3 pt-1 bg-white/50 dark:bg-zinc-950/30 space-y-0.5">
            {renderLines(section.lines)}
          </div>
        )}
      </div>
    );
  }

  // h3
  return (
    <div className="my-1.5 pl-3 border-l-2 border-primary/40">
      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">{section.title}</h4>
      <div className="space-y-0.5">{renderLines(section.lines)}</div>
    </div>
  );
}

export function MarkdownMessage({ text, className = "" }: MarkdownMessageProps) {
  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalizedText.split("\n");

  // Check if message has sections (h1/h2/h3) → use rich section rendering
  const hasHeaders = lines.some((l) => /^#{1,3}\s+/.test(l.trim()));

  if (!hasHeaders) {
    // Simple rendering for short conversational messages
    return (
      <div className={`markdown-message space-y-0.5 ${className}`}>
        {renderLines(lines)}
      </div>
    );
  }

  // Rich rendering with section cards
  const parsed = parseSections(lines);

  let sectionIdx = 0;
  return (
    <div className={`markdown-message ${className}`}>
      {parsed.map((item, i) => {
        if (Array.isArray(item)) {
          const content = renderLines(item);
          if (!content.length) return null;
          return <div key={`plain-${i}`} className="space-y-0.5 mb-1">{content}</div>;
        }
        const section = item as Section;
        const idx = sectionIdx++;
        return <SectionCard key={`section-${i}`} section={section} index={idx} />;
      })}
    </div>
  );
}
