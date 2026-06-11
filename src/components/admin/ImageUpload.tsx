'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, ImageOff } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null, previewUrl: string | null) => void;
  error?: string;
}

const ACCEPTED_FORMATS = ['image/jpeg', 'image/png'];
const MAX_SIZE_MB = 5;

export default function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [dragActive, setDragActive] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setFormatError(null);

      if (!ACCEPTED_FORMATS.includes(file.type)) {
        setFormatError('Formato não permitido. Use JPG ou PNG.');
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setFormatError(`A imagem deve ter no máximo ${MAX_SIZE_MB}MB.`);
        return;
      }

      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file, url);
    },
    [onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setPreview(null);
    setFormatError(null);
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = '';
  }

  const displayError = formatError ?? error;

  return (
    <div>
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-brand-primary/10">
          <img
            src={preview}
            alt="Preview do prato"
            className="aspect-video w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-lg bg-black/50 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Remover imagem"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-all ${
            dragActive
              ? 'border-brand-secondary bg-brand-secondary/5'
              : displayError
                ? 'border-red-300 bg-red-50/30'
                : 'border-brand-primary/15 bg-brand-primary/[0.02] hover:border-brand-secondary/40 hover:bg-brand-secondary/[0.02]'
          }`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${dragActive ? 'bg-brand-secondary/10' : 'bg-brand-primary/5'}`}>
            <Upload className={`h-6 w-6 ${dragActive ? 'text-brand-secondary' : 'text-brand-primary/30'}`} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-brand-primary/60">
              Clique ou arraste a imagem
            </p>
            <p className="mt-0.5 text-xs text-brand-primary/40">
              para fazer o upload (JPG/PNG)
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleInputChange}
        className="hidden"
      />

      {displayError && (
        <p className="mt-1.5 text-xs text-red-500">{displayError}</p>
      )}
    </div>
  );
}
