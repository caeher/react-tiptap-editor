import type { Editor } from '@tiptap/core';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useEditorConfig, type EditorImageConfig, type ImageUploadResult } from './EditorConfig';

type EditorImageUploadProps = {
  editor: Editor;
};

function resolveImageSrc(result: ImageUploadResult, config: EditorImageConfig): string {
  const { src } = result;
  // If src is already absolute, return as-is
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  // If retrieveBasePath is set, prepend it
  if (config.retrieveBasePath) {
    const base = config.retrieveBasePath.replace(/\/$/, '');
    const path = src.startsWith('/') ? src : `/${src}`;
    return `${base}${path}`;
  }
  return src;
}

export function EditorImageUpload({ editor }: EditorImageUploadProps) {
  const { image: config } = useEditorConfig();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSize = config.maxFileSize ?? 5 * 1024 * 1024; // 5MB default
    if (file.size > maxSize) {
      alert(`File is too large. Max size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
      return;
    }

    if (!config.onUpload) {
      console.error('EditorConfig: onUpload is required for mode: "upload"');
      return;
    }

    setUploading(true);
    try {
      const result = await config.onUpload(file);
      const resolvedSrc = resolveImageSrc(result, config);
      editor.chain().focus().setImage({ src: resolvedSrc }).run();
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!editor.isEditable || uploading) return;
    fileInputRef.current?.click();
  };

  const disabled = !editor.isEditable || uploading;

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={config.accept ?? 'image/*'}
        className="hidden"
      />
      <button
        type="button"
        title="Upload image"
        disabled={disabled}
        onClick={handleClick}
        onMouseDown={(e) => e.preventDefault()}
        className={`rounded-lg p-2 transition ${
          disabled
            ? 'cursor-not-allowed text-slate-600'
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        {uploading ? <Loader2 size={18} className="animate-spin text-cyan-400" /> : <ImageIcon size={18} />}
      </button>
    </>
  );
}
