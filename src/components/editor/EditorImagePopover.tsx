import type { Editor } from '@tiptap/core';
import { Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { Popover } from '../ui/Popover';

type EditorImagePopoverProps = {
  editor: Editor;
};

export function EditorImagePopover({ editor }: EditorImagePopoverProps) {
  const [url, setUrl] = useState('');

  const insertImage = (close: () => void) => {
    if (!url.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
    setUrl('');
    close();
  };

  const disabled = !editor.isEditable;

  return (
    <Popover
      disabled={disabled}
      matchTriggerWidth={false}
      trigger={
        <span 
          title="Insert image"
          aria-label="Insert image"
          className={`flex rounded-lg p-2 transition ${
            disabled
              ? 'cursor-not-allowed text-[var(--te-text-muted)] opacity-50'
              : 'text-[var(--te-text-muted)] hover:bg-[var(--te-bg-hover)] hover:text-[var(--te-text)]'
          }`}
        >
          <ImageIcon size={18} />
        </span>
      }
      content={(close) => (
        <div className="flex min-w-[280px] flex-col gap-2 p-3">
          <label className="text-xs font-medium text-[var(--te-text-muted)]" htmlFor="editor-image-url">
            Image URL
          </label>
          <input
            id="editor-image-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                insertImage(close);
              }
            }}
            placeholder="https://example.com/image.png"
            autoFocus
            className="rounded-lg border border-[var(--te-border-muted)] bg-[var(--te-bg-hover)] px-3 py-2 text-sm text-[var(--te-text)] placeholder:text-[var(--te-text-muted)] focus:border-[var(--te-accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--te-accent)]/30"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              className="rounded-lg bg-[var(--te-accent)] px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertImage(close)}
            >
              Insert Image
            </button>
          </div>
        </div>
      )}
    />
  );
}
