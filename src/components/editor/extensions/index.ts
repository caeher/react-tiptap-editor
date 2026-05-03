import StarterKit from '@tiptap/starter-kit';
import CodeBlockShiki from 'tiptap-extension-code-block-shiki';
import { TableKit } from '@tiptap/extension-table';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { Markdown } from 'tiptap-markdown';
import type { Extension } from '@tiptap/core';
import { createSlashCommandExtension } from './slashCommandExtension';
import type { EditorConfig } from '../EditorConfig';

export type CreateEditorExtensionsOptions = {
  placeholder?: string;
  /** Omit slash menu by passing false or via config */
  slashCommand?: boolean;
  config?: EditorConfig;
};

export function createEditorExtensions(options: CreateEditorExtensionsOptions = {}) {
  const { placeholder = 'Write something…', config } = options;
  const features = config?.features;

  const extensions: Extension[] = [];

  // StarterKit is always included but we configure sub-extensions based on features
  extensions.push(StarterKit.configure({
    codeBlock: false, // replaced by Shiki
    heading: features?.headings !== false ? {
      levels: [1, 2, 3, 4],
    } : false,
    link: features?.link !== false ? {
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-cyan-400 underline underline-offset-2 hover:text-cyan-300',
      },
    } : false,
    bold: features?.textFormatting !== false ? {} : false,
    italic: features?.textFormatting !== false ? {} : false,
    strike: features?.textFormatting !== false ? {} : false,
    code: features?.textFormatting !== false ? {} : false,
    blockquote: features?.blockquote !== false ? {} : false,
    bulletList: features?.lists !== false ? {} : false,
    orderedList: features?.lists !== false ? {} : false,
    horizontalRule: features?.horizontalRule !== false ? {} : false,
  }) as Extension);

  if (features?.codeBlock !== false) {
    extensions.push(CodeBlockShiki.configure({
      defaultTheme: 'material-theme-darker',
      themes: {
        light: 'material-theme-lighter',
        dark: 'material-theme-palenight',
      },
    }) as Extension);
  }

  if (features?.table !== false) {
    extensions.push(TableKit.configure({
      table: {
        resizable: true,
      },
    }) as Extension);
  }

  if (features?.lists !== false) {
    extensions.push(TaskList as Extension);
    extensions.push(TaskItem.configure({
      nested: true,
    }) as Extension);
  }

  if (features?.image !== false) {
    extensions.push(Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'my-4 max-h-[480px] max-w-full rounded-lg object-contain',
      },
    }) as Extension);
  }

  extensions.push(Placeholder.configure({
    placeholder,
  }) as Extension);

  extensions.push(Typography as Extension);

  extensions.push(Markdown.configure({
    html: false,
    transformPastedText: true,
    tightLists: true,
  }) as Extension);

  // Slash command
  if (features?.slashCommand !== false && options.slashCommand !== false) {
    const slash = createSlashCommandExtension(config);
    if (slash) extensions.push(slash as Extension);
  }

  return extensions;
}

export { createSlashCommandExtension, slashPluginKey } from './slashCommandExtension';
