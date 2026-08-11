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
import { fadeInUp, stagger, viewportOnce } from '@/components/motion/variants';

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName" className="text-xs font-semibold uppercase tracking-wide">
            {L({ en: 'Company Name', fr: "Nom de l'Entreprise" })} *
          </Label>
          <Input id="companyName" {...register('companyName')} className="mt-1.5 rounded-xl"
            placeholder={L({ en: 'Your Company Ltd.', fr: 'Votre Société S.A.' })} />
          {errors.companyName && <p className="text-destructive text-xs mt-1">{L({ en: 'Required', fr: 'Requis' })}</p>}
        </div>
        <div>
          <Label htmlFor="contactName" className="text-xs font-semibold uppercase tracking-wide">
            {L({ en: 'Contact Name', fr: 'Nom du Contact' })} *
          </Label>
          <Input id="contactName" {...register('contactName')} className="mt-1.5 rounded-xl"
            placeholder={L({ en: 'John Doe', fr: 'Jean Dupont' })} />
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
                lang={language} placeholderEn="Select country…" placeholderFr="Sélectionnez votre pays…" />
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
        <Input id="productInterest" {...register('productInterest')} className="mt-1.5 rounded-xl"
          placeholder={L({ en: 'e.g. Timber, Lubricants, ECOKLIN…', fr: 'ex. Bois, Lubrifiants, ECOKLIN…' })} />
        {errors.productInterest && <p className="text-destructive text-xs mt-1">{L({ en: 'Required', fr: 'Requis' })}</p>}
      </div>

      <div>
        <Label htmlFor="quantity" className="text-xs font-semibold uppercase tracking-wide">
          {L({ en: 'Quantity / Volume', fr: 'Quantité / Volume' })}
        </Label>
        <Input id="quantity" {...register('quantity')} className="mt-1.5 rounded-xl"
          placeholder={L({ en: 'e.g. 20 MT, 1 container, 500 L…', fr: 'ex. 20 T, 1 conteneur, 500 L…' })} />
      </div>

      <div>
        <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide">
          {L({ en: 'Additional Information', fr: 'Informations Supplémentaires' })}
        </Label>
        <Textarea id="message" {...register('message')} rows={5} className="mt-1.5 rounded-xl"
          placeholder={L({ en: 'Destination port, delivery deadline, special requirements…', fr: 'Port de destination, délai de livraison, exigences particulières…' })} />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full font-semibold text-sm">
        {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
        {L({ en: 'Submit Quote Request', fr: 'Envoyer la Demande de Devis' })}
      </Button>
    </form>
  );
}

export default function QuotePage() {
  const { L } = useLanguage();

  const highlights = [
    { icon: Clock,        label: { en: 'Response Time',  fr: 'Délai de Réponse'   }, value: { en: 'Within 24 hours',                     fr: 'Dans les 24 heures'                       } },
    { icon: Shield,       label: { en: 'Confidentiality', fr: 'Confidentialité'    }, value: { en: 'Your data is fully confidential',       fr: 'Vos données sont entièrement confidentielles' } },
    { icon: Globe2,       label: { en: 'Coverage',        fr: 'Couverture'         }, value: { en: 'Central Africa & Gulf of Guinea',       fr: 'Afrique Centrale & Golfe de Guinée'       } },
    { icon: CheckCircle2, label: { en: 'Custom Offer',    fr: 'Offre Sur Mesure'   }, value: { en: 'Fully tailored to your requirements',   fr: 'Entièrement adapté à vos besoins'         } },
  ];

  const steps = [
    { icon: FileText,     en: 'Submit this form — takes less than 2 minutes.',           fr: 'Soumettez ce formulaire — moins de 2 minutes.'              },
    { icon: Clock,        en: 'Our team prepares a custom offer within 24–48 hours.',     fr: 'Notre équipe prépare une offre sous 24–48h.'                },
    { icon: CheckCircle2, en: 'You receive a detailed quote with pricing and timeline.',  fr: 'Vous recevez un devis détaillé avec prix et délai.'         },
    { icon: Truck,        en: 'Confirm the offer — we handle customs, freight & logistics.', fr: "Confirmez l'offre — nous gérons les douanes, le fret et la logistique." },
  ];

  const title = L({ en: 'Request a Quote', fr: 'Demander un Devis' });

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative -mt-[46px] lg:-mt-[80px] h-[calc(24vh+46px)] lg:h-[calc(24vh+80px)] min-h-[220px] lg:min-h-[250px] overflow-hidden bg-black">
        <Image src="/images/banner-quote.jpg" alt="" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

        <div className="relative z-10 h-full flex items-center pt-[60px] sm:pt-[70px] lg:pt-[100px]">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
              className="flex items-center justify-center gap-2.5 mb-4">
              <span className="w-6 h-px bg-primary flex-shrink-0" />
              <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.3em]">
                {L({ en: 'Get a Quote', fr: 'Obtenir un Devis' })}
              </span>
            </motion.div>
            <h1 className="font-display font-extrabold text-section text-white leading-[0.88] tracking-[-0.02em] mb-4">
              {title.split(' ').map((word, wi) => (
                <span key={wi} className="inline-block overflow-hidden mr-[0.18em] last:mr-0">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '112%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1], delay: 0.1 + wi * 0.08 }}>
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.45 }}
              className="font-sans text-white/75 text-[15px] sm:text-[16px] leading-relaxed max-w-xl mx-auto">
              {L({ en: 'Get a tailored quote for any logistics, industrial supply, or trade requirement.', fr: 'Obtenez un devis personnalisé pour tout besoin logistique, fourniture industrielle ou commercial.' })}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── QUOTE BODY ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-background pt-10 sm:pt-16 pb-10 sm:pb-14 lg:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

            {/* FORM — first on mobile, right (col-span-3) on desktop */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="lg:col-span-3 order-1 lg:order-2 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/10">
              <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-2">
                {L({ en: 'Quote Details', fr: 'Détails du Devis' })}
              </p>
              <h2 className="font-bold text-xl sm:text-2xl tracking-tight mb-6">
                {L({ en: 'Your Quote Details', fr: 'Détails de Votre Devis' })}
              </h2>
              <Suspense>
                <QuoteForm />
              </Suspense>
            </motion.div>

            {/* SIDEBAR — second on mobile, left (col-span-2) on desktop */}
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="lg:col-span-2 order-2 lg:order-1 space-y-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/10">

              <div>
                <motion.p variants={fadeInUp}
                  className="text-primary font-semibold text-xs uppercase tracking-[0.25em] mb-2">
                  {L({ en: 'Why Choose Us', fr: 'Pourquoi Nous Choisir' })}
                </motion.p>
                <motion.h2 variants={fadeInUp}
                  className="font-bold text-xl sm:text-2xl tracking-tight mb-2">
                  {L({ en: 'What to Expect', fr: 'À Quoi S\'Attendre' })}
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-muted-foreground text-sm leading-relaxed">
                  {L({ en: 'Fill in the form and our team will prepare a custom offer within 24 hours.', fr: 'Remplissez le formulaire et notre équipe préparera une offre sur mesure dans les 24 heures.' })}
                </motion.p>
              </div>

              <div className="space-y-4">
                {highlights.map(({ icon: Icon, label, value }, i) => (
                  <motion.div key={label.en} variants={fadeInUp} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.15em] mb-0.5">
                        {L(label)}
                      </p>
                      <p className="text-sm font-medium leading-snug">{L(value)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeInUp} className="pt-2 border-t border-border">
                <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
                  {L({ en: 'What happens next?', fr: 'Que se passe-t-il ensuite ?' })}
                </p>
                <ol className="space-y-3">
                  {steps.map(({ icon: Icon, en, fr }, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{L({ en, fr })}</p>
                    </li>
                  ))}
                </ol>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
