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

export type CreateEditorExtensionsOptions = {
  placeholder?: string;
  /** Omit slash menu by passing false */
  slashCommand?: boolean;
};

export function createEditorExtensions(options: CreateEditorExtensionsOptions = {}) {
  const { placeholder = 'Write something…', slashCommand = true } = options;

  const slash = slashCommand ? createSlashCommandExtension() : null;

  return [
    StarterKit.configure({
      codeBlock: false,
      heading: {
        levels: [1, 2, 3, 4],
      },
      link: {
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-cyan-400 underline underline-offset-2 hover:text-cyan-300',
        },
      },
    }),
    CodeBlockShiki.configure({
      defaultTheme: 'material-theme-darker',
      themes: {
        light: 'material-theme-lighter',
        dark: 'material-theme-palenight',
      },
    }),
    TableKit.configure({
      table: {
        resizable: true,
      },
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'my-4 max-h-[480px] max-w-full rounded-lg object-contain',
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
    Typography,
    Markdown.configure({
      html: false,
      transformPastedText: true,
      tightLists: true,
    }),
    ...(slash ? [slash as Extension] : []),
  ];
}

export { createSlashCommandExtension, slashPluginKey } from './slashCommandExtension';
