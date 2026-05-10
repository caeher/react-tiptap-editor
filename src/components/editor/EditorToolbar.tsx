import type { Editor } from '@tiptap/core';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  SquareCode,
  Table,
  Minus,
  Undo2,
  Redo2,
  ChevronDown,
  BetweenVerticalStart,
  BetweenVerticalEnd,
  BetweenHorizontalStart,
  BetweenHorizontalEnd,
  Rows3,
  Columns3,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EditorLinkPopover } from './EditorLinkPopover';
import { useEditorConfig } from './EditorConfig';
import { EditorImagePopover } from './EditorImagePopover';
import { EditorImageUpload } from './EditorImageUpload';

type EditorToolbarProps = {
  editor: Editor | null;
  extra?: React.ReactNode;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rounded-lg p-2 transition ${
        disabled
          ? 'cursor-not-allowed text-slate-400 dark:text-slate-600'
          : active
            ? 'bg-cyan-500/20 text-cyan-600 dark:bg-cyan-500/25 dark:text-cyan-200'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor, extra }: EditorToolbarProps) {
  const config = useEditorConfig();
  const { features, image: imageConfig } = config;
  const [headingOpen, setHeadingOpen] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (headingRef.current && !headingRef.current.contains(e.target as Node)) {
        setHeadingOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!editor) {
    return (
      <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-white/10 px-2 py-2">
        <span className="text-xs text-slate-500">Loading editor…</span>
      </div>
    );
  }

  const chain = () => editor.chain().focus();

  const headingActive = [1, 2, 3, 4].find((level) => editor.isActive('heading', { level }));

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-white/10 px-2 py-2">
      <ToolbarButton title="Undo" onClick={() => chain().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 size={18} />
      </ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => chain().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 size={18} />
      </ToolbarButton>

      <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-white/10" />

      {features.headings && (
        <div className="relative" ref={headingRef}>
          <button
            type="button"
            title="Heading level"
            aria-label="Heading level"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setHeadingOpen((o) => !o)}
            className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            {headingActive ? (
              <span className="font-medium">H{headingActive}</span>
            ) : (
              <span className="font-medium">Paragraph</span>
            )}
            <ChevronDown size={14} />
          </button>
          {headingOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 py-1 shadow-xl">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  chain().setParagraph().run();
                  setHeadingOpen(false);
                }}
              >
                Paragraph
              </button>
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    chain().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
                    setHeadingOpen(false);
                  }}
                >
                  Heading {level}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {features.textFormatting && (
        <>
          <ToolbarButton
            title="Bold"
            active={editor.isActive('bold')}
            onClick={() => chain().toggleBold().run()}
          >
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive('italic')}
            onClick={() => chain().toggleItalic().run()}
          >
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            active={editor.isActive('underline')}
            onClick={() => chain().toggleUnderline().run()}
          >
            <Underline size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Strikethrough"
            active={editor.isActive('strike')}
            onClick={() => chain().toggleStrike().run()}
          >
            <Strikethrough size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Inline code"
            active={editor.isActive('code')}
            onClick={() => chain().toggleCode().run()}
          >
            <Code size={18} />
          </ToolbarButton>
        </>
      )}

      <div className="mx-1 h-6 w-px bg-white/10" />

      {features.lists && (
        <>
          <ToolbarButton
            title="Bullet list"
            active={editor.isActive('bulletList')}
            onClick={() => chain().toggleBulletList().run()}
          >
            <List size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Ordered list"
            active={editor.isActive('orderedList')}
            onClick={() => chain().toggleOrderedList().run()}
          >
            <ListOrdered size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Task list"
            active={editor.isActive('taskList')}
            onClick={() => chain().toggleTaskList().run()}
          >
            <ListTodo size={18} />
          </ToolbarButton>
        </>
      )}

      {features.blockquote && (
        <ToolbarButton
          title="Blockquote"
          active={editor.isActive('blockquote')}
          onClick={() => chain().toggleBlockquote().run()}
        >
          <Quote size={18} />
        </ToolbarButton>
      )}

      {features.codeBlock && (
        <ToolbarButton
          title="Code block"
          active={editor.isActive('codeBlock')}
          onClick={() => chain().toggleCodeBlock().run()}
        >
          <SquareCode size={18} />
        </ToolbarButton>
      )}

      <div className="mx-1 h-6 w-px bg-white/10" />

      {features.table && (
        <ToolbarButton title="Insert table" onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <Table size={18} />
        </ToolbarButton>
      )}

      {features.image && imageConfig.mode === 'url' && <EditorImagePopover editor={editor} />}
      {features.image && imageConfig.mode === 'upload' && <EditorImageUpload editor={editor} />}
      
      {features.link && <EditorLinkPopover editor={editor} />}

      {features.horizontalRule && (
        <ToolbarButton title="Horizontal rule" onClick={() => chain().setHorizontalRule().run()}>
          <Minus size={18} />
        </ToolbarButton>
      )}

      {features.table && (
        <>
          <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-white/10" />
          <ToolbarButton
            title="Add row above"
            disabled={!editor.can().addRowBefore()}
            onClick={() => chain().addRowBefore().run()}
          >
            <BetweenVerticalStart size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Add row below"
            disabled={!editor.can().addRowAfter()}
            onClick={() => chain().addRowAfter().run()}
          >
            <BetweenVerticalEnd size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Add column before"
            disabled={!editor.can().addColumnBefore()}
            onClick={() => chain().addColumnBefore().run()}
          >
            <BetweenHorizontalStart size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Add column after"
            disabled={!editor.can().addColumnAfter()}
            onClick={() => chain().addColumnAfter().run()}
          >
            <BetweenHorizontalEnd size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Delete row"
            disabled={!editor.can().deleteRow()}
            onClick={() => chain().deleteRow().run()}
          >
            <Rows3 size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Delete column"
            disabled={!editor.can().deleteColumn()}
            onClick={() => chain().deleteColumn().run()}
          >
            <Columns3 size={18} />
          </ToolbarButton>
          <ToolbarButton
            title="Delete table"
            disabled={!editor.can().deleteTable()}
            onClick={() => chain().deleteTable().run()}
          >
            <Trash2 size={18} />
          </ToolbarButton>
        </>
      )}

      {extra && (
        <>
          <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-white/10" />
          <div className="flex items-center gap-1">{extra}</div>
        </>
      )}
    </div>
  );
}
