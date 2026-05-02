import type { Editor as TiptapEditor } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useMemo, useRef } from 'react';
import { createEditorExtensions } from './extensions';
import './editor.css';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './EditorBubbleMenu';

function getMarkdown(editor: TiptapEditor): string {
  const storage = editor.storage as { markdown?: { getMarkdown?: () => string } };
  return storage.markdown?.getMarkdown?.() ?? '';
}

export type EditorProps = {
  /** Markdown source */
  content?: string;
  onChange?: (markdown: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
};

export function Editor({
  content = '',
  onChange,
  placeholder,
  editable = true,
  className = '',
}: EditorProps) {
  const extensions = useMemo(() => createEditorExtensions({ placeholder }), [placeholder]);

  const syncingFromParent = useRef(false);

  const editor = useEditor(
    {
      extensions,
      content,
      editable,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            'tiptap-editor-shell prose prose-invert max-w-none min-h-[280px] px-4 py-3 text-[15px] leading-relaxed text-slate-100 focus:outline-none prose-headings:text-slate-50 prose-a:text-cyan-400 prose-strong:text-slate-50',
        },
      },
      onUpdate: ({ editor: ed }) => {
        if (syncingFromParent.current) return;
        const md = getMarkdown(ed);
        onChange?.(md);
      },
    },
    [extensions]
  );

  useEffect(() => {
    if (!editor || content === undefined) return;
    const current = getMarkdown(editor);
    if (current === content) return;
    syncingFromParent.current = true;
    editor.commands.setContent(content, { emitUpdate: false });
    syncingFromParent.current = false;
  }, [content, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editable, editor]);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-inner ${className}`}
    >
      <EditorToolbar editor={editor} />
      <EditorBubbleMenu editor={editor} />
      <EditorContent editor={editor} className="tiptap-root" />
    </div>
  );
}
