'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Globe2, Save, Loader2, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

const statsFields = [
  { key: 'stat_countries',  label: 'Countries Served / Pays Desservis',           placeholder: '30+' },
  { key: 'stat_clients',    label: 'Clients Worldwide / Clients Mondiaux',         placeholder: '500+' },
  { key: 'stat_years',      label: 'Years of Experience / Années d\'Expérience',   placeholder: '5+' },
  { key: 'stat_shipments',  label: 'Shipments Completed / Expéditions Réalisées',  placeholder: '10K+' },
];

const contactFields = [
  { key: 'company_address',  label: 'Address / Adresse',           placeholder: 'Douala, Cameroon / International Operations' },
  { key: 'company_phone',    label: 'Phone 1 / Téléphone 1',       placeholder: '+237 6XX XXX XXX' },
  { key: 'company_phone_2',  label: 'Phone 2 / Téléphone 2',       placeholder: '+237 6XX XXX XXX' },
  { key: 'company_email',    label: 'Email',                        placeholder: 'contact@lticsarl.com' },
  { key: 'company_website',  label: 'Website / Site web',           placeholder: 'www.lticsarl.com' },
];

const socialFields = [
  { key: 'social_facebook',  label: 'Facebook',          placeholder: 'https://facebook.com/lticsarl',         color: 'text-blue-600' },
  { key: 'social_linkedin',  label: 'LinkedIn',          placeholder: 'https://linkedin.com/company/lticsarl', color: 'text-blue-700' },
  { key: 'social_instagram', label: 'Instagram',         placeholder: 'https://instagram.com/lticsarl',        color: 'text-pink-500' },
  { key: 'social_whatsapp',  label: 'WhatsApp Business', placeholder: 'https://wa.me/2376XXXXXXXX',            color: 'text-green-500' },
  { key: 'social_tiktok',    label: 'TikTok',            placeholder: 'https://tiktok.com/@lticsarl',          color: 'text-foreground' },
];

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const { L } = useLanguage();

  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ['settings-admin'],
    queryFn: () => api.get('/api/settings/admin'),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Record<string, string>>();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string>) => api.patch('/api/settings', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings-admin'] });
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast.success(L({ en: 'Settings saved successfully', fr: 'Paramètres enregistrés avec succès' }));
    },
    onError: () => toast.error(L({ en: 'Failed to save settings', fr: 'Échec de l\'enregistrement' })),
  });

  const onSubmit = (data: Record<string, string>) => updateMutation.mutate(data);

  async function testEmail() {
    try {
      const result: any = await api.post('/api/settings/test-email', {});
      if (result.sent) toast.success(L({ en: 'Test email sent successfully!', fr: 'Email de test envoyé avec succès !' }));
      else toast.warning(result.error || L({ en: 'Email not configured', fr: 'Email non configuré' }));
    } catch {
      toast.error(L({ en: 'Test failed', fr: 'Test échoué' }));
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Globe2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">{L({ en: 'Site Settings', fr: 'Paramètres du site' })}</h1>
        </div>
        <p className="text-muted-foreground">{L({ en: 'Configure your site settings, contact info, and email', fr: 'Configurez les paramètres du site, les coordonnées et l\'email' })}</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-card border rounded-xl p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Stats */}
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

            {/* Contact Info */}
            <div>
              <h2 className="text-lg font-bold border-b pb-4">{L({ en: 'Company Contact Info', fr: 'Coordonnées de l\'entreprise' })}</h2>
              <div className="space-y-4 mt-4">
                {contactFields.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <Label htmlFor={key} className="font-semibold">{label}</Label>
                    <Input id={key} {...register(key)} placeholder={placeholder} className="mt-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h2 className="text-lg font-bold border-b pb-4 pt-2">{L({ en: 'Social Media Links', fr: 'Liens des réseaux sociaux' })}</h2>
              <div className="space-y-4 mt-4">
                {socialFields.map(({ key, label, placeholder, color }) => (
                  <div key={key}>
                    <Label htmlFor={key} className={`font-semibold ${color}`}>{label}</Label>
                    <Input id={key} {...register(key)} placeholder={placeholder} className="mt-1" type="url" />
                  </div>
                ))}
              </div>
            </div>

            {/* SMTP Email */}
            <div>
              <div className="flex items-center gap-2 border-b pb-4">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">{L({ en: 'Email / SMTP Configuration', fr: 'Configuration Email / SMTP' })}</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-3 mb-4">
                {L({
                  en: 'Configure your outgoing email server. For Gmail, use smtp.gmail.com with an App Password (Google Account → Security → App Passwords). Changes take effect immediately after saving.',
                  fr: 'Configurez votre serveur d\'envoi d\'emails. Pour Gmail, utilisez smtp.gmail.com avec un mot de passe d\'application (Compte Google → Sécurité → Mots de passe d\'application). Les changements prennent effet après l\'enregistrement.',
                })}
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="smtp_host" className="font-semibold">SMTP Host</Label>
                    <Input id="smtp_host" {...register('smtp_host')} placeholder="smtp.gmail.com" className="mt-1" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="smtp_port" className="font-semibold">SMTP Port</Label>
                    <Input id="smtp_port" {...register('smtp_port')} placeholder="587" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="smtp_user" className="font-semibold">{L({ en: 'SMTP Username (email)', fr: 'Identifiant SMTP (email)' })}</Label>
                  <Input id="smtp_user" {...register('smtp_user')} placeholder="your@gmail.com" className="mt-1" type="email" />
                </div>
                <div>
                  <Label htmlFor="smtp_password" className="font-semibold">{L({ en: 'SMTP Password / App Password', fr: 'Mot de passe SMTP / Mot de passe d\'application' })}</Label>
                  <Input id="smtp_password" {...register('smtp_password')} placeholder="••••••••••••••••" className="mt-1" type="password" />
                </div>
                <div>
                  <Label htmlFor="smtp_from" className="font-semibold">{L({ en: 'From Address (optional)', fr: 'Adresse expéditeur (optionnel)' })}</Label>
                  <Input id="smtp_from" {...register('smtp_from')} placeholder="noreply@lticsarl.com" className="mt-1" type="email" />
                </div>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={testEmail}>
                  <Send className="h-3.5 w-3.5" />
                  {L({ en: 'Send Test Email', fr: 'Envoyer un email de test' })}
                </Button>
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
