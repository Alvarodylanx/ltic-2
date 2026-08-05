'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, Mail, Clock, Globe2, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { EmailInput } from '@/components/ui/EmailInput';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { CountrySelect } from '@/components/ui/CountrySelect';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { fadeInUp, fadeInLeft, fadeInRight, stagger, viewportOnce } from '@/components/motion/variants';

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  phone:   z.string().optional(),
  country: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { L, language } = useLanguage();
  const { data: siteSettings } = useQuery<Record<string, string>>({
    queryKey: ['settings'],
    queryFn: () => api.get('/api/settings'),
    staleTime: 5 * 60 * 1000,
  });

  const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: '', phone: '' },
  });

  const selectedCountry = watch('country');

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/api/contacts', data);
      toast.success(L({ en: 'Message Sent!', fr: 'Message Envoyé !' }), {
        description: L({ en: 'Thank you for reaching out. We will respond shortly.', fr: 'Merci de nous avoir contactés. Nous répondrons sous peu.' }),
      });
      reset();
    } catch {
      toast.error(L({ en: 'Something went wrong', fr: 'Une erreur est survenue' }), {
        description: L({ en: 'Please try again or email us directly.', fr: 'Veuillez réessayer ou nous écrire directement.' }),
      });
    }
  };

  const contactInfo = [
    { icon: MapPin, label: { en: 'Address',  fr: 'Adresse'    }, value: siteSettings?.company_address || 'Douala, Cameroon' },
    { icon: Phone,  label: { en: 'Phone',    fr: 'Téléphone'  }, value: siteSettings?.company_phone   || '+237 6XX XXX XXX' },
    { icon: Mail,   label: { en: 'Email',    fr: 'Email'      }, value: siteSettings?.company_email   || 'contact@lticsarl.com' },
    { icon: Clock,  label: { en: 'Hours',    fr: 'Horaires'   }, value: 'Monday – Friday, 8:00 AM – 6:00 PM (WAT)' },
    { icon: Globe2, label: { en: 'Coverage', fr: 'Couverture' }, value: L({ en: 'Global — 30+ countries served', fr: 'Mondial — 30+ pays desservis' }) },
  ];

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[36vh] min-h-[260px] overflow-hidden bg-sidebar flex items-end pb-0">
        <Image src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1100&auto=format&fit=crop&q=45" alt="" fill className="object-cover object-center opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/95 via-sidebar/65 to-sidebar/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar/90 via-sidebar/25 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2.5 mb-3">
            <span className="w-6 h-px bg-primary flex-shrink-0" />
            <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.3em]">
              {L({ en: 'Get In Touch', fr: 'Prendre Contact' })}
            </span>
          </motion.div>
          <h1 className="font-display font-extrabold text-section text-sidebar-foreground leading-[0.88] tracking-[-0.02em] mb-3">
            {L({ en: 'Contact Our Team', fr: 'Contactez Notre Équipe' }).split(' ').map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.18em] last:mr-0">
                <motion.span
                  className="inline-block"
                  initial={{ y: '112%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1], delay: 0.1 + wi * 0.08 }}>
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.48 }}
            className="font-sans text-sidebar-foreground/90 text-[15px] sm:text-[16px] leading-relaxed max-w-xl mx-auto">
            {L({ en: 'Our experts are ready to discuss your logistics and supply needs.', fr: 'Nos experts sont prêts à discuter de vos besoins en logistique et fournitures.' })}
          </motion.p>
        </div>

      </section>

      {/* ── TRUST BRIDGE ────────────────────────────────────────────────────── */}
      <div className="relative bg-sidebar overflow-hidden">
        {/* Gradient fade: dark navy → white background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar via-sidebar/80 to-background pointer-events-none" />
        {/* Top hairline accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14
                     grid grid-cols-2 lg:grid-cols-4 gap-px
                     bg-white/[0.06] rounded-none divide-x-0"
        >
          {([
            { value: '30+',  label: { en: 'Countries Served',   fr: 'Pays Desservis'      } },
            { value: '5+',   label: { en: 'Years of Expertise', fr: 'Années d\'Expertise'  } },
            { value: '500+', label: { en: 'Shipments Handled',  fr: 'Expéditions Traitées' } },
            { value: '24h',  label: { en: 'Response Time',      fr: 'Délai de Réponse'     } },
          ] as const).map(({ value, label }) => (
            <motion.div
              key={value}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 20 } },
              }}
              className="flex flex-col items-center gap-1.5 py-6 px-4
                         border border-white/[0.08] rounded-2xl mx-1.5 my-1.5
                         bg-white/[0.04] backdrop-blur-sm"
            >
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-primary
                               leading-none tracking-tight tabular-nums">
                {value}
              </span>
              <span className="text-sidebar-foreground/70 text-[11px] font-semibold uppercase tracking-[0.22em] text-center">
                {L(label)}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom fade continues into the form section */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      </div>

      {/* ── CONTACT BODY ────────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-background pb-10 sm:pb-14 lg:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

            {/* FORM — order-1 on mobile so it appears first, order-2 on desktop (right col) */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="lg:col-span-3 order-1 lg:order-2 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide">
                      {L({ en: 'Your Name', fr: 'Votre Nom' })} *
                    </Label>
                    <Input id="name" {...register('name')} className="mt-1.5 rounded-xl"
                      placeholder={L({ en: 'John Doe', fr: 'Jean Dupont' })} />
                    {errors.name && <p className="text-destructive text-xs mt-1">{L({ en: 'Min 2 characters', fr: '2 caractères minimum' })}</p>}
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
                    <Label htmlFor="company" className="text-xs font-semibold uppercase tracking-wide">
                      {L({ en: 'Company Name', fr: "Nom de l'Entreprise" })}
                    </Label>
                    <Input id="company" {...register('company')} className="mt-1.5 rounded-xl"
                      placeholder={L({ en: 'Your Company Ltd.', fr: 'Votre Société S.A.' })} />
                  </div>
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

                <div>
                  <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wide">
                    {L({ en: 'Subject', fr: 'Sujet' })} *
                  </Label>
                  <Input id="subject" {...register('subject')} className="mt-1.5 rounded-xl"
                    placeholder={L({ en: 'How can we help?', fr: 'Comment pouvons-nous vous aider ?' })} />
                  {errors.subject && <p className="text-destructive text-xs mt-1">{L({ en: 'Required', fr: 'Requis' })}</p>}
                </div>

                <div>
                  <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide">
                    {L({ en: 'Your Message', fr: 'Votre Message' })} *
                  </Label>
                  <Textarea id="message" {...register('message')} rows={5} className="mt-1.5 rounded-xl"
                    placeholder={L({ en: 'Tell us about your logistics or supply requirements…', fr: 'Parlez-nous de vos besoins en logistique ou fournitures…' })} />
                  {errors.message && <p className="text-destructive text-xs mt-1">{L({ en: 'Min 10 characters', fr: '10 caractères minimum' })}</p>}
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting}
                  className="w-full font-semibold text-sm">
                  {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  {L({ en: 'Send Message', fr: 'Envoyer le Message' })}
                </Button>
              </form>
            </motion.div>

            {/* INFO SIDEBAR — order-2 on mobile (below form), order-1 on desktop (left col) */}
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="lg:col-span-2 order-2 lg:order-1 space-y-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/10">

              <div>
                <motion.p variants={fadeInUp}
                  className="text-primary font-semibold text-xs uppercase tracking-[0.25em] mb-2">
                  {L({ en: 'Reach Out', fr: 'Nous Contacter' })}
                </motion.p>
                <motion.h2 variants={fadeInUp}
                  className="font-bold text-xl sm:text-2xl tracking-tight mb-2">
                  {L({ en: 'How Can We Help?', fr: 'Comment Vous Aider ?' })}
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-muted-foreground text-sm leading-relaxed">
                  {L({ en: 'Fill in the form and our team will respond within 24 hours.', fr: 'Remplissez le formulaire et notre équipe répondra dans les 24 heures.' })}
                </motion.p>
              </div>

              <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value }, i) => (
                  <motion.div key={label.en} variants={fadeInUp} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.15em] mb-0.5">
                        {L(label)}
                      </p>
                      <p className="text-sm font-medium leading-snug break-words">{value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>{/* end grid */}
        </div>
      </section>
    </>
  );
}

