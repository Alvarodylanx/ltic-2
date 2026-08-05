'use client';

import { useState, useRef } from 'react';
import { Upload, Link2, X, Loader2, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ACCEPTED = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/quicktime,video/x-msvideo,video/webm,video/x-matroska';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska'];

type Tab = 'upload' | 'url';

const isVideo = (url: string) => /\.(mp4|mov|avi|mkv|webm)(\?.*)?$/i.test(url);

interface MediaUploadProps {
  value: string;
  onChange: (url: string) => void;
  maxImageMB?: number;  // default 5
  maxVideoMB?: number;  // default 50
}

export function MediaUpload({ value, onChange, maxImageMB = 5, maxVideoMB = 50 }: MediaUploadProps) {
  const [tab, setTab] = useState<Tab>('upload');
  const [urlDraft, setUrlDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = (file: File): string | null => {
    const isImg = IMAGE_TYPES.includes(file.type);
    const isVid = VIDEO_TYPES.includes(file.type);
    if (!isImg && !isVid) {
      return `Unsupported file type "${file.type}". Use JPG, PNG, WebP, GIF, SVG, MP4, MOV, WebM or AVI.`;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (isImg && sizeMB > maxImageMB) {
      return `Image is too large (${sizeMB.toFixed(1)} MB). Maximum allowed: ${maxImageMB} MB.`;
    }
    if (isVid && sizeMB > maxVideoMB) {
      return `Video is too large (${sizeMB.toFixed(1)} MB). Maximum allowed: ${maxVideoMB} MB. Please compress it first.`;
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const error = validate(file);
    if (error) {
      toast.error(error, { duration: 6000 });
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
      }
      const { url } = await res.json();
      onChange(url);
      toast.success('File uploaded');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (files?.[0]) uploadFile(files[0]);
  };

  const applyUrl = () => {
    if (!urlDraft.trim()) return;
    onChange(urlDraft.trim());
    setUrlDraft('');
    toast.success('URL applied');
  };

  const clear = () => onChange('');

  return (
    <div className="space-y-3">
      {/* Tab switcher */}
      <div className="flex rounded-lg border overflow-hidden text-sm">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={cn(
            'flex-1 py-2 font-medium transition-colors flex items-center justify-center gap-1.5',
            tab === 'upload' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
          )}
        >
          <Upload className="h-3.5 w-3.5" /> Upload from device
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={cn(
            'flex-1 py-2 font-medium transition-colors flex items-center justify-center gap-1.5',
            tab === 'url' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
          )}
        >
          <Link2 className="h-3.5 w-3.5" /> Paste URL
        </button>
      </div>

      {tab === 'upload' ? (
        <>
          <input
            ref={fileRef}
            id="media-upload-file"
            name="media-upload-file"
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
              uploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
              dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30',
            )}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-9 w-9 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Drop your file here, or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Images: JPG, PNG, GIF, WebP, SVG &nbsp;·&nbsp; Videos: MP4, MOV, WebM, AVI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Images: max {maxImageMB} MB &nbsp;·&nbsp; Videos: max {maxVideoMB} MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <input
            id="media-url-input"
            name="media-url-input"
            type="url"
            autoComplete="off"
            value={urlDraft}
            onChange={e => setUrlDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyUrl())}
            placeholder="https://example.com/image.jpg"
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="px-4 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border bg-muted group">
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {isVideo(value) ? (
            <div className="relative">
              <video src={value} controls className="w-full max-h-52 object-contain bg-black" />
              <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                <Film className="h-3 w-3" /> Video
              </span>
            </div>
          ) : (
            <img src={value} alt="Preview" className="w-full max-h-52 object-contain" />
          )}
        </div>
      )}
    </div>
  );
}
