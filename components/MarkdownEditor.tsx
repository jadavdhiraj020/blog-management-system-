"use client";

import { useRef, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as Tooltip from "@radix-ui/react-tooltip";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
}

interface ToolbarAction {
  label: string;
  icon: string;
  prefix: string;
  suffix: string;
  block: boolean;
}

const toolbarActions: ToolbarAction[] = [
  { label: "Bold", icon: "B", prefix: "**", suffix: "**", block: false },
  { label: "Italic", icon: "I", prefix: "*", suffix: "*", block: false },
  { label: "Heading", icon: "H", prefix: "## ", suffix: "", block: true },
  { label: "Link", icon: "🔗", prefix: "[", suffix: "](url)", block: false },
  { label: "Bullet List", icon: "•", prefix: "- ", suffix: "", block: true },
  { label: "Code Block", icon: "</>", prefix: "```\n", suffix: "\n```", block: true },
];

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in markdown...",
  minHeight = 400,
  className = "",
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = useCallback(
    (action: ToolbarAction) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      const before = value.substring(0, start);
      const after = value.substring(end);

      let insertion: string;
      if (action.block && !selected) {
        insertion = `${action.prefix}text${action.suffix}`;
      } else {
        insertion = `${action.prefix}${selected || "text"}${action.suffix}`;
      }

      const newValue = `${before}${insertion}${after}`;
      onChange(newValue);

      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + action.prefix.length + (selected || "text").length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [value, onChange]
  );

  const wordCount = useMemo(() => {
    return value.trim().split(/\s+/).filter(Boolean).length;
  }, [value]);

  const readingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  return (
    <div className={`rounded-lg border dark:border-gray-700 ${className}`}>
      <Tooltip.Provider delayDuration={300}>
        <div className="flex gap-1 border-b bg-gray-50 p-2 dark:bg-gray-800 dark:border-gray-700">
          {toolbarActions.map((action) => (
            <Tooltip.Root key={action.label}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  onClick={() => insertMarkdown(action)}
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {action.icon}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="z-50 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-md dark:bg-gray-700"
                  sideOffset={5}
                >
                  {action.label}
                  <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </div>
      </Tooltip.Provider>

      <div className="grid grid-cols-2 divide-x dark:divide-gray-700">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-none p-4 font-mono text-sm focus:outline-none bg-white dark:bg-gray-900 dark:text-white"
          style={{ minHeight }}
        />
        <div
          className="overflow-auto p-4 prose prose-sm max-w-none dark:prose-invert bg-white dark:bg-gray-900"
          style={{ minHeight }}
        >
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400">Preview will appear here...</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-2 text-sm text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
        <span>{wordCount} words</span>
        <span>{readingTime} min read</span>
      </div>
    </div>
  );
}
