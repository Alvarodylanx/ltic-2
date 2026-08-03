'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Package, Loader2, Search, ChevronLeft, ChevronRight, Sparkles, Images, X } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { translateText } from '@/lib/translate';
import { format } from 'date-fns';

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ProductForm({ product, categories, onSuccess }: { product?: any; categories: any[]; onSuccess: () => void }) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm({
    defaultValues: product || { featured: false, available: true },
  });
  const qc = useQueryClient();
  const { L, language } = useLanguage();
  const [translating, setTranslating] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGallery, setShowGallery] = useState(!!(product?.images?.length));
  const [galleryImages, setGalleryImages] = useState<string[]>(product?.images?.length ? product.images : ['']);

  const srcLang = language as 'en' | 'fr';
  const dstLang = language === 'en' ? 'fr' : 'en';

  const nameField = language === 'en' ? 'nameEn' : 'nameFr';
  const descField = language === 'en' ? 'descriptionEn' : 'descriptionFr';
  const watchedName = watch(nameField) || '';
  const watchedCategory = watch('categoryId');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) setValue('slug', slugify(e.target.value));
  };

  const handleGenerateAI = async () => {
    const name = watch('nameEn') || watch('nameFr') || watchedName;
    if (!name.trim()) {
      toast.error(L({ en: 'Enter a product name first', fr: 'Entrez d\'abord un nom de produit' }));
      return;
    }
    setIsGenerating(true);
    try {
      const result = await api.post<{
        descriptionEn: string;
        descriptionFr: string;
        specifications: string;
        categoryId: number;
      }>('/api/ai/generate-product', { productName: name.trim(), categories });

      if (result.descriptionEn) setValue('descriptionEn', result.descriptionEn);
      if (result.descriptionFr) setValue('descriptionFr', result.descriptionFr);
      if (result.specifications) setValue('specifications', result.specifications);
      if (result.categoryId) {
        setValue('categoryId', result.categoryId);
        setCategoryError('');
      }

      // If the current language is French, show the French description
      if (language === 'fr' && result.descriptionFr) {
        setValue('descriptionFr', result.descriptionFr);
      }

      toast.success(L({ en: 'AI generated content — review before saving', fr: 'Contenu généré par IA — vérifiez avant de sauvegarder' }));
    } catch (e: any) {
      const msg = e.message || '';
      if (msg.includes('GEMINI_API_KEY') || msg.includes('not configured')) {
        toast.error('Add your Gemini API key in Admin → Settings → AI Integration');
      } else {
        toast.error(msg || 'AI generation failed');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!data.categoryId) {
      setCategoryError(L({ en: 'Please select a category', fr: 'Veuillez sélectionner une catégorie' }));
      return;
    }
    setCategoryError('');
    setTranslating(true);
    try {
      const [translatedName, translatedDesc] = await Promise.all([
        translateText(data[nameField] || '', srcLang, dstLang),
        translateText(data[descField] || '', srcLang, dstLang),
      ]);
      if (language === 'en') {
        data.nameFr = translatedName;
        data.descriptionFr = translatedDesc;
      } else {
        data.nameEn = translatedName;
        data.descriptionEn = translatedDesc;
      }
    } finally {
      setTranslating(false);
    }
    try {
      const filledImages = showGallery ? galleryImages.filter(u => u.trim()) : [];
      const payload = { ...data, images: filledImages };
      if (product) {
        await api.patch(`/api/products/${product.id}`, payload);
        toast.success(L({ en: 'Product updated', fr: 'Produit mis à jour' }));
      } else {
        await api.post('/api/products', payload);
        toast.success(L({ en: 'Product created', fr: 'Produit créé' }));
      }
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || L({ en: 'Failed to save product', fr: 'Échec de l\'enregistrement' }));
    }
  };

  const busy = isSubmitting || translating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label>{language === 'en' ? 'Product Name (English)' : 'Nom du produit (Français)'} *</Label>
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isGenerating || !watchedName.trim()}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating
              ? <><Loader2 className="h-3 w-3 animate-spin" />{L({ en: 'Generating…', fr: 'Génération…' })}</>
              : <><Sparkles className="h-3 w-3" />{L({ en: 'Generate with AI', fr: 'Générer avec IA' })}</>}
          </button>
        </div>
        <Input
          {...register(nameField, { required: true })}
          onChange={(e) => { register(nameField).onChange(e); handleNameChange(e); }}
          className={errors[nameField] ? 'border-destructive' : ''}
        />
        {errors[nameField] && <p className="text-xs text-destructive mt-1">{L({ en: 'Name is required', fr: 'Le nom est requis' })}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'en'
            ? 'Type a name then click Generate with AI to auto-fill description, specs and category.'
            : 'Tapez un nom puis cliquez sur Générer avec IA pour remplir automatiquement.'}
        </p>
      </div>
      <div>
        <Label>Slug</Label>
        <Input {...register('slug')} className="mt-1" placeholder={watchedName ? slugify(watchedName) : 'auto-generated'} />
        <p className="text-xs text-muted-foreground mt-1">{L({ en: 'Auto-generated from name. Edit to customise.', fr: 'Généré automatiquement. Modifiez pour personnaliser.' })}</p>
      </div>
      <div>
        <Label>{L({ en: 'Category', fr: 'Catégorie' })} *</Label>
        <Select
          value={watchedCategory?.toString() || ''}
          onValueChange={(v) => { setValue('categoryId', Number(v)); setCategoryError(''); }}
        >
          <SelectTrigger className={`mt-1 ${categoryError ? 'border-destructive' : ''}`}>
            <SelectValue placeholder={L({ en: 'Select category', fr: 'Sélectionner une catégorie' })} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{L({ en: c.nameEn, fr: c.nameFr })}</SelectItem>)}
          </SelectContent>
        </Select>
        {categoryError && <p className="text-xs text-destructive mt-1">{categoryError}</p>}
      </div>
      <div>
        <Label>{L({ en: 'Image / Video', fr: 'Image / Vidéo' })}</Label>
        <div className="mt-1">
          <MediaUpload value={watch('imageUrl') || ''} onChange={v => setValue('imageUrl', v)} />
        </div>
      </div>

      {/* Product Gallery / Catalog */}
      <div className="border border-border rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => { setShowGallery(v => !v); if (!showGallery && galleryImages.every(u => !u)) setGalleryImages(['']); }}
          className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Images className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{L({ en: 'Product Gallery / Catalog', fr: 'Galerie Produit / Catalogue' })}</span>
            <span className="text-xs text-muted-foreground">
              {L({ en: '(optional — adds a photo gallery on the product page)', fr: '(optionnel — ajoute une galerie sur la fiche produit)' })}
            </span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${showGallery ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {showGallery ? L({ en: 'ON', fr: 'ON' }) : L({ en: 'OFF', fr: 'OFF' })}
          </span>
        </button>

        {showGallery && (
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              {L({ en: 'Upload multiple images to create a swipeable gallery. Customers can browse all photos on the product page.', fr: 'Téléchargez plusieurs images pour créer une galerie. Les clients peuvent parcourir toutes les photos.' })}
            </p>
            <div className="space-y-3">
              {galleryImages.map((url, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="flex-1">
                    <MediaUpload
                      value={url}
                      onChange={v => setGalleryImages(imgs => imgs.map((u, i) => i === idx ? v : u))}
                    />
                  </div>
                  {galleryImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setGalleryImages(imgs => imgs.filter((_, i) => i !== idx))}
                      className="mt-2 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                      title={L({ en: 'Remove image', fr: 'Supprimer l\'image' })}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {galleryImages.length < 10 && (
              <button
                type="button"
                onClick={() => setGalleryImages(imgs => [...imgs, ''])}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                {L({ en: 'Add another image', fr: 'Ajouter une image' })}
              </button>
            )}
          </div>
        )}
      </div>
      <div>
        <Label>{language === 'en' ? 'Description (English)' : 'Description (Français)'}</Label>
        <Textarea {...register(descField)} rows={3} className="mt-1" />
      </div>
      <div>
        <Label>{L({ en: 'Specifications', fr: 'Spécifications' })}</Label>
        <Textarea {...register('specifications')} rows={3} className="mt-1" />
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('featured')} className="w-4 h-4" />
          <span className="text-sm">{L({ en: 'Featured', fr: 'En vedette' })}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('available')} className="w-4 h-4" defaultChecked />
          <span className="text-sm">{L({ en: 'Available', fr: 'Disponible' })}</span>
        </label>
      </div>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {translating ? L({ en: 'Translating…', fr: 'Traduction…' }) : L({ en: 'Saving…', fr: 'Sauvegarde…' })}
          </span>
        ) : product ? L({ en: 'Update Product', fr: 'Mettre à jour' }) : L({ en: 'Create Product', fr: 'Créer le produit' })}
      </Button>
    </form>
  );
}

const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const qc = useQueryClient();
  const { L } = useLanguage();

  const { data: products, isLoading } = useQuery<any[]>({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/api/products?limit=200'),
  });
  const { data: categories } = useQuery<any[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/api/categories'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/products/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Product deleted'); setDeleteId(null); },
    onError: () => toast.error('Failed to delete'),
  });

  const filtered = (products || []).filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.nameEn?.toLowerCase().includes(q) || p.nameFr?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{L({ en: 'Products', fr: 'Produits' })}</h1>
          <p className="text-muted-foreground mt-1">{L({ en: 'Manage your product catalog', fr: 'Gérez votre catalogue de produits' })}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder={L({ en: 'Search…', fr: 'Rechercher…' })}
              className="pl-9 h-9 w-48 sm:w-64"
            />
          </div>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> {L({ en: 'Add Product', fr: 'Ajouter un produit' })}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                {[L({ en: 'Product', fr: 'Produit' }), L({ en: 'Category', fr: 'Catégorie' }), L({ en: 'Status', fr: 'Statut' }), L({ en: 'Added', fr: 'Ajouté' }), L({ en: 'Actions', fr: 'Actions' })].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.map((product) => (
                <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={L({ en: product.nameEn, fr: product.nameFr })} width={40} height={40} className="w-full h-full object-cover" />
                        ) : <Package className="h-5 w-5 text-muted-foreground m-auto mt-2.5" />}
                      </div>
                      <span className="font-medium text-sm">{L({ en: product.nameEn, fr: product.nameFr })}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{product.categoryName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.available ? L({ en: 'Available', fr: 'Disponible' }) : L({ en: 'Unavailable', fr: 'Indisponible' })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{format(new Date(product.createdAt), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(product); setModalOpen(true); }} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(product.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
              <span>{L({ en: `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length}`, fr: `Affichage ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)} sur ${filtered.length}` })}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2">{page + 1} / {totalPages}</span>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? L({ en: 'Edit Product', fr: 'Modifier le produit' }) : L({ en: 'Add Product', fr: 'Ajouter un produit' })}</DialogTitle>
          </DialogHeader>
          <ProductForm product={editing} categories={categories || []} onSuccess={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title={L({ en: 'Delete Product?', fr: 'Supprimer le produit ?' })}
        description={L({ en: 'This action cannot be undone.', fr: 'Cette action est irréversible.' })}
        confirmLabel={L({ en: 'Delete', fr: 'Supprimer' })}
        onConfirm={() => { if (deleteId !== null) deleteMutation.mutate(deleteId); }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
