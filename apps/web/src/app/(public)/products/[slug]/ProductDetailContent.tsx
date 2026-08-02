'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import * as RadixTabs from '@radix-ui/react-tabs';
import {
  Package, CheckCircle2, XCircle, ArrowRight, FileText, ListChecks,
  ChevronLeft, ChevronRight, Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerFast, viewportOnce } from '@/components/motion/variants';

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string') {
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? p.filter(Boolean) : [];
    } catch {
      // Plain URL string (not JSON) — treat as single image
      return raw ? [raw] : [];
    }
  }
  return [];
}

function parseSpecs(raw: unknown): [string, string][] | null {
  if (!raw) return null;
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return null;
    const entries = Object.entries(obj).filter(([, v]) => v !== '' && v !== null && v !== undefined);
    return entries.length ? entries.map(([k, v]) => [k, String(v)]) : null;
  } catch { return null; }
}

function formatSpecKey(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

export default function ProductDetailPage({ initialProduct }: { initialProduct?: any }) {
  const { slug } = useParams<{ slug: string }>();
  const { L } = useLanguage();

  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const { data: product, isLoading, isError } = useQuery<any>({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/api/products/${encodeURIComponent(slug)}`),
    initialData: initialProduct ?? undefined,
    retry: 1,
  });

  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ['settings'],
    queryFn: () => api.get('/api/settings'),
    staleTime: 5 * 60 * 1000,
  });

  const { data: relatedProducts } = useQuery<any[]>({
    queryKey: ['products', 'related', product?.categoryId],
    queryFn: () => api.get(`/api/products?categoryId=${product!.categoryId}&limit=5`),
    enabled: !!product?.categoryId,
  });

  const allImages = useMemo(() => {
    if (!product) return [];
    const extras = parseImages(product.images);
    const combined = [product.imageUrl, ...extras].filter(Boolean);
    return [...new Set(combined)];
  }, [product]);

  // Reset gallery when product changes
  useEffect(() => { setActiveIdx(0); }, [product?.id]);

  // Auto-slide
  useEffect(() => {
    if (allImages.length <= 1 || paused) return;
    intervalRef.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % allImages.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [allImages.length, paused]);

  const goTo = (idx: number) => {
    setActiveIdx(idx);
    clearInterval(intervalRef.current);
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setActiveIdx(i => (i + 1) % allImages.length);
      }, 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-5 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-8 lg:gap-12">
          <div className="space-y-2">
            <Skeleton className="aspect-[4/3] rounded-2xl" />
            <div className="flex gap-2">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16 flex-1 rounded-lg" />)}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || (!isLoading && !product)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Package className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">{L({ en: 'Product Not Found', fr: 'Produit Introuvable' })}</h1>
        <Button asChild><Link href="/products">{L({ en: 'Back to Products', fr: 'Retour aux Produits' })}</Link></Button>
      </div>
    );
  }

  const related = relatedProducts?.filter((p) => p.id !== product.id).slice(0, 4);
  const hasDescription = !!(product.descriptionEn || product.descriptionFr);
  const specs = parseSpecs(product.specifications);
  const hasSpecs = !!specs;
  const defaultTab = hasDescription ? 'description' : 'specifications';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: L({ en: product.nameEn, fr: product.nameFr }),
    description: L({ en: product.descriptionEn || '', fr: product.descriptionFr || '' }),
    image: product.imageUrl || undefined,
    brand: { '@type': 'Organization', name: 'LTIC SARL' },
    offers: {
      '@type': 'Offer',
      availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'LTIC SARL' },
    },
  };

  return (
    <div className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Breadcrumb */}
        <motion.div variants={fadeInLeft} initial="hidden" animate="show" className="mb-6">
          <Breadcrumb items={[
            { label: L({ en: 'Home', fr: 'Accueil' }), href: '/' },
            { label: L({ en: 'Products', fr: 'Produits' }), href: '/products' },
            ...(product.categoryName ? [{ label: product.categoryName }] : []),
            { label: L({ en: product.nameEn, fr: product.nameFr }) },
          ]} />
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-8 lg:gap-14 mb-14">

          {/* ── IMAGE GALLERY PANEL ── */}
          <motion.div variants={fadeInLeft} initial="hidden" animate="show">

            {/* Main image */}
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sidebar shadow-xl ring-1 ring-black/10"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {allImages.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIdx}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Image
                        src={allImages[activeIdx]}
                        alt={`${L({ en: product.nameEn, fr: product.nameFr })} — photo ${activeIdx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 480px"
                        priority={activeIdx === 0}
                      />
                      {/* Bottom gradient for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Prev / Next arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => goTo((activeIdx - 1 + allImages.length) % allImages.length)}
                        aria-label={L({ en: 'Previous image', fr: 'Image précédente' })}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                          w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm
                          flex items-center justify-center text-white
                          hover:bg-black/70 transition-colors duration-150">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => goTo((activeIdx + 1) % allImages.length)}
                        aria-label={L({ en: 'Next image', fr: 'Image suivante' })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                          w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm
                          flex items-center justify-center text-white
                          hover:bg-black/70 transition-colors duration-150">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {/* Dot / progress indicators */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i)}
                          aria-label={`Image ${i + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === activeIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Image count badge */}
                  {allImages.length > 1 && (
                    <div className="absolute top-3 right-3 z-10
                      bg-black/55 backdrop-blur-sm rounded-full px-2.5 py-1
                      flex items-center gap-1.5 text-white">
                      <Maximize2 className="h-3 w-3" />
                      <span className="text-[11px] font-semibold">{activeIdx + 1} / {allImages.length}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Package className="h-20 w-20 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`flex-shrink-0 relative w-[72px] h-[54px] rounded-lg overflow-hidden
                      border-2 transition-all duration-200 focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-primary ${
                        i === activeIdx
                          ? 'border-primary shadow-sm shadow-primary/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── INFO PANEL ── */}
          <motion.div variants={fadeInRight} initial="hidden" animate="show" className="flex flex-col min-h-0">

            {/* Category + availability */}
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              {product.categoryName && (
                <Link
                  href={`/products?category=${product.categoryId}`}
                  className="inline-block bg-primary/10 text-primary text-xs font-semibold rounded-full px-3 py-1
                    hover:bg-primary/20 transition-colors">
                  {product.categoryName}
                </Link>
              )}
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                product.available
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}>
                {product.available
                  ? <CheckCircle2 className="h-3 w-3" />
                  : <XCircle className="h-3 w-3" />}
                {product.available
                  ? L({ en: 'In Stock', fr: 'En Stock' })
                  : L({ en: 'On Request', fr: 'Sur Demande' })}
              </span>
            </div>

            {/* Product name */}
            <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-[2.2rem] tracking-tight leading-tight
                           border-l-[3px] border-primary pl-4 mb-5">
              {L({ en: product.nameEn, fr: product.nameFr })}
            </h1>

            {/* Tabs: Description / Specifications */}
            {(hasDescription || hasSpecs) && (
              <RadixTabs.Root defaultValue={defaultTab} className="flex flex-col flex-1 mb-6 min-h-0">
                <RadixTabs.List
                  className="flex border-b border-border gap-0 shrink-0"
                  aria-label={L({ en: 'Product details', fr: 'Détails du produit' })}>
                  {hasDescription && (
                    <RadixTabs.Trigger
                      value="description"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold
                                 text-muted-foreground border-b-2 border-transparent -mb-px
                                 data-[state=active]:text-primary data-[state=active]:border-primary
                                 hover:text-foreground transition-colors duration-150
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <FileText className="h-3.5 w-3.5" />
                      {L({ en: 'Description', fr: 'Description' })}
                    </RadixTabs.Trigger>
                  )}
                  {hasSpecs && (
                    <RadixTabs.Trigger
                      value="specifications"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold
                                 text-muted-foreground border-b-2 border-transparent -mb-px
                                 data-[state=active]:text-primary data-[state=active]:border-primary
                                 hover:text-foreground transition-colors duration-150
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <ListChecks className="h-3.5 w-3.5" />
                      {L({ en: 'Specifications', fr: 'Spécifications' })}
                    </RadixTabs.Trigger>
                  )}
                </RadixTabs.List>

                {hasDescription && (
                  <RadixTabs.Content
                    value="description"
                    className="pt-4 overflow-y-auto max-h-56 pr-1
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {L({ en: product.descriptionEn || '', fr: product.descriptionFr || '' })}
                    </p>
                  </RadixTabs.Content>
                )}

                {hasSpecs && specs && (
                  <RadixTabs.Content
                    value="specifications"
                    className="pt-4 overflow-y-auto max-h-56 pr-1
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="rounded-xl border border-border overflow-hidden text-sm">
                      {specs.map(([key, value], i) => (
                        <div
                          key={key}
                          className={`flex items-start gap-3 ${
                            i % 2 === 0 ? 'bg-muted/40' : 'bg-transparent'
                          } ${i !== specs.length - 1 ? 'border-b border-border/50' : ''}`}
                        >
                          <span className="w-2/5 px-3 py-2.5 font-semibold text-muted-foreground text-xs shrink-0">
                            {formatSpecKey(key)}
                          </span>
                          <span className="flex-1 px-3 py-2.5 text-foreground text-xs font-medium">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </RadixTabs.Content>
                )}
              </RadixTabs.Root>
            )}

            {/* Spacer + divider */}
            <div className="border-t border-border mb-5 mt-auto" />

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button asChild size="default" className="w-full gap-1.5 h-11">
                  <Link href={`/quote?product=${encodeURIComponent(L({ en: product.nameEn, fr: product.nameFr }))}`}>
                    {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                <Button asChild size="default"
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-sm shadow-green-500/20 gap-2 h-11">
                  <a
                    href={`${settings?.social_whatsapp || 'https://wa.me/2376XXXXXXXX'}?text=${encodeURIComponent(L({ en: `Hi, I'm interested in: ${product.nameEn}`, fr: `Bonjour, je suis intéressé par : ${product.nameFr}` }))}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                <Button asChild size="default" variant="outline" className="w-full h-11">
                  <Link href="/contact">{L({ en: 'Contact Us', fr: 'Nous Contacter' })}</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related && related.length > 0 && (
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-5 h-px bg-primary shrink-0" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {L({ en: 'Related Products', fr: 'Produits Similaires' })}
              </p>
            </div>
            <motion.div
              variants={staggerFast} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <motion.div key={p.id} variants={scaleIn}
                  whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                  <Link href={`/products/${p.slug}`}
                    className="group bg-card border border-border rounded-xl overflow-hidden
                               hover:shadow-md hover:border-primary/40 transition-all duration-200 block">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt={L({ en: p.nameEn, fr: p.nameFr })} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-xs leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {L({ en: p.nameEn, fr: p.nameFr })}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
