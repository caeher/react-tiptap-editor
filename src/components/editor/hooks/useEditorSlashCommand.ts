import type { Editor } from '@tiptap/core';
import type { Range } from '@tiptap/core';

export type SlashItem = {
  id: string;
  title: string;
  keywords?: string[];
  /** Runs after deleting the `/query` trigger range */
  command: (opts: { editor: Editor; range: Range }) => void;
};

function deleteSlashTrigger(editor: Editor, range: Range) {
  editor.chain().focus().deleteRange(range).run();
}

export function getSlashItems(): SlashItem[] {
  return [
    {
      id: 'paragraph',
      title: 'Paragraph',
      keywords: ['text', 'p'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().setParagraph().run();
      },
    },
    {
      id: 'h1',
      title: 'Heading 1',
      keywords: ['title', 'h1'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleHeading({ level: 1 }).run();
      },
    },
    {
      id: 'h2',
      title: 'Heading 2',
      keywords: ['subtitle', 'h2'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleHeading({ level: 2 }).run();
      },
    },
    {
      id: 'h3',
      title: 'Heading 3',
      keywords: ['h3'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleHeading({ level: 3 }).run();
      },
    },
    {
      id: 'bullet',
      title: 'Bullet list',
      keywords: ['ul', 'list'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleBulletList().run();
      },
    },
    {
      id: 'ordered',
      title: 'Numbered list',
      keywords: ['ol', 'ordered'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleOrderedList().run();
      },
    },
    {
      id: 'task',
      title: 'Task list',
      keywords: ['todo', 'checkbox'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleTaskList().run();
      },
    },
    {
      id: 'quote',
      title: 'Blockquote',
      keywords: ['quote'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleBlockquote().run();
      },
    },
    {
      id: 'code',
      title: 'Code block',
      keywords: ['code', 'snippet'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleCodeBlock().run();
      },
    },
    {
      id: 'table',
      title: 'Table',
      keywords: ['grid'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      },
    },
    {
      id: 'image',
      title: 'Image',
      keywords: ['photo', 'picture'],
      command: ({ editor, range }) => {
        const url = typeof window !== 'undefined' ? window.prompt('Image URL') : null;
        deleteSlashTrigger(editor, range);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
    },
    {
      id: 'hr',
      title: 'Divider',
      keywords: ['horizontal', 'rule', 'separator'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().setHorizontalRule().run();
      },
    },
  ];
}

export function useEditorSlashCommand() {
  const items = getSlashItems();
  return { items };
}
