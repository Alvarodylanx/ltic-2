'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Globe2, Save, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

const statsFields = [
  { key: 'stat_countries',  label: 'Countries Served / Pays Desservis',      placeholder: '30+' },
  { key: 'stat_clients',    label: 'Clients Worldwide / Clients Mondiaux',    placeholder: '500+' },
  { key: 'stat_years',      label: 'Years of Experience / Années d\'Expérience', placeholder: '5+' },
  { key: 'stat_shipments',  label: 'Shipments Completed / Expéditions Réalisées', placeholder: '10K+' },
];

const contactFields = [
  { key: 'company_address', label: 'Address / Adresse',    placeholder: 'Douala, Cameroon / International Operations' },
  { key: 'company_phone',   label: 'Phone / Téléphone',    placeholder: '+237 6XX XXX XXX' },
  { key: 'company_email',   label: 'Email',                placeholder: 'contact@lticsarl.com' },
  { key: 'company_website', label: 'Website / Site web',   placeholder: 'www.lticsarl.com' },
];

const socialFields = [
  { key: 'social_facebook',  label: 'Facebook',           placeholder: 'https://facebook.com/lticsarl',         color: 'text-blue-600' },
  { key: 'social_twitter',   label: 'X / Twitter',        placeholder: 'https://twitter.com/lticsarl',          color: 'text-sky-500' },
  { key: 'social_linkedin',  label: 'LinkedIn',           placeholder: 'https://linkedin.com/company/lticsarl', color: 'text-blue-700' },
  { key: 'social_instagram', label: 'Instagram',          placeholder: 'https://instagram.com/lticsarl',        color: 'text-pink-500' },
  { key: 'social_youtube',   label: 'YouTube',            placeholder: 'https://youtube.com/@lticsarl',         color: 'text-red-500' },
  { key: 'social_whatsapp',  label: 'WhatsApp Business',  placeholder: 'https://wa.me/2376XXXXXXXX',            color: 'text-green-500' },
  { key: 'social_tiktok',    label: 'TikTok',             placeholder: 'https://tiktok.com/@lticsarl',          color: 'text-foreground' },
];

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const { L } = useLanguage();

  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ['settings'],
    queryFn: () => api.get('/api/settings'),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Record<string, string>>();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string>) => api.patch('/api/settings', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast.success(L({ en: 'Settings saved successfully', fr: 'Paramètres enregistrés avec succès' }));
    },
    onError: () => toast.error(L({ en: 'Failed to save settings', fr: 'Échec de l\'enregistrement' })),
  });

  const onSubmit = (data: Record<string, string>) => updateMutation.mutate(data);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Globe2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">{L({ en: 'Site Settings', fr: 'Paramètres du site' })}</h1>
        </div>
        <p className="text-muted-foreground">{L({ en: 'Configure your social media links and site settings', fr: 'Configurez vos liens de réseaux sociaux et les paramètres du site' })}</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-card border rounded-xl p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold border-b pb-4">{L({ en: 'Company Statistics', fr: 'Statistiques de l\'entreprise' })}</h2>
              <p className="text-sm text-muted-foreground mt-3 mb-4">{L({ en: 'These numbers appear on the home page and About page.', fr: 'Ces chiffres apparaissent sur la page d\'accueil et la page À propos.' })}</p>
              <div className="space-y-4">
                {statsFields.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <Label htmlFor={key} className="font-semibold">{label}</Label>
                    <Input id={key} {...register(key)} placeholder={placeholder} className="mt-1" />
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-lg font-bold border-b pb-4">{L({ en: 'Company Contact Info', fr: 'Coordonnées de l\'entreprise' })}</h2>
            {contactFields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <Label htmlFor={key} className="font-semibold">{label}</Label>
                <Input id={key} {...register(key)} placeholder={placeholder} className="mt-1" />
              </div>
            ))}

            <h2 className="text-lg font-bold border-b pb-4 pt-2">{L({ en: 'Social Media Links', fr: 'Liens des réseaux sociaux' })}</h2>
            {socialFields.map(({ key, label, placeholder, color }) => (
              <div key={key}>
                <Label htmlFor={key} className={`font-semibold ${color}`}>{label}</Label>
                <Input id={key} {...register(key)} placeholder={placeholder} className="mt-1" type="url" />
              </div>
            ))}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <h2 className="text-lg font-bold">{L({ en: 'AI Auto-Fill', fr: 'Remplissage IA' })}</h2>
              </div>
              <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-lg px-4 py-3 text-sm text-violet-800 dark:text-violet-300">
                {L({
                  en: 'AI auto-fill is built-in and requires no API key. Type a product name in the product form and click "Generate with AI" — description, specs and category fill automatically.',
                  fr: 'Le remplissage IA est intégré et ne nécessite aucune clé API. Tapez un nom de produit dans le formulaire et cliquez sur "Générer avec IA" — description, spécifications et catégorie se remplissent automatiquement.',
                })}
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isSubmitting ? L({ en: 'Saving…', fr: 'Enregistrement…' }) : L({ en: 'Save Settings', fr: 'Enregistrer les paramètres' })}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
