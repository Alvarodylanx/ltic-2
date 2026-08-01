'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Package, Filter, ArrowRight, AlertCircle, RefreshCw, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { fadeInUp, scaleIn, stagger, viewportOnce } from '@/components/motion/variants';

export default function ProductsPage() {
  const { L } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: categories } = useQuery<any[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/api/categories'),
  });

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('categoryId', String(selectedCategory));
    if (debouncedSearch) params.set('search', debouncedSearch);
    const q = params.toString();
    return `/api/products${q ? `?${q}` : ''}`;
  };

  const { data: products, isLoading, isError, refetch } = useQuery<any[]>({
    queryKey: ['products', selectedCategory, debouncedSearch],
    queryFn: () => api.get(buildUrl()),
    retry: 2,
    staleTime: 2 * 60 * 1000,
  });

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[36vh] min-h-[260px] overflow-hidden bg-sidebar flex items-center">
        <Image src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&auto=format&fit=crop&q=50" alt="" fill className="object-cover object-center opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/95 via-sidebar/65 to-sidebar/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar/90 via-sidebar/25 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2.5 mb-3">
            <span className="w-6 h-px bg-primary flex-shrink-0" />
            <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.3em]">
              {L({ en: 'Industrial Catalog', fr: 'Catalogue Industriel' })}
            </span>
          </motion.div>
          <h1 className="font-display font-extrabold text-section text-sidebar-foreground leading-[0.88] tracking-[-0.02em] mb-3">
            {L({ en: 'Our Products', fr: 'Nos Produits' }).split(' ').map((word, wi) => (
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
            {L({ en: 'Premium certified industrial equipment, supplies, and materials — sourced globally, delivered reliably.', fr: 'Équipements industriels certifiés premium, fournitures et matériaux — approvisionnés mondialement, livrés de façon fiable.' })}
          </motion.p>
        </div>

      </section>

      {/* ── FILTER BAR ──────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-40
        bg-white/75 backdrop-blur-md
        border-b border-white/60
        shadow-[0_1px_0_0_hsl(var(--border)/0.5),0_8px_28px_-6px_hsl(var(--foreground)/0.07)]
        py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={L({ en: 'Search products…', fr: 'Rechercher des produits…' })}
              className="pl-10 pr-8 h-10 text-sm rounded-full w-60
                bg-white/60 border-border/50
                focus:bg-white/95 focus:border-primary/40
                transition-colors duration-200"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/70">
              <Filter className="h-3.5 w-3.5" />
              {L({ en: 'Filter:', fr: 'Filtrer:' })}
            </div>
            {[{ id: undefined, nameEn: 'All', nameFr: 'Tous' }, ...(categories || [])].map((cat) => {
              const active = (!selectedCategory && cat.id === undefined) || selectedCategory === cat.id;
              return (
                <motion.button key={cat.id ?? 'all'} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                      : 'bg-white/50 text-foreground border-border/50 hover:bg-white/90 hover:border-border hover:text-primary'
                  }`}>
                  {L({ en: cat.nameEn, fr: cat.nameFr })}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PRODUCTS GRID ────────────────────────────────────────────────────── */}
      <section className="bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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

          {isError && (
            <motion.div variants={fadeInUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-24 gap-4">
              <AlertCircle className="h-14 w-14 text-destructive/40" />
              <p className="text-muted-foreground font-medium">{L({ en: 'Unable to load products', fr: 'Impossible de charger les produits' })}</p>
              <Button variant="outline" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {L({ en: 'Retry', fr: 'Réessayer' })}
              </Button>
            </motion.div>
          )}

          {!isLoading && !isError && !products?.length && (
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

          {!isLoading && !isError && products && products.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory ?? 'all'}-${debouncedSearch}`}
                variants={stagger} initial="hidden" animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <motion.div key={product.id} variants={scaleIn}
                    whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      <div className="aspect-[4/3] relative bg-white overflow-hidden">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={L({ en: product.nameEn, fr: product.nameFr })} fill
                            className="object-contain p-2" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Package className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        {product.categoryName && (
                          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold rounded-full px-2 py-0.5 mb-2 w-fit">
                            {product.categoryName}
                          </span>
                        )}
                        <h3 className="font-bold text-sm leading-tight mb-3 group-hover:text-primary transition-colors flex-1">
                          {L({ en: product.nameEn, fr: product.nameFr })}
                        </h3>
                        <Button asChild size="sm" className="w-full">
                          <Link href={`/products/${product.slug}`}>
                            {L({ en: 'View Details', fr: 'Voir les Détails' })}
                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
