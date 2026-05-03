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
          className={`flex rounded-lg p-2 transition ${
            disabled
              ? 'cursor-not-allowed text-slate-600'
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <ImageIcon size={18} />
        </span>
      }
      content={(close) => (
        <div className="flex min-w-[280px] flex-col gap-2 p-3">
          <label className="text-xs font-medium text-slate-400" htmlFor="editor-image-url">
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
            className="rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              className="rounded-lg bg-cyan-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-cyan-500"
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
