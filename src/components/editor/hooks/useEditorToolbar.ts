/** Toolbar helpers & grouping metadata for the rich-text editor (mirrors Nuxt template intent). */

export const HEADING_LEVELS = [1, 2, 3, 4] as const;

export type ToolbarMark =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code';

export function markLabel(mark: ToolbarMark): string {
  switch (mark) {
    case 'bold':
      return 'Bold';
    case 'italic':
      return 'Italic';
    case 'underline':
      return 'Underline';
    case 'strike':
      return 'Strikethrough';
    case 'code':
      return 'Code';
    default:
      return mark;
  }
}
