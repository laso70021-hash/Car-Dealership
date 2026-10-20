import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link2, Check, RefreshCw } from 'lucide-react';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://...',
  helperText,
  required = false,
  aspectRatio = 'video'
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, GIF)');
      return;
    }
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      alert('Error reading image file');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-h-36'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9] max-h-40'
      : 'aspect-video max-h-44';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-700 text-xs">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-slate-500 hover:text-[#ef172b] flex items-center gap-1 transition"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL input' : 'Or paste URL'}</span>
        </button>
      </div>

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group shadow-xs">
          <div className={`w-full ${aspectClass} overflow-hidden bg-slate-100 flex items-center justify-center`}>
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
            />
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs p-1 rounded-xl">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-white hover:text-amber-300 rounded-lg transition"
              title="Replace Image"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 text-white hover:text-red-400 rounded-lg transition"
              title="Remove Image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Check className="w-3 h-3" />
            Image Ready
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-[#ef172b] bg-red-50/50 scale-[0.99]'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-500">
            {isProcessing ? (
              <RefreshCw className="w-5 h-5 animate-spin text-[#ef172b]" />
            ) : (
              <Upload className="w-5 h-5 text-[#ef172b]" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {isProcessing ? 'Processing image...' : 'Click to upload image or drag & drop'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP, or GIF up to 5MB</p>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Optional URL Input Fallback */}
      {showUrlInput && (
        <div className="pt-1.5">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#ef172b] font-mono transition"
          />
        </div>
      )}

      {helperText && <p className="text-[10px] text-slate-400">{helperText}</p>}
    </div>
  );
};
