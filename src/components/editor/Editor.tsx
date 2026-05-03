import type { Editor as TiptapEditor } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useMemo, useRef } from 'react';
import { createEditorExtensions } from './extensions';
import './editor.css';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './EditorBubbleMenu';
import { EditorConfigContext, DEFAULT_EDITOR_CONFIG, type EditorConfig } from './EditorConfig';

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
  config?: Partial<EditorConfig>;
};

function mergeConfig(
  defaults: EditorConfig,
  overrides?: Partial<EditorConfig>
): EditorConfig {
  if (!overrides) return defaults;
  return {
    features: { ...defaults.features, ...overrides.features },
    image: { ...defaults.image, ...overrides.image },
  };
}

export function Editor({
  content = '',
  onChange,
  placeholder,
  editable = true,
  className = '',
  config: userConfig,
}: EditorProps) {
  const config = useMemo(() => mergeConfig(DEFAULT_EDITOR_CONFIG, userConfig), [userConfig]);
  const extensions = useMemo(() => createEditorExtensions({ placeholder, config }), [placeholder, config]);

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
    <EditorConfigContext.Provider value={config}>
      <div
        className={`overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-inner ${className}`}
      >
        <EditorToolbar editor={editor} />
        <EditorBubbleMenu editor={editor} />
        <EditorContent editor={editor} className="tiptap-root" />
      </div>
    </EditorConfigContext.Provider>
  );
}
