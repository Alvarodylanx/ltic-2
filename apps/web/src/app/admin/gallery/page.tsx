'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Loader2, Search, Pencil, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { translateText } from '@/lib/translate';

const SUGGESTED_CATEGORIES = [
  'Timber Operations',
  'Shipping & Logistics',
  'Partnerships',
  'Team & Office',
  'Events',
  'Products',
];

function isVideo(url: string) {
  return /\.(mp4|webm|mov|avi)$/i.test(url) || url.includes('youtube.com') || url.includes('youtu.be');
}

function GalleryForm({ item, onSuccess }: { item?: any; onSuccess: () => void }) {
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: item || { published: true, mediaType: 'image', sortOrder: 0 },
  });
  const qc = useQueryClient();
  const { L, language } = useLanguage();
  const [translating, setTranslating] = useState(false);

  const mediaUrl = watch('mediaUrl') || '';
  const titleField = language === 'en' ? 'titleEn' : 'titleFr';

  const onSubmit = async (data: any) => {
    const detectedType = isVideo(data.mediaUrl || '') ? 'video' : 'image';
    data.mediaType = detectedType;
    data.sortOrder = Number(data.sortOrder) || 0;

    const titleValue = data[titleField];
    if (titleValue) {
      setTranslating(true);
      try {
        const srcLang = language as 'en' | 'fr';
        const dstLang = language === 'en' ? 'fr' : 'en';
        const dstField = language === 'en' ? 'titleFr' : 'titleEn';
        data[dstField] = await translateText(titleValue, srcLang, dstLang);
      } finally {
        setTranslating(false);
      }
    }

    try {
      if (item) {
        await api.patch(`/api/gallery/${item.id}`, data);
        toast.success(L({ en: 'Item updated', fr: 'Élément mis à jour' }));
      } else {
        await api.post('/api/gallery', data);
        toast.success(L({ en: 'Item added', fr: 'Élément ajouté' }));
      }
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      onSuccess();
    } catch (e: any) { toast.error(e.message || 'Failed'); }
  };

  const busy = isSubmitting || translating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>{L({ en: 'Media (Image or Video)', fr: 'Média (Image ou Vidéo)' })} *</Label>
        <div className="mt-1">
          <input type="hidden" {...register('mediaUrl', { required: true })} />
          <MediaUpload value={mediaUrl} onChange={(v) => setValue('mediaUrl', v)} />
        </div>
      </div>
      <div>
        <Label>{language === 'en' ? 'Caption (English, optional)' : 'Légende (Français, optionnel)'}</Label>
        <Input {...register(titleField)} className="mt-1" placeholder={L({ en: 'Short description…', fr: 'Courte description…' })} />
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'en' ? 'French caption auto-translated on save.' : 'La légende anglaise sera traduite automatiquement.'}
        </p>
      </div>
      <div>
        <Label>{L({ en: 'Category', fr: 'Catégorie' })}</Label>
        <Input {...register('category')} list="gallery-categories" className="mt-1"
          placeholder={L({ en: 'e.g. Timber Operations', fr: 'ex. Activités Bois' })} />
        <datalist id="gallery-categories">
          {SUGGESTED_CATEGORIES.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>
      <div>
        <Label>{L({ en: 'Sort Order', fr: 'Ordre de tri' })}</Label>
        <Input type="number" {...register('sortOrder')} className="mt-1 w-28" placeholder="0" />
        <p className="text-xs text-muted-foreground mt-1">{L({ en: 'Lower numbers appear first.', fr: 'Les nombres plus petits apparaissent en premier.' })}</p>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" {...register('published')} defaultChecked={item?.published ?? true} className="w-4 h-4" />
        <span className="text-sm">{L({ en: 'Published (visible on site)', fr: 'Publié (visible sur le site)' })}</span>
      </label>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {translating ? L({ en: 'Translating…', fr: 'Traduction…' }) : L({ en: 'Saving…', fr: 'Sauvegarde…' })}
          </span>
        ) : item ? L({ en: 'Update', fr: 'Mettre à jour' }) : L({ en: 'Add to Gallery', fr: 'Ajouter à la galerie' })}
      </Button>
    </form>
  );
}

export default function AdminGalleryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const qc = useQueryClient();
  const { L } = useLanguage();

  const { data: items, isLoading } = useQuery<any[]>({
    queryKey: ['admin-gallery'],
    queryFn: () => api.get('/api/gallery/admin'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/gallery/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success(L({ en: 'Item deleted', fr: 'Élément supprimé' }));
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const filtered = (items || []).filter((i) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.titleEn?.toLowerCase().includes(q) ||
      i.titleFr?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{L({ en: 'Gallery', fr: 'Galerie' })}</h1>
          <p className="text-muted-foreground mt-1">{L({ en: 'Manage photos and videos', fr: 'Gérez les photos et vidéos' })}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={L({ en: 'Search…', fr: 'Rechercher…' })} className="pl-9 h-9 w-48 sm:w-56" />
          </div>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> {L({ en: 'Add Media', fr: 'Ajouter un média' })}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array(10).fill(0).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">
          {L({ en: 'No items yet. Add your first photo or video.', fr: 'Aucun élément. Ajoutez votre première photo ou vidéo.' })}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-muted border border-border">
              <Image
                src={
                  item.mediaType === 'video' && (item.mediaUrl.includes('youtube.com') || item.mediaUrl.includes('youtu.be'))
                    ? `https://img.youtube.com/vi/${item.mediaUrl.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/shorts\/))([^?&/\s]+)/)?.[1]}/hqdefault.jpg`
                    : item.mediaUrl
                }
                alt={item.titleEn || item.category || ''}
                fill
                className="object-cover"
                unoptimized={item.mediaType === 'video'}
              />
              {item.mediaType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-3.5 w-3.5 text-primary fill-primary ml-0.5" />
                  </div>
                </div>
              )}
              {/* Status badge */}
              {!item.published && (
                <div className="absolute top-2 left-2">
                  <span className="bg-gray-800/80 text-white text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">
                    {L({ en: 'Draft', fr: 'Brouillon' })}
                  </span>
                </div>
              )}
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => { setEditing(item); setModalOpen(true); }}
                  className="p-1.5 rounded-full bg-white/90 hover:bg-white text-foreground transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="p-1.5 rounded-full bg-white/90 hover:bg-red-500 hover:text-white text-foreground transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {/* Category tag */}
              {item.category && (
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-[10px] font-medium truncate">{item.category}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? L({ en: 'Edit Media', fr: 'Modifier le média' }) : L({ en: 'Add Media', fr: 'Ajouter un média' })}
            </DialogTitle>
          </DialogHeader>
          <GalleryForm item={editing} onSuccess={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title={L({ en: 'Delete this item?', fr: 'Supprimer cet élément ?' })}
        description={L({ en: 'This cannot be undone.', fr: 'Cette action est irréversible.' })}
        confirmLabel={L({ en: 'Delete', fr: 'Supprimer' })}
        onConfirm={() => { if (deleteId !== null) deleteMutation.mutate(deleteId); }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
