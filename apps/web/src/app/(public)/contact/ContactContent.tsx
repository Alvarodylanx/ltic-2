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
      {/* ── SPLIT LAYOUT ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">

        {/* LEFT — dark info panel */}
        <motion.aside
          variants={stagger} initial="hidden" animate="show"
          className="bg-foreground px-8 sm:px-12 py-16 lg:py-20 relative overflow-hidden lg:sticky lg:top-16 lg:self-start lg:min-h-[calc(100dvh-64px)]">

          {/* Background texture */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&auto=format&fit=crop&q=20"
              alt="" fill className="object-cover opacity-5" />
          </div>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />

          <div className="relative flex flex-col h-full">
            <motion.div variants={fadeInUp} className="w-8 h-0.5 bg-primary mb-8" />
            <motion.p variants={fadeInUp}
              className="text-primary font-display font-bold text-xs uppercase tracking-[0.3em] mb-4">
              {L({ en: 'Get In Touch', fr: 'Prendre Contact' })}
            </motion.p>
            <motion.h1 variants={fadeInUp}
              className="font-display font-extrabold text-3xl sm:text-4xl text-sidebar-foreground leading-tight tracking-tight mb-4">
              {L({ en: 'Contact\nOur Team', fr: 'Contactez\nNotre Équipe' })}
            </motion.h1>
            <motion.p variants={fadeInUp}
              className="text-sidebar-foreground/55 text-sm leading-relaxed mb-12">
              {L({ en: 'Our experts are ready to discuss your logistics and supply needs.', fr: 'Nos experts sont prêts à discuter de vos besoins en logistique et fournitures.' })}
            </motion.p>

            {/* Contact details */}
            <motion.div variants={stagger} className="space-y-7 mt-auto lg:mt-0">
              {contactInfo.map(({ icon: Icon, label, value }, i) => (
                <motion.div key={label.en} variants={fadeInUp} className="flex items-start gap-4">
                  <div className="w-9 h-9 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sidebar-foreground/40 text-xs font-display font-bold uppercase tracking-[0.2em] mb-0.5">
                      {L(label)}
                    </p>
                    <p className="text-sidebar-foreground/80 text-sm font-medium">{value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.aside>

        {/* RIGHT — white form */}
        <motion.main
          variants={fadeInRight} initial="hidden" animate="show"
          className="bg-background px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
          <div className="max-w-2xl">
            <div className="w-10 h-0.5 bg-primary mb-8" />
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-2">
              {L({ en: 'Send Us a Message', fr: 'Envoyez-Nous un Message' })}
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              {L({ en: 'Fill in the form below and we\'ll get back to you within 24 hours.', fr: 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures.' })}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="name" className="text-xs font-display font-bold uppercase tracking-[0.15em] mb-1.5 block">
                    {L({ en: 'Your Name', fr: 'Votre Nom' })} *
                  </Label>
                  <Input id="name" {...register('name')} className="rounded-none"
                    placeholder={L({ en: 'John Doe', fr: 'Jean Dupont' })} />
                  {errors.name && <p className="text-destructive text-xs mt-1">{L({ en: 'Min 2 characters', fr: '2 caractères minimum' })}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs font-display font-bold uppercase tracking-[0.15em] mb-1.5 block">
                    {L({ en: 'Email Address', fr: 'Adresse Email' })} *
                  </Label>
                  <Controller name="email" control={control}
                    render={({ field }) => (
                      <EmailInput id="email" placeholder="you@company.com" className="rounded-none" {...field} />
                    )} />
                  {errors.email && <p className="text-destructive text-xs mt-1">{L({ en: 'Valid email required', fr: 'Email valide requis' })}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="country" className="text-xs font-display font-bold uppercase tracking-[0.15em] mb-1.5 block">
                    {L({ en: 'Country', fr: 'Pays' })}
                  </Label>
                  <Controller name="country" control={control}
                    render={({ field }) => (
                      <CountrySelect id="country" value={field.value ?? ''} onChange={field.onChange}
                        lang={language} placeholderEn="Select country…" placeholderFr="Sélectionnez votre pays…" />
                    )} />
                </div>
                <div>
                  <Label htmlFor="company" className="text-xs font-display font-bold uppercase tracking-[0.15em] mb-1.5 block">
                    {L({ en: 'Company Name', fr: "Nom de l'Entreprise" })}
                  </Label>
                  <Input id="company" {...register('company')} className="rounded-none"
                    placeholder={L({ en: 'Your Company Ltd.', fr: 'Votre Société S.A.' })} />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs font-display font-bold uppercase tracking-[0.15em] mb-1.5 block">
                  {L({ en: 'Phone Number', fr: 'Numéro de Téléphone' })}
                </Label>
                <Controller name="phone" control={control}
                  render={({ field }) => (
                    <PhoneInput id="phone" value={field.value} onChange={field.onChange}
                      syncCountry={selectedCountry} />
                  )} />
              </div>

              <div>
                <Label htmlFor="subject" className="text-xs font-display font-bold uppercase tracking-[0.15em] mb-1.5 block">
                  {L({ en: 'Subject', fr: 'Sujet' })} *
                </Label>
                <Input id="subject" {...register('subject')} className="rounded-none"
                  placeholder={L({ en: 'How can we help?', fr: 'Comment pouvons-nous vous aider ?' })} />
                {errors.subject && <p className="text-destructive text-xs mt-1">{L({ en: 'Required', fr: 'Requis' })}</p>}
              </div>

              <div>
                <Label htmlFor="message" className="text-xs font-display font-bold uppercase tracking-[0.15em] mb-1.5 block">
                  {L({ en: 'Your Message', fr: 'Votre Message' })} *
                </Label>
                <Textarea id="message" {...register('message')} rows={5} className="rounded-none"
                  placeholder={L({ en: 'Tell us about your logistics or supply requirements…', fr: 'Parlez-nous de vos besoins en logistique ou fournitures…' })} />
                {errors.message && <p className="text-destructive text-xs mt-1">{L({ en: 'Min 10 characters', fr: '10 caractères minimum' })}</p>}
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting}
                className="w-full font-display font-bold text-sm rounded-none">
                {isSubmitting
                  ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  : <Send className="h-4 w-4 mr-2" />}
                {L({ en: 'Send Message', fr: 'Envoyer le Message' })}
              </Button>
            </form>
          </div>
        </motion.main>
      </div>
    </>
  );
}
