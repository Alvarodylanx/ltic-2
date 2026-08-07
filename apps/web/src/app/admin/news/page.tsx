'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { translateText } from '@/lib/translate';
import { format } from 'date-fns';

function NewsForm({ article, onSuccess }: { article?: any; onSuccess: () => void }) {
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: article || { published: true },
  });
  const qc = useQueryClient();
  const { L, language } = useLanguage();
  const [translating, setTranslating] = useState(false);

  const srcLang = language as 'en' | 'fr';
  const dstLang = language === 'en' ? 'fr' : 'en';
  const titleField = language === 'en' ? 'titleEn' : 'titleFr';
  const summaryField = language === 'en' ? 'summaryEn' : 'summaryFr';
  const contentField = language === 'en' ? 'contentEn' : 'contentFr';

  const onSubmit = async (data: any) => {
    setTranslating(true);
    try {
      const [translatedTitle, translatedSummary, translatedContent] = await Promise.all([
        translateText(data[titleField] || '', srcLang, dstLang),
        translateText(data[summaryField] || '', srcLang, dstLang),
        translateText(data[contentField] || '', srcLang, dstLang),
      ]);
      if (language === 'en') {
        data.titleFr = translatedTitle;
        data.summaryFr = translatedSummary;
        data.contentFr = translatedContent;
      } else {
        data.titleEn = translatedTitle;
        data.summaryEn = translatedSummary;
        data.contentEn = translatedContent;
      }
    } finally {
      setTranslating(false);
    }
    try {
      if (article) {
        await api.patch(`/api/news/${article.id}`, data);
        toast.success('Article updated');
      } else {
        await api.post('/api/news', data);
        toast.success('Article created');
      }
      qc.invalidateQueries({ queryKey: ['admin-news'] });
      onSuccess();
    } catch (e: any) { toast.error(e.message || 'Failed'); }
  };

  const busy = isSubmitting || translating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>{language === 'en' ? 'Title (English)' : 'Titre (Français)'} *</Label>
        <Input {...register(titleField, { required: true })} className="mt-1" />
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'en'
            ? 'The French version will be auto-translated on save.'
            : 'La version anglaise sera traduite automatiquement à la sauvegarde.'}
        </p>
      </div>
      <div>
        <Label>Slug *</Label>
        <Input {...register('slug', { required: true })} className="mt-1" />
      </div>
      <div>
        <Label>{L({ en: 'Image / Video', fr: 'Image / Vidéo' })}</Label>
        <div className="mt-1">
          <input type="hidden" {...register('imageUrl')} />
          <MediaUpload value={watch('imageUrl') || ''} onChange={v => setValue('imageUrl', v)} />
        </div>
      </div>
      <div>
        <Label>{L({ en: 'Category', fr: 'Catégorie' })}</Label>
        <Input {...register('category')} className="mt-1" placeholder="e.g. Company News, Industry Insights" />
      </div>
      <div>
        <Label>{language === 'en' ? 'Summary (English)' : 'Résumé (Français)'}</Label>
        <Textarea {...register(summaryField)} rows={2} className="mt-1" />
      </div>
      <div>
        <Label>{language === 'en' ? 'Content (English)' : 'Contenu (Français)'}</Label>
        <Textarea {...register(contentField)} rows={5} className="mt-1" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" {...register('published')} defaultChecked={article?.published ?? true} className="w-4 h-4" />
        <span className="text-sm">{L({ en: 'Published', fr: 'Publié' })}</span>
      </label>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {translating ? L({ en: 'Translating…', fr: 'Traduction…' }) : L({ en: 'Saving…', fr: 'Sauvegarde…' })}
          </span>
        ) : article ? L({ en: 'Update Article', fr: 'Mettre à jour' }) : L({ en: 'Create Article', fr: 'Créer l\'article' })}
      </Button>
    </form>
  );
}

export default function AdminNewsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const qc = useQueryClient();
  const { L } = useLanguage();

  const { data: articles, isLoading } = useQuery<any[]>({
    queryKey: ['admin-news'],
    queryFn: () => api.get('/api/news/admin?limit=100'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/news/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-news'] }); toast.success('Article deleted'); setDeleteId(null); },
    onError: () => toast.error('Failed to delete'),
  });

  const filtered = (articles || []).filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.titleEn?.toLowerCase().includes(q) || a.titleFr?.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{L({ en: 'News Articles', fr: 'Articles de presse' })}</h1>
          <p className="text-muted-foreground mt-1">{L({ en: 'Manage news and insights', fr: 'Gérez les actualités et articles' })}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={L({ en: 'Search…', fr: 'Rechercher…' })} className="pl-9 h-9 w-48 sm:w-56" />
          </div>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> {L({ en: 'Add Article', fr: 'Ajouter un article' })}
          </Button>
        </div>
      </div>

      {isLoading ? <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div> : (
        <div className="bg-card border rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-muted/50 border-b">
              <tr>
                {[L({ en: 'Article', fr: 'Article' }), L({ en: 'Category', fr: 'Catégorie' }), L({ en: 'Published', fr: 'Publié' }), L({ en: 'Date', fr: 'Date' }), L({ en: 'Actions', fr: 'Actions' })].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((article) => (
                <tr key={article.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {article.imageUrl && (
                        <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0">
                          <Image src={article.imageUrl} alt={article.titleEn} width={48} height={32} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="font-medium text-sm line-clamp-1">{L({ en: article.titleEn, fr: article.titleFr })}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{article.category || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${article.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {article.published ? L({ en: 'Published', fr: 'Publié' }) : L({ en: 'Draft', fr: 'Brouillon' })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{format(new Date(article.publishedAt), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(article); setModalOpen(true); }} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(article.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!articles?.length && <p className="text-center text-muted-foreground py-12">{L({ en: 'No articles yet', fr: 'Aucun article' })}</p>}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? L({ en: 'Edit Article', fr: 'Modifier l\'article' }) : L({ en: 'Add Article', fr: 'Ajouter un article' })}</DialogTitle></DialogHeader>
          <NewsForm article={editing} onSuccess={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title={L({ en: 'Delete Article?', fr: 'Supprimer l\'article ?' })}
        description={L({ en: 'This action cannot be undone.', fr: 'Cette action est irréversible.' })}
        confirmLabel={L({ en: 'Delete', fr: 'Supprimer' })}
        onConfirm={() => { if (deleteId !== null) deleteMutation.mutate(deleteId); }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
