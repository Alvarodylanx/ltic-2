'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Globe2, Save, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
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
  const [showApiKey, setShowApiKey] = useState(false);

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
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <h2 className="text-lg font-bold">{L({ en: 'AI Integration', fr: 'Intégration IA' })}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {L({
                  en: 'Groq API key — free, works with any Google/email account, 30 requests/min. Get your key at console.groq.com → API Keys.',
                  fr: 'Clé API Groq — gratuite, fonctionne avec n\'importe quel compte, 30 req/min. Obtenez votre clé sur console.groq.com → API Keys.',
                })}
              </p>
              <Label htmlFor="groq_api_key" className="font-semibold">Groq API Key</Label>
              <div className="relative mt-1">
                <Input
                  id="groq_api_key"
                  {...register('groq_api_key')}
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="gsk_..."
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showApiKey ? 'Hide key' : 'Show key'}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {L({ en: 'Saved in the database — works on any machine without touching .env', fr: 'Sauvegardé en base de données — fonctionne partout sans toucher .env' })}
              </p>
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
