'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: '1/1' | '16/9' | '4/3';
  isAvatar?: boolean;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  aspectRatio = '16/9',
  isAvatar = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Hanya berkas gambar (JPG, PNG, WebP) yang diizinkan.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setErrorMsg(data.message || 'Gagal mengunggah gambar.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan jaringan saat mengunggah.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
              inputMode === 'upload'
                ? 'bg-blue-100 text-blue-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Unggah File
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
              inputMode === 'url'
                ? 'bg-blue-100 text-blue-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tautan / URL
          </button>
        </div>
      </div>

      {/* Preview Gambar Jika Ada */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group max-w-md">
          <OptimizedImage
            src={value}
            alt="Pratinjau Unggahan"
            aspectRatio={aspectRatio}
            isAvatar={isAvatar}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Gambar</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-xs"
            >
              <span>Ganti Foto</span>
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] flex items-center gap-1 backdrop-blur-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Tersimpan &amp; Dioptimalkan via Cloudinary</span>
          </div>
        </div>
      ) : (
        <>
          {inputMode === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                ) : (
                  <UploadCloud className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-700">
                {isUploading
                  ? 'Mengunggah gambar ke Cloudinary...'
                  : 'Klik atau Tarik File Gambar ke Sini'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Mendukung format JPG, PNG, WebP beresolusi tinggi (HD)
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://drive.google.com/... atau URL gambar"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-xs"
              >
                Terapkan
              </button>
            </div>
          )}
        </>
      )}

      {errorMsg && (
        <p className="text-xs font-medium text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}
