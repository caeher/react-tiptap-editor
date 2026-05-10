import type { Editor } from '@tiptap/core';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useEditorConfig, uploadImage } from './EditorConfig';

type EditorImageUploadProps = {
  editor: Editor;
};

export function EditorImageUpload({ editor }: EditorImageUploadProps) {
  const { image: config } = useEditorConfig();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    await uploadImage(file, config, editor);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        aria-label="Upload image"
        disabled={disabled}
        onClick={handleClick}
        onMouseDown={(e) => e.preventDefault()}
        className={`rounded-lg p-2 transition ${
          disabled
            ? 'cursor-not-allowed text-slate-400 dark:text-slate-600'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
        }`}
      >
        {uploading ? <Loader2 size={18} className="animate-spin text-cyan-500 dark:text-cyan-400" /> : <ImageIcon size={18} />}
      </button>
    </>
  );
}
