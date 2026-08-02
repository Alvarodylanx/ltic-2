'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
import { fadeInLeft, fadeInRight, viewportOnce } from '@/components/motion/variants';

/* ─── Motion Variants ─────────────────────────────────────────────────── */
const EXPO = [0.16, 1, 0.3, 1] as const;

const cardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.52, ease: EXPO } },
};
const headerAnim = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* ─── Product Card ────────────────────────────────────────────────────── */
function ProductCard({
  product, L, reduced,
}: {
  product: any;
  L: (o: { en: string; fr: string }) => string;
  reduced: boolean | null;
}) {
  const name = L({ en: product.nameEn, fr: product.nameFr });
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-card border border-border/50 rounded-xl overflow-hidden
                 hover:border-primary/50 hover:shadow-lg hover:shadow-black/8
                 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      {/* Image */}
      <div className="aspect-square relative bg-white overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            className={`object-contain p-3 ${reduced ? '' : 'transition-transform duration-500 group-hover:scale-[1.04]'}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground/20" />
          </div>
        )}
      </div>
      {/* Info */}
      <div className="px-3 py-2.5 flex items-start justify-between gap-2 border-t border-border/40 flex-1">
        <div className="min-w-0">
          {product.categoryName && (
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-0.5 truncate">
              {product.categoryName}
            </p>
          )}
          <h3 className="font-display font-medium text-sm sm:text-[15px] leading-snug line-clamp-2 text-foreground/80 group-hover:text-primary transition-colors duration-200">
            {name}
          </h3>
        </div>
        <ArrowRight
          className={`h-3.5 w-3.5 text-primary shrink-0 mt-0.5 ${reduced ? '' : 'group-hover:translate-x-0.5 transition-transform duration-200'}`}
        />
      </div>
    </Link>
  );
}

/* ─── Category Section Divider ────────────────────────────────────────── */
function CategoryDivider({
  name, catId, onSelect, L,
}: {
  name: string;
  catId: number;
  onSelect: (id: number) => void;
  L: (o: { en: string; fr: string }) => string;
}) {
  return (
    <motion.div
      variants={headerAnim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="flex items-center gap-3 mb-5">
      {/* Left accent */}
      <span className="w-5 h-px bg-primary shrink-0" />
      {/* Category name */}
      <h2 className="font-display font-extrabold text-sm uppercase tracking-[0.22em] text-foreground whitespace-nowrap">
        {name}
      </h2>
      {/* Expanding rule */}
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EXPO, delay: 0.12 }}
        style={{ originX: 0 }}
        className="h-px bg-border flex-1 block"
      />
      {/* See all */}
      <button
        onClick={() => onSelect(catId)}
        className="text-[11px] font-bold text-primary hover:text-primary/70 transition-colors
                   flex items-center gap-1 whitespace-nowrap shrink-0">
        {L({ en: 'See all', fr: 'Voir tout' })}
        <ArrowRight className="h-3 w-3" />
      </button>
    </motion.div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */
export default function ProductsPage() {
  const { L } = useLanguage();
  const reduced = useReducedMotion();

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setFilterOpen(false);
    };
    if (filterOpen) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [filterOpen]);

  const { data: categories } = useQuery<any[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/api/categories'),
  });

  const { data: allProducts, isLoading, isError, refetch } = useQuery<any[]>({
    queryKey: ['products', 'all', debouncedSearch],
    queryFn: () => {
      const p = new URLSearchParams();
      if (debouncedSearch) p.set('search', debouncedSearch);
      const q = p.toString();
      return api.get(`/api/products${q ? `?${q}` : ''}`);
    },
    enabled: mounted,
    retry: 2,
  });

  const allCategories = useMemo(
    () => [{ id: undefined as number | undefined, nameEn: 'All Products', nameFr: 'Tous les Produits' }, ...(categories || [])],
    [categories],
  );

  const products = useMemo(() => {
    if (!allProducts) return [];
    if (selectedCategory) return allProducts.filter(p => p.categoryId === selectedCategory);
    return allProducts;
  }, [allProducts, selectedCategory]);

  const groupedByCategory = useMemo(() => {
    if (selectedCategory || debouncedSearch || !allProducts) return null;
    const map = new Map<number, { name: string; products: any[] }>();
    allProducts.forEach(p => {
      if (!p.categoryId) return;
      if (!map.has(p.categoryId)) map.set(p.categoryId, { name: p.categoryName || '', products: [] });
      map.get(p.categoryId)!.products.push(p);
    });
    return map;
  }, [allProducts, selectedCategory, debouncedSearch]);

  const activeCat = allCategories.find(c =>
    c.id === undefined ? !selectedCategory : c.id === selectedCategory,
  );
  const isFiltered = !!selectedCategory || !!debouncedSearch;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[22vh] min-h-[160px] sm:h-[30vh] sm:min-h-[210px] overflow-hidden bg-sidebar flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1100&auto=format&fit=crop&q=45"
          alt="" fill className="object-cover object-center opacity-45" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/88 via-sidebar/55 to-sidebar/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar/80 via-sidebar/20 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: EXPO }}
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

      {/* ── OIL SPOTLIGHT ────────────────────────────────────────────────── */}
      <section className="bg-sidebar overflow-hidden py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="flex-1 text-center lg:text-left">
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
                <Button asChild size="lg" className="font-semibold h-11 px-7 shadow-lg shadow-primary/25">
                  <Link href="/quote">
                    {L({ en: 'Request Supply Quote', fr: 'Demander un Devis' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline"
                  className="font-semibold h-11 px-6 bg-white/6 border-white/25 text-white hover:bg-white/14 hover:border-white/50">
                  <Link href="/contact">{L({ en: 'Contact Us', fr: 'Nous Contacter' })}</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="relative flex-shrink-0">
              <div className="absolute inset-0 scale-110 rounded-3xl blur-2xl bg-primary/20 pointer-events-none" />
              <div className="relative w-[200px] sm:w-[240px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10" style={{ aspectRatio: '9/16' }}>
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'contrast(1.05) saturate(1.1)' }}>
                  <source src="/videos/oils-collection.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    {L({ en: 'Live Stock', fr: 'Stock Actuel' })}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full px-5 py-2 shadow-xl flex items-center gap-2 whitespace-nowrap">
                <Package className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                  {L({ en: 'Available for Order', fr: 'Disponible à la Commande' })}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ───────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-border/60
        shadow-[0_2px_16px_-6px_hsl(var(--foreground)/0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                id="product-search" name="product-search" type="search" autoComplete="off"
                value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder={L({ en: 'Search products…', fr: 'Rechercher…' })}
                className="pl-8 pr-7 h-9 text-sm rounded-full w-full bg-muted/50 border-border/50
                  focus:bg-white focus:border-primary/40 transition-colors duration-200"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} aria-label="Clear"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
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
                    : 'bg-muted/50 border-border/50 text-foreground hover:border-border hover:bg-white'}`}>
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
                      min-w-[210px] max-h-72 overflow-y-auto py-1">
                    {allCategories.map(cat => {
                      const active = cat.id === undefined ? !selectedCategory : selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id ?? 'all'}
                          onClick={() => { setSelectedCategory(cat.id); setFilterOpen(false); }}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left
                            transition-colors duration-150
                            ${active ? 'bg-primary/8 text-primary font-semibold' : 'text-foreground hover:bg-muted/60 font-medium'}`}>
                          {L({ en: cat.nameEn, fr: cat.nameFr })}
                          {active && <Check className="h-3.5 w-3.5 flex-shrink-0 text-primary" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clear */}
            {isFiltered && (
              <button
                onClick={() => { setSelectedCategory(undefined); setSearchInput(''); }}
                aria-label="Clear filters"
                className="flex-shrink-0 h-9 w-9 rounded-full border border-border/50
                  bg-muted/50 hover:bg-destructive/10 hover:border-destructive/30
                  flex items-center justify-center transition-colors duration-200">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── PRODUCTS CATALOG ─────────────────────────────────────────────── */}
      <section className="bg-background py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Skeleton */}
          {(!mounted || isLoading) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="px-3 py-2.5 space-y-1.5">
                    <Skeleton className="h-2.5 w-12" />
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {mounted && isError && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-24 gap-4">
              <AlertCircle className="h-12 w-12 text-destructive/40" />
              <p className="text-muted-foreground font-medium">
                {L({ en: 'Unable to load products', fr: 'Impossible de charger les produits' })}
              </p>
              <Button variant="outline" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {L({ en: 'Retry', fr: 'Réessayer' })}
              </Button>
            </motion.div>
          )}

          {/* Empty */}
          {mounted && !isLoading && !isError && !products.length && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-24 gap-4">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                <Package className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground text-sm">
                {debouncedSearch
                  ? L({ en: `No results for "${debouncedSearch}"`, fr: `Aucun résultat pour "${debouncedSearch}"` })
                  : L({ en: 'No products in this category', fr: 'Aucun produit dans cette catégorie' })}
              </p>
              <Button variant="outline" size="sm" onClick={() => { setSelectedCategory(undefined); setSearchInput(''); }}>
                {L({ en: 'View All Products', fr: 'Voir Tous les Produits' })}
              </Button>
            </motion.div>
          )}

          {/* Products */}
          {mounted && !isLoading && !isError && products.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory ?? 'all'}-${debouncedSearch}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}>

                {/* ── Grouped: category sections ── */}
                {groupedByCategory ? (
                  <div className="space-y-14">
                    {Array.from(groupedByCategory.entries()).map(([catId, { name: catName, products: catProds }]) => (
                      <div key={catId}>
                        <CategoryDivider
                          name={catName} catId={catId}
                          onSelect={setSelectedCategory} L={L}
                        />
                        <motion.div
                          variants={reduced ? {} : cardContainer}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true, amount: 0.05 }}
                          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                          {catProds.map(p => (
                            <motion.div key={p.id} variants={reduced ? {} : cardItem}
                              whileHover={reduced ? {} : { y: -5 }}
                              transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
                              <ProductCard product={p} L={L} reduced={reduced} />
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* ── Flat grid ── */
                  <>
                    {/* Result count */}
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground mb-6 font-medium">
                      {products.length} {L({ en: 'products', fr: 'produits' })}
                      {activeCat?.nameEn && activeCat.id && (
                        <span className="text-primary font-semibold"> · {L({ en: activeCat.nameEn, fr: activeCat.nameFr ?? '' })}</span>
                      )}
                    </motion.p>
                    <motion.div
                      variants={reduced ? {} : cardContainer}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                      {products.map(p => (
                        <motion.div key={p.id} variants={reduced ? {} : cardItem}
                          whileHover={reduced ? {} : { y: -5 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
                          <ProductCard product={p} L={L} reduced={reduced} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </>
  );
}
