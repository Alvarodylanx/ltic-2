'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Package, ArrowRight, AlertCircle, RefreshCw,
  Search, X, ChevronDown, Check, SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, stagger, viewportOnce } from '@/components/motion/variants';

export default function ProductsPage() {
  const { L } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  const { data: categories } = useQuery<any[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/api/categories'),
  });

  const productsUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('categoryId', String(selectedCategory));
    if (debouncedSearch) params.set('search', debouncedSearch);
    const q = params.toString();
    return `/api/products${q ? `?${q}` : ''}`;
  }, [selectedCategory, debouncedSearch]);

  const { data: products, isLoading, isError, refetch } = useQuery<any[]>({
    queryKey: ['products', productsUrl],
    queryFn: () => api.get(productsUrl),
    enabled: mounted,
    retry: 2,
  });

  const allCategories = [{ id: undefined, nameEn: 'All Products', nameFr: 'Tous les Produits' }, ...(categories || [])];
  const activeCat = allCategories.find(c =>
    c.id === undefined ? !selectedCategory : c.id === selectedCategory
  );
  const isFiltered = !!selectedCategory || !!debouncedSearch;

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-[22vh] min-h-[160px] sm:h-[30vh] sm:min-h-[210px] overflow-hidden bg-sidebar flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1100&auto=format&fit=crop&q=45"
          alt="" fill className="object-cover object-center opacity-45" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/88 via-sidebar/55 to-sidebar/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar/80 via-sidebar/20 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2.5 mb-2 sm:mb-3">
            <span className="w-6 h-px bg-primary flex-shrink-0" />
            <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.3em]">
              {L({ en: 'Industrial Catalog', fr: 'Catalogue Industriel' })}
            </span>
          </motion.div>
          <h1 className="font-display font-extrabold text-section text-sidebar-foreground leading-[0.88] tracking-[-0.02em]">
            {L({ en: 'Our Products', fr: 'Nos Produits' }).split(' ').map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.18em] last:mr-0">
                <motion.span className="inline-block" initial={{ y: '112%' }} animate={{ y: 0 }}
                  transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1], delay: 0.1 + wi * 0.08 }}>
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.48 }}
            className="font-sans text-sidebar-foreground/80 text-[12px] sm:text-[15px] leading-relaxed max-w-xl mx-auto mt-2 sm:mt-3">
            {L({ en: 'Certified industrial equipment, supplies & materials — sourced globally, delivered reliably.', fr: 'Équipements industriels certifiés, fournitures & matériaux — approvisionnés mondialement, livrés de façon fiable.' })}
          </motion.p>
        </div>
      </section>

      {/* ── OIL & CONTAINER COLLECTION SPOTLIGHT ───────────────────────────── */}
      <section className="bg-sidebar overflow-hidden py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

            {/* Text — left on desktop, first on mobile */}
            <motion.div
              variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="flex-1 text-center lg:text-left"
            >
              <p className="text-primary font-bold text-[11px] uppercase tracking-[0.32em] mb-3 flex items-center justify-center lg:justify-start gap-2.5">
                <span className="w-5 h-px bg-primary flex-shrink-0" />
                {L({ en: 'Consumer & Industrial Goods', fr: 'Produits Consommateurs & Industriels' })}
              </p>
              <h2 className="font-extrabold text-3xl sm:text-4xl text-sidebar-foreground leading-tight tracking-tight mb-4 whitespace-pre-line">
                {L({ en: 'Premium Oils &\nContainer Supply.', fr: 'Huiles Premium &\nFourniture de Contenants.' })}
              </h2>
              <p className="text-sidebar-foreground/65 text-sm sm:text-base leading-relaxed mb-3 max-w-md mx-auto lg:mx-0">
                {L({ en: 'From premium sunflower and edible oils to a full range of industrial containers — sourced directly from certified producers and available for bulk or unit supply.', fr: "Des huiles de tournesol et alimentaires premium à une gamme complète de contenants industriels — approvisionnés directement auprès de producteurs certifiés." })}
              </p>
              <p className="text-sidebar-foreground/45 text-xs leading-relaxed mb-8 max-w-sm mx-auto lg:mx-0">
                {L({ en: 'Available for export, import & commercial distribution across Africa and Europe.', fr: "Disponible pour l'export, l'import et la distribution commerciale en Afrique et en Europe." })}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Button asChild size="lg"
                  className="font-semibold h-11 px-7 shadow-lg shadow-primary/25">
                  <Link href="/quote">
                    {L({ en: 'Request Supply Quote', fr: 'Demander un Devis' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline"
                  className="font-semibold h-11 px-6 bg-white/6 border-white/25 text-white
                             hover:bg-white/14 hover:border-white/50">
                  <Link href="/contact">
                    {L({ en: 'Contact Us', fr: 'Nous Contacter' })}
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Portrait video container */}
            <motion.div
              variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="relative flex-shrink-0"
            >
              {/* Ambient glow behind video */}
              <div className="absolute inset-0 scale-110 rounded-3xl blur-2xl bg-primary/20 pointer-events-none" />

              {/* Video portrait frame */}
              <div className="relative w-[200px] sm:w-[240px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                style={{ aspectRatio: '9/16' }}>
                <video
                  autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'contrast(1.05) saturate(1.1)' }}
                >
                  <source src="/videos/oils-collection.mp4" type="video/mp4" />
                </video>
                {/* Bottom gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
                {/* Top label */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    {L({ en: 'Live Stock', fr: 'Stock Actuel' })}
                  </span>
                </div>
              </div>

              {/* Floating "In Stock" badge below video */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2
                              bg-primary text-primary-foreground rounded-full
                              px-5 py-2 shadow-xl flex items-center gap-2 whitespace-nowrap">
                <Package className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                  {L({ en: 'Available for Order', fr: 'Disponible à la Commande' })}
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="sticky top-16 z-40 bg-white/85 backdrop-blur-md border-b border-border/60
        shadow-[0_2px_12px_-4px_hsl(var(--foreground)/0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-2">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                id="product-search"
                name="product-search"
                type="search"
                autoComplete="off"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder={L({ en: 'Search products…', fr: 'Rechercher…' })}
                className="pl-8 pr-7 h-9 text-sm rounded-full w-full
                  bg-muted/50 border-border/50
                  focus:bg-white focus:border-primary/40
                  transition-colors duration-200"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Category dropdown */}
            <div className="relative flex-shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setFilterOpen(v => !v)}
                aria-expanded={filterOpen}
                className={`flex items-center gap-1.5 h-9 pl-3 pr-2.5 rounded-full border text-sm font-semibold
                  transition-all duration-200 whitespace-nowrap
                  ${selectedCategory
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/50 border-border/50 text-foreground hover:border-border hover:bg-white'
                  }`}>
                <SlidersHorizontal className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="max-w-[100px] sm:max-w-[160px] truncate">
                  {L({ en: activeCat?.nameEn ?? 'Filter', fr: activeCat?.nameFr ?? 'Filtrer' })}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-[calc(100%+6px)] z-50
                      bg-white border border-border rounded-xl shadow-xl
                      min-w-[180px] max-h-72 overflow-y-auto py-1">
                    {allCategories.map(cat => {
                      const active = cat.id === undefined ? !selectedCategory : selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id ?? 'all'}
                          onClick={() => { setSelectedCategory(cat.id); setFilterOpen(false); }}
                          className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm text-left
                            transition-colors duration-150
                            ${active
                              ? 'bg-primary/8 text-primary font-semibold'
                              : 'text-foreground hover:bg-muted/60 font-medium'
                            }`}>
                          {L({ en: cat.nameEn, fr: cat.nameFr })}
                          {active && <Check className="h-3.5 w-3.5 flex-shrink-0 text-primary" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clear all — only shown when filtered */}
            {isFiltered && (
              <button
                onClick={() => { setSelectedCategory(undefined); setSearchInput(''); }}
                className="flex-shrink-0 h-9 w-9 rounded-full border border-border/50
                  bg-muted/50 hover:bg-destructive/10 hover:border-destructive/30
                  flex items-center justify-center transition-colors duration-200"
                aria-label="Clear all filters">
                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── PRODUCTS GRID ── */}
      <section className="bg-background py-3 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(!mounted || isLoading) && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="border border-border rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-9 w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {mounted && isError && (
            <motion.div variants={fadeInUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-24 gap-4">
              <AlertCircle className="h-14 w-14 text-destructive/40" />
              <p className="text-muted-foreground font-medium">
                {L({ en: 'Unable to load products', fr: 'Impossible de charger les produits' })}
              </p>
              <Button variant="outline" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {L({ en: 'Retry', fr: 'Réessayer' })}
              </Button>
            </motion.div>
          )}

          {mounted && !isLoading && !isError && !products?.length && (
            <motion.div variants={fadeInUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-xl bg-foreground flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground">
                {debouncedSearch
                  ? L({ en: `No products found for "${debouncedSearch}"`, fr: `Aucun produit trouvé pour "${debouncedSearch}"` })
                  : L({ en: 'No products found in this category', fr: 'Aucun produit trouvé dans cette catégorie' })}
              </p>
              <Button variant="outline" onClick={() => { setSelectedCategory(undefined); setSearchInput(''); }}>
                {L({ en: 'View All Products', fr: 'Voir Tous les Produits' })}
              </Button>
            </motion.div>
          )}

          {mounted && !isLoading && !isError && products && products.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory ?? 'all'}-${debouncedSearch}`}
                variants={stagger} initial="hidden" animate="show"
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {products.map((product) => (
                  <motion.div key={product.id} variants={scaleIn}
                    whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      <div className="aspect-[4/3] relative bg-white overflow-hidden">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={L({ en: product.nameEn, fr: product.nameFr })} fill
                            className="object-contain p-2"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Package className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                        {product.categoryName && (
                          <span className="inline-block bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold rounded-full px-2 py-0.5 mb-1.5 w-fit">
                            {product.categoryName}
                          </span>
                        )}
                        <h3 className="font-bold text-xs sm:text-sm leading-tight mb-2.5 sm:mb-3 group-hover:text-primary transition-colors flex-1 line-clamp-2">
                          {L({ en: product.nameEn, fr: product.nameFr })}
                        </h3>
                        <Button asChild size="sm" className="w-full text-xs sm:text-sm h-8 sm:h-9">
                          <Link href={`/products/${product.slug}`}>
                            {L({ en: 'View Details', fr: 'Voir les Détails' })}
                            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1 flex-shrink-0" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </>
  );
}
