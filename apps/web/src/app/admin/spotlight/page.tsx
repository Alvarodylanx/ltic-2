'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Eye, EyeOff, Tv2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText } from '@/lib/translate';

type SpotlightData = {
  label: string;
  headlineEn: string; headlineFr: string;
  bodyEn: string;     bodyFr: string;
  subBodyEn: string;  subBodyFr: string;
  bgImageUrl: string;
  mediaUrl: string;
  mediaType: string;
  cta1LabelEn: string; cta1LabelFr: string; cta1Href: string;
  cta2LabelEn: string; cta2LabelFr: string; cta2Href: string;
  isActive: boolean;
};

const DEFAULTS: SpotlightData = {
  label: 'Consumer & Industrial Goods',
  headlineEn: 'Premium Oils &\nContainer Supply.',
  headlineFr: 'Huiles Premium &\nFourniture de Contenants.',
  bodyEn: 'From premium sunflower and edible oils to a full range of industrial containers — sourced directly from certified producers, available for bulk or unit supply.',
  bodyFr: "Des huiles de tournesol et alimentaires premium à une gamme complète de contenants industriels — approvisionnés directement auprès de producteurs certifiés.",
  subBodyEn: 'Available for export, import & commercial distribution across Africa and Europe.',
  subBodyFr: "Disponible pour l'export, l'import et la distribution commerciale en Afrique et en Europe.",
  bgImageUrl: '/images/lubricants-oils.jpg',
  mediaUrl: '/videos/oils-collection.mp4',
  mediaType: 'video',
  cta1LabelEn: 'Request Supply Quote', cta1LabelFr: 'Demander un Devis', cta1Href: '/quote',
  cta2LabelEn: 'Contact Us', cta2LabelFr: 'Nous Contacter', cta2Href: '/contact',
  isActive: true,
};

export default function AdminSpotlightPage() {
  const { L, language } = useLanguage();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<SpotlightData>({
    queryKey: ['admin-spotlight'],
    queryFn: () => api.get('/api/spotlight'),
  });

  const { register, handleSubmit, watch, setValue, reset, formState: { isSubmitting } } = useForm<SpotlightData>({
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    if (data) reset({ ...DEFAULTS, ...data });
  }, [data, reset]);

  const isActive = watch('isActive');
  const mediaUrl  = watch('mediaUrl');
  const bgImageUrl = watch('bgImageUrl');

  const onSubmit = async (formData: SpotlightData) => {
    const srcLang = language as 'en' | 'fr';
    const dstLang = srcLang === 'en' ? 'fr' : 'en';

    try {
      if (srcLang === 'en') {
        const [hFr, bFr, sFr, c1Fr, c2Fr] = await Promise.all([
          translateText(formData.headlineEn, 'en', 'fr'),
          translateText(formData.bodyEn,     'en', 'fr'),
          translateText(formData.subBodyEn,  'en', 'fr'),
          translateText(formData.cta1LabelEn,'en', 'fr'),
          translateText(formData.cta2LabelEn,'en', 'fr'),
        ]);
        formData.headlineFr  = hFr;
        formData.bodyFr      = bFr;
        formData.subBodyFr   = sFr;
        formData.cta1LabelFr = c1Fr;
        formData.cta2LabelFr = c2Fr;
      } else {
        const [hEn, bEn, sEn, c1En, c2En] = await Promise.all([
          translateText(formData.headlineFr,  'fr', 'en'),
          translateText(formData.bodyFr,      'fr', 'en'),
          translateText(formData.subBodyFr,   'fr', 'en'),
          translateText(formData.cta1LabelFr, 'fr', 'en'),
          translateText(formData.cta2LabelFr, 'fr', 'en'),
        ]);
        formData.headlineEn  = hEn;
        formData.bodyEn      = bEn;
        formData.subBodyEn   = sEn;
        formData.cta1LabelEn = c1En;
        formData.cta2LabelEn = c2En;
      }
    } catch { /* non-fatal — save without translation */ }

    await api.put('/api/spotlight', formData);
    qc.invalidateQueries({ queryKey: ['admin-spotlight'] });
    toast.success('Spotlight saved successfully');
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  const lang = language as 'en' | 'fr';

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Tv2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              {L({ en: 'Homepage Spotlight', fr: 'Vitrine Page d\'Accueil' })}
            </h1>
            <p className="text-xs text-muted-foreground">
              {L({ en: 'The cinematic section directly below the hero carousel', fr: 'La section cinématique directement sous le carrousel héro' })}
            </p>
          </div>
        </div>

        {/* Active toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" className="sr-only" {...register('isActive')} />
          <div
            onClick={() => setValue('isActive', !isActive)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm font-medium flex items-center gap-1">
            {isActive
              ? <><Eye className="h-3.5 w-3.5 text-primary" /> {L({ en: 'Visible', fr: 'Visible' })}</>
              : <><EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> {L({ en: 'Hidden', fr: 'Caché' })}</>
            }
          </span>
        </label>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ── Section Label ── */}
        <section className="space-y-4 p-5 rounded-2xl border bg-card">
          <h2 className="font-semibold text-sm text-foreground/80 uppercase tracking-wider">
            {L({ en: 'Section Label', fr: 'Étiquette de Section' })}
          </h2>
          <div>
            <Label>{L({ en: 'Category Label', fr: 'Étiquette Catégorie' })}</Label>
            <Input {...register('label')} className="mt-1" placeholder="e.g. Consumer & Industrial Goods" />
            <p className="text-xs text-muted-foreground mt-1">{L({ en: 'Shown above the headline in small caps', fr: 'Affiché au-dessus du titre en petites majuscules' })}</p>
          </div>
        </section>

        {/* ── Headline & Body ── */}
        <section className="space-y-4 p-5 rounded-2xl border bg-card">
          <h2 className="font-semibold text-sm text-foreground/80 uppercase tracking-wider">
            {L({ en: 'Text Content', fr: 'Contenu Texte' })}
          </h2>
          <p className="text-xs text-muted-foreground -mt-2">
            {lang === 'en'
              ? 'Write in English — French will be auto-translated on save.'
              : 'Écrivez en français — l\'anglais sera traduit automatiquement.'}
          </p>

          <div>
            <Label>{L({ en: 'Headline', fr: 'Titre Principal' })} *</Label>
            <Textarea
              {...register(lang === 'en' ? 'headlineEn' : 'headlineFr', { required: true })}
              rows={2} className="mt-1 font-display font-bold text-lg"
              placeholder={L({ en: 'Premium Oils &\nContainer Supply.', fr: 'Huiles Premium &\nFourniture de Contenants.' })}
            />
            <p className="text-xs text-muted-foreground mt-1">{L({ en: 'Use \\n for line breaks in the headline', fr: 'Utilisez \\n pour les sauts de ligne' })}</p>
          </div>

          <div>
            <Label>{L({ en: 'Body Text', fr: 'Texte Principal' })}</Label>
            <Textarea
              {...register(lang === 'en' ? 'bodyEn' : 'bodyFr')}
              rows={3} className="mt-1"
              placeholder={L({ en: 'Main description paragraph…', fr: 'Paragraphe de description principale…' })}
            />
          </div>

          <div>
            <Label>{L({ en: 'Sub-text', fr: 'Sous-texte' })}</Label>
            <Input
              {...register(lang === 'en' ? 'subBodyEn' : 'subBodyFr')}
              className="mt-1"
              placeholder={L({ en: 'e.g. Available for export across Africa and Europe.', fr: 'ex. Disponible pour l\'export en Afrique et en Europe.' })}
            />
          </div>
        </section>

        {/* ── CTA Buttons ── */}
        <section className="space-y-4 p-5 rounded-2xl border bg-card">
          <h2 className="font-semibold text-sm text-foreground/80 uppercase tracking-wider">
            {L({ en: 'Call-to-Action Buttons', fr: 'Boutons d\'Action' })}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 p-3 rounded-xl bg-muted/40">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{L({ en: 'Primary Button', fr: 'Bouton Principal' })}</p>
              <div>
                <Label className="text-xs">{L({ en: 'Label', fr: 'Libellé' })}</Label>
                <Input {...register(lang === 'en' ? 'cta1LabelEn' : 'cta1LabelFr')} className="mt-1 h-8 text-sm" placeholder="Request Supply Quote" />
              </div>
              <div>
                <Label className="text-xs">{L({ en: 'Link (href)', fr: 'Lien (href)' })}</Label>
                <Input {...register('cta1Href')} className="mt-1 h-8 text-sm" placeholder="/quote" />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-muted/40">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{L({ en: 'Secondary Button', fr: 'Bouton Secondaire' })}</p>
              <div>
                <Label className="text-xs">{L({ en: 'Label', fr: 'Libellé' })}</Label>
                <Input {...register(lang === 'en' ? 'cta2LabelEn' : 'cta2LabelFr')} className="mt-1 h-8 text-sm" placeholder="Contact Us" />
              </div>
              <div>
                <Label className="text-xs">{L({ en: 'Link (href)', fr: 'Lien (href)' })}</Label>
                <Input {...register('cta2Href')} className="mt-1 h-8 text-sm" placeholder="/contact" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Background Image ── */}
        <section className="space-y-4 p-5 rounded-2xl border bg-card">
          <div>
            <h2 className="font-semibold text-sm text-foreground/80 uppercase tracking-wider">
              {L({ en: 'Background Image', fr: 'Image de Fond' })}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {L({ en: 'Dark atmospheric image shown behind the entire section.', fr: 'Image atmosphérique sombre affichée derrière toute la section.' })}
              {' '}{L({ en: 'Max 5 MB.', fr: 'Max 5 Mo.' })}
            </p>
          </div>
          <MediaUpload
            value={bgImageUrl}
            onChange={v => setValue('bgImageUrl', v)}
            maxImageMB={5}
            maxVideoMB={50}
          />
        </section>

        {/* ── Product Media ── */}
        <section className="space-y-4 p-5 rounded-2xl border bg-card">
          <div>
            <h2 className="font-semibold text-sm text-foreground/80 uppercase tracking-wider">
              {L({ en: 'Product Media (Right Panel)', fr: 'Média Produit (Panneau Droit)' })}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {L({ en: 'Video or image shown in the phone-style frame on the right.', fr: 'Vidéo ou image affichée dans le cadre style téléphone à droite.' })}
              {' '}{L({ en: 'Images: max 5 MB · Videos: max 50 MB.', fr: 'Images: max 5 Mo · Vidéos: max 50 Mo.' })}
            </p>
          </div>
          <MediaUpload
            value={mediaUrl}
            onChange={v => {
              setValue('mediaUrl', v);
              const isVid = /\.(mp4|mov|avi|mkv|webm)(\?.*)?$/i.test(v);
              setValue('mediaType', isVid ? 'video' : 'image');
            }}
            maxImageMB={5}
            maxVideoMB={50}
          />
        </section>

        {/* Save */}
        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full font-semibold">
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{L({ en: 'Saving…', fr: 'Sauvegarde…' })}</>
            : <><Save className="h-4 w-4 mr-2" />{L({ en: 'Save Spotlight', fr: 'Enregistrer la Vitrine' })}</>
          }
        </Button>
      </form>
    </div>
  );
}
