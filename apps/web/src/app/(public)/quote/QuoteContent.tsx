'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Clock, Shield, Globe2, CheckCircle2, Loader2, Send, FileText, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { EmailInput } from '@/components/ui/EmailInput';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { CountrySelect } from '@/components/ui/CountrySelect';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { Suspense } from 'react';
import { fadeInUp, fadeInLeft, fadeInRight, stagger, viewportOnce } from '@/components/motion/variants';

const schema = z.object({
  companyName:     z.string().min(1),
  contactName:     z.string().min(1),
  email:           z.string().email(),
  phone:           z.string().optional(),
  country:         z.string().optional(),
  productInterest: z.string().min(1),
  quantity:        z.string().optional(),
  message:         z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function QuoteForm() {
  const { L, language } = useLanguage();
  const searchParams = useSearchParams();
  const defaultProduct = searchParams.get('product') || '';

  const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { productInterest: defaultProduct, country: '', phone: '' },
  });

  const selectedCountry = watch('country');

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/api/quotes', data);
      toast.success(L({ en: 'Quote Request Sent', fr: 'Demande de Devis Envoyée' }), {
        description: L({ en: 'We will respond within 24 hours.', fr: 'Nous répondrons dans les 24 heures.' }),
      });
      reset();
    } catch {
      toast.error(L({ en: 'Error', fr: 'Erreur' }), {
        description: L({ en: 'There was a problem sending your request.', fr: "Un problème est survenu lors de l'envoi de votre demande." }),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName" className="text-xs font-semibold uppercase tracking-wide">
            {L({ en: 'Company Name', fr: "Nom de l'Entreprise" })} *
          </Label>
          <Input id="companyName" {...register('companyName')} className="mt-1.5 rounded-xl" />
          {errors.companyName && <p className="text-destructive text-xs mt-1">{L({ en: 'Required', fr: 'Requis' })}</p>}
        </div>
        <div>
          <Label htmlFor="contactName" className="text-xs font-semibold uppercase tracking-wide">
            {L({ en: 'Contact Name', fr: 'Nom du Contact' })} *
          </Label>
          <Input id="contactName" {...register('contactName')} className="mt-1.5 rounded-xl" />
          {errors.contactName && <p className="text-destructive text-xs mt-1">{L({ en: 'Required', fr: 'Requis' })}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide">
          {L({ en: 'Email Address', fr: 'Adresse Email' })} *
        </Label>
        <Controller name="email" control={control}
          render={({ field }) => (
            <EmailInput id="email" placeholder="you@company.com" className="mt-1.5 rounded-xl" {...field} />
          )} />
        {errors.email && <p className="text-destructive text-xs mt-1">{L({ en: 'Valid email required', fr: 'Email valide requis' })}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country" className="text-xs font-semibold uppercase tracking-wide">
            {L({ en: 'Country', fr: 'Pays' })}
          </Label>
          <Controller name="country" control={control}
            render={({ field }) => (
              <CountrySelect id="country" className="mt-1.5" value={field.value ?? ''} onChange={field.onChange}
                lang={language} placeholderEn="Select your country…" placeholderFr="Sélectionnez votre pays…" />
            )} />
        </div>
        <div>
          <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide">
            {L({ en: 'Phone Number', fr: 'Numéro de Téléphone' })}
          </Label>
          <Controller name="phone" control={control}
            render={({ field }) => (
              <PhoneInput id="phone" value={field.value} onChange={field.onChange}
                syncCountry={selectedCountry} className="mt-1.5" />
            )} />
        </div>
      </div>

      <div>
        <Label htmlFor="productInterest" className="text-xs font-semibold uppercase tracking-wide">
          {L({ en: 'Product / Service of Interest', fr: "Produit / Service d'Intérêt" })} *
        </Label>
        <Input id="productInterest" {...register('productInterest')} className="mt-1.5 rounded-xl" />
        {errors.productInterest && <p className="text-destructive text-xs mt-1">{L({ en: 'Required', fr: 'Requis' })}</p>}
      </div>

      <div>
        <Label htmlFor="quantity" className="text-xs font-semibold uppercase tracking-wide">
          {L({ en: 'Quantity / Volume', fr: 'Quantité / Volume' })}
        </Label>
        <Input id="quantity" {...register('quantity')} className="mt-1.5 rounded-xl" />
      </div>

      <div>
        <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide">
          {L({ en: 'Additional Information', fr: 'Informations Supplémentaires' })}
        </Label>
        <Textarea id="message" {...register('message')} rows={4} className="mt-1.5 rounded-xl" />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}
        className="w-full font-semibold text-sm rounded-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
        {L({ en: 'Submit Quote Request', fr: 'Envoyer la Demande de Devis' })}
      </Button>
    </form>
  );
}

export default function QuotePage() {
  const { L } = useLanguage();

  const highlights = [
    { icon: Clock,        en: 'Response within 24 hours',       fr: 'Réponse dans les 24 heures' },
    { icon: Shield,       en: 'Confidential & secure',           fr: 'Confidentiel & sécurisé' },
    { icon: Globe2,       en: 'Central Africa & Gulf of Guinea',  fr: 'Afrique Centrale & Golfe de Guinée' },
    { icon: CheckCircle2, en: 'Tailored to your requirements',   fr: 'Adapté à vos besoins' },
  ];

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative -mt-[46px] lg:-mt-[80px] h-[calc(24vh+46px)] lg:h-[calc(24vh+80px)] min-h-[220px] lg:min-h-[250px] overflow-hidden bg-black">
        <Image src="/images/banner-quote.jpg" alt="" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

        <div className="relative z-10 h-full flex items-center pt-[60px] sm:pt-[70px] lg:pt-[100px]">
          <motion.div variants={stagger} initial="hidden" animate="show"
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2.5 mb-4">
              <span className="w-6 h-px bg-primary flex-shrink-0" />
              <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.3em]">
                {L({ en: 'Get a Quote', fr: 'Obtenir un Devis' })}
              </span>
            </motion.div>
            <motion.h1 variants={fadeInUp}
              className="font-display font-bold text-section text-white leading-none mb-4">
              {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/75 text-[15px] sm:text-[16px] leading-relaxed max-w-xl mx-auto">
              {L({ en: 'Get a tailored quote for any logistics, industrial supply, or trade requirement.', fr: 'Obtenez un devis personnalisé pour tout besoin logistique, fourniture industrielle ou commercial.' })}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── QUOTE BODY ──────────────────────────────────────────────────────── */}
      <section className="bg-background py-3 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Sidebar: highlights + process */}
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="space-y-4">
              {highlights.map(({ icon: Icon, en, fr }, i) => (
                <motion.div key={en} variants={fadeInLeft} initial="hidden" whileInView="show"
                  viewport={viewportOnce} transition={{ delay: i * 0.06 }}
                  className="group bg-card border border-border rounded-2xl p-4 flex items-start gap-4 hover:border-primary/50 transition-colors duration-200">
                  <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-semibold text-sm leading-relaxed pt-1.5">{L({ en, fr })}</p>
                </motion.div>
              ))}

              <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
                className="bg-card border border-border rounded-2xl p-6">
                <p className="font-semibold text-xs uppercase tracking-[0.2em] text-primary mb-5">
                  {L({ en: 'What happens next?', fr: 'Que se passe-t-il ensuite ?' })}
                </p>
                <ol className="space-y-4">
                  {[
                    { icon: FileText,     en: 'Submit this form — takes less than 2 minutes.', fr: 'Soumettez ce formulaire — moins de 2 minutes.' },
                    { icon: Clock,        en: 'Our team prepares a custom offer within 24–48 hours.', fr: 'Notre équipe prépare une offre sous 24–48h.' },
                    { icon: CheckCircle2, en: 'You receive a detailed quote with pricing and timeline.', fr: 'Vous recevez un devis détaillé avec prix et délai.' },
                    { icon: Truck,        en: 'Confirm the offer — we handle customs, freight, and logistics.', fr: "Confirmez l'offre — nous gérons les douanes, le fret et la logistique." },
                  ].map(({ icon: Icon, en, fr }, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{L({ en, fr })}</p>
                    </li>
                  ))}
                </ol>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 sm:p-8">
              <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-2">
                {L({ en: 'Quote Details', fr: 'Détails du Devis' })}
              </p>
              <h2 className="font-bold text-xl mb-6">
                {L({ en: 'Your Quote Details', fr: 'Détails de Votre Devis' })}
              </h2>
              <Suspense>
                <QuoteForm />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

