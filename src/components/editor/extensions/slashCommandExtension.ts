import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import type { Range } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import { Suggestion, type SuggestionProps, type SuggestionKeyDownProps } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import { SlashCommandMenu, type SlashCommandMenuRef } from '../SlashCommandMenu';
import type { SlashItem } from '../hooks/useEditorSlashCommand';
import { getSlashItems } from '../hooks/useEditorSlashCommand';
import type { EditorConfig } from '../EditorConfig';

export const slashPluginKey = new PluginKey('slashCommand');

function positionSlashMenu(renderer: ReactRenderer, clientRect: (() => DOMRect | null) | null | undefined) {
  const rect = clientRect?.();
  if (!rect) return;
  const el = renderer.element;
  el.style.position = 'fixed';
  el.style.zIndex = '10000';
  el.style.left = `${Math.max(8, rect.left)}px`;
  el.style.top = `${Math.min(window.innerHeight - 8, rect.bottom + 8)}px`;
}

export function createSlashCommandExtension(config?: EditorConfig) {
  const getItems = () => getSlashItems(config);

  return Extension.create({
    name: 'slashCommand',

    addOptions() {
      return {
        suggestion: {
          char: '/',
          pluginKey: slashPluginKey,
          startOfLine: false,
          allowSpaces: true,
          command: ({
            editor,
            range,
            props,
          }: {
            editor: Editor;
            range: Range;
            props: SlashItem;
          }) => {
            props.command({ editor, range });
          },
          items: ({ query }: { query: string }) => {
            const q = query.toLowerCase();
            return getItems().filter(
              (item) =>
                item.title.toLowerCase().includes(q) ||
                item.keywords?.some((k) => k.toLowerCase().includes(q)) === true
            );
          },
          render: () => {
            let renderer: ReactRenderer | null = null;

            return {
              onStart: (props: SuggestionProps<SlashItem>) => {
                renderer = new ReactRenderer(SlashCommandMenu, {
                  editor: props.editor,
                  props: {
                    items: props.items,
                    command: (item: SlashItem) => {
                      props.command(item);
                    },
                  },
                  as: 'div',
                  className: 'slash-command-root',
                });
                document.body.appendChild(renderer.element);
                positionSlashMenu(renderer, props.clientRect);
              },

              onUpdate(props: SuggestionProps<SlashItem>) {
                renderer?.updateProps({
                  items: props.items,
                  command: (item: SlashItem) => {
                    props.command(item);
                  },
                });
                if (renderer) positionSlashMenu(renderer, props.clientRect);
              },

              onKeyDown(props: SuggestionKeyDownProps) {
                if (props.event.key === 'Escape') {
                  return false;
                }
                const ref = renderer?.ref as SlashCommandMenuRef | null;
                return ref?.onKeyDown(props.event) ?? false;
              },

              onExit() {
                renderer?.destroy();
                renderer = null;
              },
            };
          },
        },
      };
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  });
}
