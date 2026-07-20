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
import { fadeInUp, scaleIn, stagger, staggerFast, viewportOnce } from '@/components/motion/variants';

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
      {/* Hero */}
      <section className="relative bg-sidebar py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&auto=format&fit=crop&q=50"
            alt="Products" fill className="object-cover opacity-25" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-sidebar/60 to-sidebar/50" />
        </div>
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p variants={fadeInUp} className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">{L({ en: 'Industrial Catalog', fr: 'Catalogue Industriel' })}</motion.p>
          <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-sidebar-foreground mb-6">{L({ en: 'Our Products', fr: 'Nos Produits' })}</motion.h1>
          <motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-xl text-sidebar-foreground/80 max-w-2xl mx-auto">
            {L({ en: 'Premium certified industrial equipment, supplies, and materials — sourced globally, delivered reliably.', fr: 'Équipements industriels certifiés premium, fournitures et matériaux — approvisionnés mondialement, livrés de façon fiable.' })}
          </motion.p>
        </motion.div>
      </section>

      {/* Category filter + Search */}
      <div className="sticky top-16 z-40 bg-muted/40 border-b py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Search input */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={L({ en: 'Search products…', fr: 'Rechercher des produits…' })}
              className="pl-9 pr-8 h-9 text-sm"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {/* Category pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              {L({ en: 'Filter:', fr: 'Filtrer:' })}
            </div>
            {[{ id: undefined, nameEn: 'All', nameFr: 'Tous' }, ...(categories || [])].map((cat) => (
              <motion.button key={cat.id ?? 'all'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${(!selectedCategory && cat.id === undefined) || selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30'
                  : 'bg-background text-foreground hover:bg-primary/10 hover:text-primary border-border'}`}
              >
                {L({ en: cat.nameEn, fr: cat.nameFr })}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <section className="bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="border rounded-xl overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-full" /><Skeleton className="h-9 w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <motion.div variants={fadeInUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-24 gap-4">
              <AlertCircle className="h-16 w-16 text-destructive/40" />
              <p className="text-muted-foreground text-lg font-medium">{L({ en: 'Unable to load products', fr: 'Impossible de charger les produits' })}</p>
              <p className="text-muted-foreground/70 text-sm">{L({ en: 'Please check your connection and try again.', fr: 'Veuillez vérifier votre connexion et réessayer.' })}</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-2 gap-2">
                <RefreshCw className="h-4 w-4" />
                {L({ en: 'Retry', fr: 'Réessayer' })}
              </Button>
            </motion.div>
          ) : !products?.length ? (
            <motion.div variants={fadeInUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-24 gap-4">
              <Package className="h-16 w-16 text-muted-foreground/40" />
              <p className="text-muted-foreground text-lg">
                {debouncedSearch
                  ? L({ en: `No products found for "${debouncedSearch}"`, fr: `Aucun produit trouvé pour "${debouncedSearch}"` })
                  : L({ en: 'No products found in this category', fr: 'Aucun produit trouvé dans cette catégorie' })}
              </p>
              <Button variant="outline" onClick={() => { setSelectedCategory(undefined); setSearchInput(''); }}>
                {L({ en: 'View All Products', fr: 'Voir Tous les Produits' })}
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={`${selectedCategory ?? 'all'}-${debouncedSearch}`}
                variants={stagger} initial="hidden" animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <motion.div key={product.id} variants={scaleIn}
                    whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="group bg-card border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300 h-full flex flex-col">
                      <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={L({ en: product.nameEn, fr: product.nameFr })} fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        {product.categoryName && (
                          <span className="inline-block bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 mb-2 w-fit">
                            {product.categoryName}
                          </span>
                        )}
                        <h3 className="font-bold text-sm leading-tight mb-3 group-hover:text-primary transition-colors flex-1">
                          {L({ en: product.nameEn, fr: product.nameFr })}
                        </h3>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button asChild size="sm" className="w-full">
                            <Link href={`/products/${product.slug}`}>
                              {L({ en: 'View Details', fr: 'Voir les Détails' })}
                              <ArrowRight className="h-3.5 w-3.5 ml-1" />
                            </Link>
                          </Button>
                        </motion.div>
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


