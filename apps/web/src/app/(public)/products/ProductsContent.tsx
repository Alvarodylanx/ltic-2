'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Package, ArrowRight, AlertCircle, RefreshCw, Search, X } from 'lucide-react';
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
      {/* ── PAGE HEADER ─────────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-28 flex flex-col justify-center">
            <motion.div variants={fadeInUp} className="w-10 h-0.5 bg-primary mb-8" />
            <motion.p variants={fadeInUp}
              className="text-primary font-display font-bold text-xs uppercase tracking-[0.3em] mb-4">
              {L({ en: 'Industrial Catalog', fr: 'Catalogue Industriel' })}
            </motion.p>
            <motion.h1 variants={fadeInUp}
              className="font-display font-extrabold text-section text-foreground leading-none mb-6">
              {L({ en: 'Our\nProducts', fr: 'Nos\nProduits' })}
            </motion.h1>
            <motion.p variants={fadeInUp}
              className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg">
              {L({ en: 'Premium certified industrial equipment, supplies, and materials — sourced globally, delivered reliably.', fr: 'Équipements industriels certifiés premium, fournitures et matériaux — approvisionnés mondialement, livrés de façon fiable.' })}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-72 lg:h-auto min-h-[360px] hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&auto=format&fit=crop&q=70"
              alt="Products" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-foreground/20" />
          </motion.div>
        </div>
      </section>

      {/* ── FILTER BAR ──────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={L({ en: 'Search products…', fr: 'Rechercher…' })}
              className="pl-9 pr-8 h-9 text-sm rounded-none border-border"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[{ id: undefined, nameEn: 'All', nameFr: 'Tous' }, ...(categories || [])].map((cat) => {
              const active = (!selectedCategory && cat.id === undefined) || selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id ?? 'all'}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-display font-bold uppercase tracking-[0.15em] border transition-all duration-150 ${
                    active
                      ? 'bg-foreground text-sidebar-foreground border-foreground'
                      : 'bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border border-border">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="border-r border-b border-border">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <motion.div variants={fadeInUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-24 gap-5">
              <div className="w-16 h-16 border border-destructive/40 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-destructive/60" />
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-base mb-1">
                  {L({ en: 'Unable to load products', fr: 'Impossible de charger les produits' })}
                </p>
                <p className="text-muted-foreground text-sm">
                  {L({ en: 'Please check your connection and try again.', fr: 'Veuillez vérifier votre connexion et réessayer.' })}
                </p>
              </div>
              <Button variant="outline" onClick={() => refetch()} className="gap-2 rounded-none">
                <RefreshCw className="h-4 w-4" />
                {L({ en: 'Retry', fr: 'Réessayer' })}
              </Button>
            </motion.div>
          )}

          {!isLoading && !isError && !products?.length && (
            <motion.div variants={fadeInUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div className="w-16 h-16 border border-border flex items-center justify-center">
                <Package className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-display font-bold text-base mb-1">
                  {debouncedSearch
                    ? L({ en: `No products found for "${debouncedSearch}"`, fr: `Aucun produit pour "${debouncedSearch}"` })
                    : L({ en: 'No products in this category', fr: 'Aucun produit dans cette catégorie' })}
                </p>
                <p className="text-muted-foreground text-sm">
                  {L({ en: 'Try adjusting your filters', fr: 'Essayez d\'ajuster vos filtres' })}
                </p>
              </div>
              <Button variant="outline" onClick={() => { setSelectedCategory(undefined); setSearchInput(''); }}
                className="rounded-none">
                {L({ en: 'View All Products', fr: 'Voir Tous les Produits' })}
              </Button>
            </motion.div>
          )}

          {!isLoading && !isError && products && products.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory ?? 'all'}-${debouncedSearch}`}
                variants={stagger} initial="hidden" animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border overflow-hidden">
                {products.map((product) => (
                  <motion.div key={product.id} variants={scaleIn}
                    className="group bg-background hover:bg-foreground transition-colors duration-300">
                    <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={L({ en: product.nameEn, fr: product.nameFr })} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:opacity-40" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors duration-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {product.categoryName && (
                        <span className="inline-block border border-border group-hover:border-primary/30 text-muted-foreground group-hover:text-primary/70 text-xs font-display font-bold uppercase tracking-[0.12em] px-2 py-0.5 mb-3 transition-colors duration-300">
                          {product.categoryName}
                        </span>
                      )}
                      <h3 className="font-display font-bold text-sm leading-tight mb-4 group-hover:text-sidebar-foreground transition-colors duration-300">
                        {L({ en: product.nameEn, fr: product.nameFr })}
                      </h3>
                      <Link href={`/products/${product.slug}`}
                        className="inline-flex items-center gap-2 text-primary group-hover:text-primary text-xs font-display font-bold uppercase tracking-[0.2em] hover:gap-3 transition-all duration-200">
                        {L({ en: 'Details', fr: 'Détails' })}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
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
