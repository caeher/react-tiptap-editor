import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { SlashItem } from './hooks/useEditorSlashCommand';

export type SlashCommandMenuProps = {
  items: SlashItem[];
  command: (item: SlashItem) => void;
};

export type SlashCommandMenuRef = {
  onKeyDown: (event: KeyboardEvent) => boolean;
};

export const SlashCommandMenu = forwardRef<SlashCommandMenuRef, SlashCommandMenuProps>(
  function SlashCommandMenu({ items, command }, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(
      ref,
      () => ({
        onKeyDown: (event: KeyboardEvent) => {
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedIndex((i) => (i + items.length - 1) % Math.max(items.length, 1));
            return true;
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedIndex((i) => (i + 1) % Math.max(items.length, 1));
            return true;
          }
          if (event.key === 'Enter') {
            event.preventDefault();
            const item = items[selectedIndex];
            if (item) command(item);
            return true;
          }
          return false;
        },
      }),
      [command, items, selectedIndex]
    );

    if (!items.length) {
      return (
        <div className="max-h-72 min-w-[220px] overflow-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/98 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 shadow-2xl">
          No matches
        </div>
      );
    }

    return (
      <div className="max-h-72 min-w-[220px] overflow-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/98 py-1 shadow-2xl">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
              index === selectedIndex ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-100' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => command(item)}
          >
            <span className="font-medium">{item.title}</span>
          </button>
        ))}
      </div>
    );
  }
);
