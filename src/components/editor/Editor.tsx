import type { Editor as TiptapEditor } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useMemo, useRef } from 'react';
import { createEditorExtensions } from './extensions';
import './editor.css';
import { EditorToolbar } from './EditorToolbar';
import { EditorCodeBlockBar } from './EditorCodeBlockBar';
import { EditorBubbleMenu } from './EditorBubbleMenu';
import { EditorConfigContext, DEFAULT_EDITOR_CONFIG, type EditorConfig, uploadImage } from './EditorConfig';

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
  toolbarExtra?: React.ReactNode;
};

function mergeConfig(
  defaults: EditorConfig,
  overrides?: Partial<EditorConfig>
): EditorConfig {
  if (!overrides) return defaults;
  return {
    features: { ...defaults.features, ...overrides.features },
    image: { ...defaults.image, ...overrides.image },
    theme: overrides.theme ?? defaults.theme,
  };
}

export function Editor({
  content = '',
  onChange,
  placeholder,
  editable = true,
  className = '',
  config: userConfig,
  toolbarExtra,
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
            'tiptap-editor-shell prose max-w-none min-h-[280px] px-4 py-3 text-[15px] leading-relaxed focus:outline-none text-inherit prose-headings:text-inherit prose-a:text-inherit prose-strong:text-inherit prose-p:text-inherit',
        },
        handleDrop: (_view, event, _slice, moved) => {
          if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            if (file.type.startsWith('image/') && editor) {
              uploadImage(file, config.image, editor);
              return true;
            }
          }
          return false;
        },
        handlePaste: (_view, event) => {
          if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
            const file = event.clipboardData.files[0];
            if (file.type.startsWith('image/') && editor) {
              uploadImage(file, config.image, editor);
              return true;
            }
          }
          return false;
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
        className={`overflow-hidden rounded-2xl border border-[var(--te-border)] bg-transparent shadow-sm dark:shadow-inner ${
          config.theme === 'dark' ? 'dark' : ''
        } ${className}`}
      >
        <EditorToolbar editor={editor} extra={toolbarExtra} />
        <EditorCodeBlockBar editor={editor} />
        <EditorBubbleMenu editor={editor} />
        <EditorContent editor={editor} className="tiptap-root" />
      </div>
    </EditorConfigContext.Provider>
  );
}
