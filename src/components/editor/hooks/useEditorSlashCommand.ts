import type { Editor, Range } from '@tiptap/core';
import type { EditorConfig, EditorFeatures } from '../EditorConfig';

export type SlashItem = {
  id: string;
  title: string;
  keywords?: string[];
  featureKey?: keyof EditorFeatures;
  /** Runs after deleting the `/query` trigger range */
  command: (opts: { editor: Editor; range: Range }) => void;
};

function deleteSlashTrigger(editor: Editor, range: Range) {
  editor.chain().focus().deleteRange(range).run();
}

export function getSlashItems(config?: EditorConfig): SlashItem[] {
  const features = config?.features;
  const imageConfig = config?.image;

  const all: SlashItem[] = [
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
      featureKey: 'headings',
      keywords: ['title', 'h1'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleHeading({ level: 1 }).run();
      },
    },
    {
      id: 'h2',
      title: 'Heading 2',
      featureKey: 'headings',
      keywords: ['subtitle', 'h2'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleHeading({ level: 2 }).run();
      },
    },
    {
      id: 'h3',
      title: 'Heading 3',
      featureKey: 'headings',
      keywords: ['h3'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleHeading({ level: 3 }).run();
      },
    },
    {
      id: 'bullet',
      title: 'Bullet list',
      featureKey: 'lists',
      keywords: ['ul', 'list'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleBulletList().run();
      },
    },
    {
      id: 'ordered',
      title: 'Numbered list',
      featureKey: 'lists',
      keywords: ['ol', 'ordered'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleOrderedList().run();
      },
    },
    {
      id: 'task',
      title: 'Task list',
      featureKey: 'lists',
      keywords: ['todo', 'checkbox'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleTaskList().run();
      },
    },
    {
      id: 'quote',
      title: 'Blockquote',
      featureKey: 'blockquote',
      keywords: ['quote'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleBlockquote().run();
      },
    },
    {
      id: 'code',
      title: 'Code block',
      featureKey: 'codeBlock',
      keywords: ['code', 'snippet'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().toggleCodeBlock().run();
      },
    },
    {
      id: 'table',
      title: 'Table',
      featureKey: 'table',
      keywords: ['grid'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      },
    },
    {
      id: 'image',
      title: 'Image',
      featureKey: 'image',
      keywords: ['photo', 'picture'],
      command: ({ editor, range }) => {
        if (imageConfig?.mode === 'upload') {
          // Trigger file picker
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = imageConfig.accept ?? 'image/*';
          input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file && imageConfig.onUpload) {
              deleteSlashTrigger(editor, range);
              try {
                const result = await imageConfig.onUpload(file);
                // Simple resolve logic here as well
                let src = result.src;
                if (!src.startsWith('http') && !src.startsWith('data:') && imageConfig.retrieveBasePath) {
                   const base = imageConfig.retrieveBasePath.replace(/\/$/, '');
                   const path = src.startsWith('/') ? src : `/${src}`;
                   src = `${base}${path}`;
                }
                editor.chain().focus().setImage({ src }).run();
              } catch (err) {
                console.error(err);
              }
            }
          };
          input.click();
        } else {
          const url = typeof window !== 'undefined' ? window.prompt('Image URL') : null;
          deleteSlashTrigger(editor, range);
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }
      },
    },
    {
      id: 'hr',
      title: 'Divider',
      featureKey: 'horizontalRule',
      keywords: ['horizontal', 'rule', 'separator'],
      command: ({ editor, range }) => {
        deleteSlashTrigger(editor, range);
        editor.chain().focus().setHorizontalRule().run();
      },
    },
  ];

  return all.filter((item) => {
    if (item.featureKey && features && features[item.featureKey] === false) {
      return false;
    }
    return true;
  });
}

export function useEditorSlashCommand(config?: EditorConfig) {
  const items = getSlashItems(config);
  return { items };
}
