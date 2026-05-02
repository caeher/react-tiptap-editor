import type { Editor } from '@tiptap/core';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  SquareCode,
  Image as ImageIcon,
  BetweenVerticalStart,
  BetweenVerticalEnd,
  BetweenHorizontalStart,
  BetweenHorizontalEnd,
  Rows3,
  Columns3,
  Trash2,
  Download,
} from 'lucide-react';
import { EditorLinkPopover } from './EditorLinkPopover';

type EditorBubbleMenuProps = {
  editor: Editor | null;
};

function Btn({
  title,
  onClick,
  active,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rounded-lg p-2 ${
        disabled
          ? 'cursor-not-allowed text-slate-600'
          : active
            ? 'bg-cyan-500/25 text-cyan-200'
            : 'text-slate-200 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  if (!editor) return null;

  const chain = () => editor.chain().focus();

  const showBubble = (): boolean => {
    if (!editor.isEditable) return false;
    if (editor.isActive('image')) return true;
    if (!editor.state.selection.empty) return true;
    if (editor.isActive('table')) return true;
    return false;
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={() => showBubble()}
      className="flex max-w-[min(100vw-2rem,520px)] flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-slate-900/98 p-1 shadow-2xl"
    >
      {editor.isActive('image') ? (
        <>
          <Btn
            title="Open image"
            onClick={() => {
              const src = editor.getAttributes('image').src as string | undefined;
              if (src) window.open(src, '_blank', 'noopener,noreferrer');
            }}
          >
            <Download size={18} />
          </Btn>
          <Btn
            title="Delete image"
            onClick={() => {
              chain().deleteSelection().run();
            }}
          >
            <Trash2 size={18} />
          </Btn>
        </>
      ) : !editor.state.selection.empty ? (
        <>
          <Btn title="Paragraph" onClick={() => chain().setParagraph().run()}>
            <span className="px-1 text-xs font-medium">P</span>
          </Btn>
          <Btn title="Heading 1" onClick={() => chain().toggleHeading({ level: 1 }).run()}>
            <Heading1 size={18} />
          </Btn>
          <Btn title="Heading 2" onClick={() => chain().toggleHeading({ level: 2 }).run()}>
            <Heading2 size={18} />
          </Btn>
          <Btn title="Bullet list" onClick={() => chain().toggleBulletList().run()}>
            <span className="text-xs">•</span>
          </Btn>
          <Btn title="Ordered list" onClick={() => chain().toggleOrderedList().run()}>
            <span className="text-xs">1.</span>
          </Btn>
          <Btn title="Task list" onClick={() => chain().toggleTaskList().run()}>
            <span className="text-xs">☑</span>
          </Btn>
          <Btn title="Blockquote" onClick={() => chain().toggleBlockquote().run()}>
            <span className="text-xs">&ldquo;</span>
          </Btn>
          <Btn title="Code block" onClick={() => chain().toggleCodeBlock().run()}>
            <SquareCode size={18} />
          </Btn>
          <div className="mx-0.5 h-6 w-px bg-white/15" />
          <Btn title="Bold" active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()}>
            <Bold size={18} />
          </Btn>
          <Btn title="Italic" active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()}>
            <Italic size={18} />
          </Btn>
          <Btn
            title="Underline"
            active={editor.isActive('underline')}
            onClick={() => chain().toggleUnderline().run()}
          >
            <Underline size={18} />
          </Btn>
          <Btn title="Strikethrough" active={editor.isActive('strike')} onClick={() => chain().toggleStrike().run()}>
            <Strikethrough size={18} />
          </Btn>
          <Btn title="Code" active={editor.isActive('code')} onClick={() => chain().toggleCode().run()}>
            <Code size={18} />
          </Btn>
          <div className="mx-0.5 h-6 w-px bg-white/15" />
          <EditorLinkPopover editor={editor} />
          <Btn
            title="Insert image"
            onClick={() => {
              const url = window.prompt('Image URL');
              if (url) chain().setImage({ src: url }).run();
            }}
          >
            <ImageIcon size={18} />
          </Btn>
        </>
      ) : (
        <>
          <Btn
            title="Add row above"
            disabled={!editor.can().addRowBefore()}
            onClick={() => chain().addRowBefore().run()}
          >
            <BetweenVerticalStart size={18} />
          </Btn>
          <Btn
            title="Add row below"
            disabled={!editor.can().addRowAfter()}
            onClick={() => chain().addRowAfter().run()}
          >
            <BetweenVerticalEnd size={18} />
          </Btn>
          <Btn
            title="Add column before"
            disabled={!editor.can().addColumnBefore()}
            onClick={() => chain().addColumnBefore().run()}
          >
            <BetweenHorizontalStart size={18} />
          </Btn>
          <Btn
            title="Add column after"
            disabled={!editor.can().addColumnAfter()}
            onClick={() => chain().addColumnAfter().run()}
          >
            <BetweenHorizontalEnd size={18} />
          </Btn>
          <Btn title="Delete row" disabled={!editor.can().deleteRow()} onClick={() => chain().deleteRow().run()}>
            <Rows3 size={18} />
          </Btn>
          <Btn
            title="Delete column"
            disabled={!editor.can().deleteColumn()}
            onClick={() => chain().deleteColumn().run()}
          >
            <Columns3 size={18} />
          </Btn>
          <Btn
            title="Delete table"
            disabled={!editor.can().deleteTable()}
            onClick={() => chain().deleteTable().run()}
          >
            <Trash2 size={18} />
          </Btn>
        </>
      )}
    </BubbleMenu>
  );
}
