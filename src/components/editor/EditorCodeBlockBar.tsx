import type { Editor } from '@tiptap/core';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, Palette, Code2 } from 'lucide-react';

type EditorCodeBlockBarProps = {
  editor: Editor | null;
};

const LANGUAGES = [
  { value: '', label: 'Plain text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'dart', label: 'Dart' },
  { value: 'sql', label: 'SQL' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'yaml', label: 'YAML' },
  { value: 'toml', label: 'TOML' },
  { value: 'xml', label: 'XML' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'lua', label: 'Lua' },
  { value: 'r', label: 'R' },
  { value: 'scala', label: 'Scala' },
  { value: 'elixir', label: 'Elixir' },
  { value: 'haskell', label: 'Haskell' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'astro', label: 'Astro' },
  { value: 'prisma', label: 'Prisma' },
];

const THEMES = [
  { value: 'material-theme-darker', label: 'Material Darker' },
  { value: 'material-theme-palenight', label: 'Material Palenight' },
  { value: 'material-theme-ocean', label: 'Material Ocean' },
  { value: 'material-theme-lighter', label: 'Material Lighter' },
  { value: 'material-theme', label: 'Material' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'dracula-soft', label: 'Dracula Soft' },
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'github-dark-dimmed', label: 'GitHub Dark Dimmed' },
  { value: 'github-light', label: 'GitHub Light' },
  { value: 'nord', label: 'Nord' },
  { value: 'night-owl', label: 'Night Owl' },
  { value: 'tokyo-night', label: 'Tokyo Night' },
  { value: 'catppuccin-mocha', label: 'Catppuccin Mocha' },
  { value: 'catppuccin-macchiato', label: 'Catppuccin Macchiato' },
  { value: 'catppuccin-frappe', label: 'Catppuccin Frappé' },
  { value: 'catppuccin-latte', label: 'Catppuccin Latte' },
  { value: 'rose-pine', label: 'Rosé Pine' },
  { value: 'rose-pine-moon', label: 'Rosé Pine Moon' },
  { value: 'rose-pine-dawn', label: 'Rosé Pine Dawn' },
  { value: 'ayu-dark', label: 'Ayu Dark' },
  { value: 'min-dark', label: 'Min Dark' },
  { value: 'min-light', label: 'Min Light' },
  { value: 'one-dark-pro', label: 'One Dark Pro' },
  { value: 'vitesse-dark', label: 'Vitesse Dark' },
  { value: 'vitesse-light', label: 'Vitesse Light' },
  { value: 'slack-dark', label: 'Slack Dark' },
  { value: 'poimandres', label: 'Poimandres' },
  { value: 'andromeeda', label: 'Andromeeda' },
  { value: 'aurora-x', label: 'Aurora X' },
  { value: 'synthwave-84', label: 'Synthwave 84' },
  { value: 'houston', label: 'Houston' },
  { value: 'kanagawa-wave', label: 'Kanagawa Wave' },
  { value: 'kanagawa-dragon', label: 'Kanagawa Dragon' },
  { value: 'everforest-dark', label: 'Everforest Dark' },
  { value: 'gruvbox-dark-hard', label: 'Gruvbox Dark' },
];

function DropdownSelect({
  icon,
  label,
  value,
  options,
  onChange,
  searchable = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (open && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open, searchable]);

  const displayLabel =
    options.find((o) => o.value === value)?.label ?? label;

  const filtered = searchable && search
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        title={label}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setOpen((o) => !o);
          setSearch('');
        }}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition
          ${open
            ? 'bg-cyan-500/20 text-cyan-200'
            : 'text-slate-400 hover:bg-white/10 hover:text-slate-200'
          }`}
      >
        {icon}
        <span className="max-w-[120px] truncate">{displayLabel}</span>
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] max-h-[280px] overflow-hidden rounded-xl border border-white/10 bg-slate-900/98 shadow-2xl backdrop-blur-md flex flex-col">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <Search size={14} className="text-slate-500 shrink-0" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 outline-none"
              />
            </div>
          )}
          <div className="overflow-y-auto py-1 custom-scroll">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-500">No matches</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition
                    ${opt.value === value
                      ? 'bg-cyan-500/15 text-cyan-200'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                    }`}
                >
                  {opt.value === value && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                  )}
                  <span className={opt.value === value ? '' : 'pl-[14px]'}>
                    {opt.label}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function EditorCodeBlockBar({ editor }: EditorCodeBlockBarProps) {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!editor) return;
    editor.on('selectionUpdate', forceUpdate);
    editor.on('update', forceUpdate);
    return () => {
      editor.off('selectionUpdate', forceUpdate);
      editor.off('update', forceUpdate);
    };
  }, [editor, forceUpdate]);

  if (!editor) return null;

  const isCodeBlock = editor.isActive('codeBlock');
  if (!isCodeBlock) return null;

  const attrs = editor.getAttributes('codeBlock');
  const currentLanguage = (attrs.language as string) || '';
  const currentTheme = (attrs.theme as string) || 'material-theme-darker';

  const handleLanguageChange = (lang: string) => {
    editor
      .chain()
      .focus()
      .updateAttributes('codeBlock', { language: lang || null })
      .run();
  };

  const handleThemeChange = (theme: string) => {
    editor.chain().focus().updateAttributes('codeBlock', { theme }).run();
  };

  return (
    <div className="flex items-center gap-1 border-b border-white/10 bg-slate-900/60 px-2 py-1.5">
      <div className="flex items-center gap-0.5 rounded-lg bg-white/5 px-1">
        <DropdownSelect
          icon={<Code2 size={14} />}
          label="Language"
          value={currentLanguage}
          options={LANGUAGES}
          onChange={handleLanguageChange}
          searchable
        />
      </div>

      <div className="mx-1 h-4 w-px bg-white/10" />

      <div className="flex items-center gap-0.5 rounded-lg bg-white/5 px-1">
        <DropdownSelect
          icon={<Palette size={14} />}
          label="Theme"
          value={currentTheme}
          options={THEMES}
          onChange={handleThemeChange}
        />
      </div>

      <div className="ml-auto text-[10px] font-medium text-slate-600 tracking-wider uppercase select-none">
        Code Block
      </div>
    </div>
  );
}
