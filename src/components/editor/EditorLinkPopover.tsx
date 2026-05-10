import type { Editor } from '@tiptap/core';
import { ExternalLink, Link as LinkIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Popover } from '../ui/Popover';

type EditorLinkPopoverProps = {
  editor: Editor;
};

export function EditorLinkPopover({ editor }: EditorLinkPopoverProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const sync = () => {
      const href = editor.getAttributes('link').href as string | undefined;
      setUrl(href ?? '');
    };
    sync();
    editor.on('selectionUpdate', sync);
    return () => {
      editor.off('selectionUpdate', sync);
    };
  }, [editor]);

  const disabled = !editor.isEditable;

  const applyLink = (close: () => void) => {
    if (!url.trim()) return;
    const { selection } = editor.state;
    const isEmpty = selection.empty;
    const hasCode = editor.isActive('code');

    let ch = editor.chain().focus();

    if (hasCode && !isEmpty) {
      ch = ch.extendMarkRange('code').setLink({ href: url.trim() });
    } else {
      if (isEmpty) {
        ch = ch.insertContent({
          type: 'text',
          text: url.trim(),
          marks: [{ type: 'link', attrs: { href: url.trim() } }],
        });
      } else {
        if (editor.isActive('link')) {
          ch = ch.extendMarkRange('link');
        }
        ch = ch.setLink({ href: url.trim() });
      }
    }

    ch.run();
    close();
  };

  const removeLink = (close: () => void) => {
    editor.chain().focus().extendMarkRange('link').unsetLink().setMeta('preventAutolink', true).run();
    setUrl('');
    close();
  };

  const openLink = () => {
    const href = editor.getAttributes('link').href as string | undefined;
    if (href) window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <Popover
      disabled={disabled}
      matchTriggerWidth={false}
      trigger={
        <span 
          title="Link"
          aria-label="Link"
          className={`flex rounded-lg p-2 transition ${
            disabled
              ? 'cursor-not-allowed text-[var(--te-text-muted)] opacity-50'
              : editor.isActive('link')
                ? 'bg-[var(--te-accent)]/20 text-[var(--te-accent)]'
                : 'text-[var(--te-text-muted)] hover:bg-[var(--te-bg-hover)] hover:text-[var(--te-text)]'
          }`}
        >
          <LinkIcon size={18} />
        </span>
      }
      content={(close) => (
        <div className="flex min-w-[240px] flex-col gap-2 p-3">
          <label className="text-xs font-medium text-[var(--te-text-muted)]" htmlFor="editor-link-url">
            URL
          </label>
          <input
            id="editor-link-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyLink(close);
              }
            }}
            placeholder="https://"
            className="rounded-lg border border-[var(--te-border-muted)] bg-[var(--te-bg-hover)] px-3 py-2 text-sm text-[var(--te-text)] placeholder:text-[var(--te-text-muted)] focus:border-[var(--te-accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--te-accent)]/30"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              className="rounded-lg bg-[var(--te-accent)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyLink(close)}
            >
              Apply
            </button>
            <button
              type="button"
              className="rounded-lg border border-[var(--te-border-muted)] px-3 py-1.5 text-sm text-[var(--te-text-muted)] hover:bg-[var(--te-bg-hover)] hover:text-[var(--te-text)]"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => openLink()}
              disabled={!editor.isActive('link')}
            >
              <span className="inline-flex items-center gap-1">
                <ExternalLink size={14} /> Open
              </span>
            </button>
            <button
              type="button"
              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-500 dark:text-red-300 hover:bg-red-500/10"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => removeLink(close)}
              disabled={!editor.isActive('link')}
            >
              <span className="inline-flex items-center gap-1">
                <Trash2 size={14} /> Remove
              </span>
            </button>
          </div>
        </div>
      )}
    />
  );
}
