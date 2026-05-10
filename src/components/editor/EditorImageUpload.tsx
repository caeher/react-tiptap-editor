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
            ? 'cursor-not-allowed text-[var(--te-text-muted)] opacity-50'
            : 'text-[var(--te-text-muted)] hover:bg-[var(--te-bg-hover)] hover:text-[var(--te-text)]'
        }`}
      >
        {uploading ? <Loader2 size={18} className="animate-spin text-[var(--te-accent)]" /> : <ImageIcon size={18} />}
      </button>
    </>
  );
}
