import { createContext, useContext } from 'react';

/** Image handling modes */
export type ImageMode = 'url' | 'upload' | 'disabled';

/** Editor theme options */
export type EditorTheme = 'light' | 'dark' | 'system';

export interface ImageUploadResult {
  /** The final URL to embed in the editor */
  src: string;
}

export interface EditorImageConfig {
  /** How images are inserted: 'url' (popover with URL input), 'upload' (file picker), 'disabled' */
  mode: ImageMode;
  /** 
   * Required when mode is 'upload'. 
   * Called with the selected File; must return the URL to embed.
   * Supports absolute URLs ("https://cdn.example.com/img/1.png") 
   * and relative paths ("/uploads/1.png") — the consumer controls this.
   */
  onUpload?: (file: File) => Promise<ImageUploadResult>;
  /** 
   * Optional base path prepended to relative URLs returned by onUpload.
   * Example: "https://cdn.example.com" → a result { src: "/uploads/1.png" } 
   * becomes "https://cdn.example.com/uploads/1.png"
   */
  retrieveBasePath?: string;
  /** Accepted MIME types for the file picker. Default: 'image/*' */
  accept?: string;
  /** Max file size in bytes. Default: 5MB (5_242_880) */
  maxFileSize?: number;
}

export interface EditorFeatures {
  /** Enable bold, italic, underline, strike, inline code. Default: true */
  textFormatting: boolean;
  /** Enable heading levels. Default: true */
  headings: boolean;
  /** Enable bullet, ordered, and task lists. Default: true */
  lists: boolean;
  /** Enable blockquote. Default: true */
  blockquote: boolean;
  /** Enable code blocks with Shiki highlighting. Default: true */
  codeBlock: boolean;
  /** Enable table insertion and editing. Default: true */
  table: boolean;
  /** Enable image insertion. Default: true */
  image: boolean;
  /** Enable link insertion. Default: true */
  link: boolean;
  /** Enable horizontal rule. Default: true */
  horizontalRule: boolean;
  /** Enable slash command menu. Default: true */
  slashCommand: boolean;
}

export interface EditorConfig {
  features: EditorFeatures;
  image: EditorImageConfig;
  /** Theme mode. Default: 'dark' */
  theme?: EditorTheme;
  /** Custom slash command items to append to the default list */
  customSlashItems?: any[]; // Using any[] for now to avoid circular dependency, will refine if needed
}

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  features: {
    textFormatting: true,
    headings: true,
    lists: true,
    blockquote: true,
    codeBlock: true,
    table: true,
    image: true,
    link: true,
    horizontalRule: true,
    slashCommand: true,
  },
  image: {
    mode: 'url',
  },
  theme: 'dark',
};

export const EditorConfigContext = createContext<EditorConfig>(DEFAULT_EDITOR_CONFIG);

export function useEditorConfig(): EditorConfig {
  return useContext(EditorConfigContext);
}

/** Resolves an image source based on configuration */
export function resolveImageSrc(result: ImageUploadResult, config: EditorImageConfig): string {
  const { src } = result;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  if (config.retrieveBasePath) {
    const base = config.retrieveBasePath.replace(/\/$/, '');
    const path = src.startsWith('/') ? src : `/${src}`;
    return `${base}${path}`;
  }
  return src;
}

/** Handles the image upload process */
export async function uploadImage(
  file: File,
  config: EditorImageConfig,
  editor: any
): Promise<void> {
  const maxSize = config.maxFileSize ?? 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert(`File is too large. Max size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
    return;
  }

  if (!config.onUpload) {
    console.error('EditorConfig: onUpload is required for mode: "upload"');
    return;
  }

  try {
    const result = await config.onUpload(file);
    const resolvedSrc = resolveImageSrc(result, config);
    editor.chain().focus().setImage({ src: resolvedSrc }).run();
  } catch (error) {
    console.error('Failed to upload image:', error);
    alert('Failed to upload image. Please try again.');
  }
}
