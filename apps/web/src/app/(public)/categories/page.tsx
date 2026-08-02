'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function CategoriesPage() {
  const { L } = useLanguage();
  const { data: categories, isLoading } = useQuery<any[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/api/categories'),
  });

  return (
    <>
      <section className="relative bg-sidebar py-3 sm:py-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">{L({ en: 'Industrial Catalog', fr: 'Catalogue Industriel' })}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-sidebar-foreground mb-6">{L({ en: 'Product Categories', fr: 'Catégories de Produits' })}</h1>
          <p className="text-base sm:text-lg md:text-xl text-sidebar-foreground/80 max-w-2xl mx-auto">
            {L({ en: 'Browse our comprehensive catalog of industrial products and materials.', fr: 'Parcourez notre catalogue complet de produits et matériaux industriels.' })}
          </p>
        </div>
      </section>

      <section className="bg-background py-3 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-56 sm:h-64 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {categories?.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="group relative h-64 rounded-xl overflow-hidden">
                  {cat.imageUrl && (
                    <Image src={cat.imageUrl} alt={L({ en: cat.nameEn, fr: cat.nameFr })} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="inline-block bg-white/20 text-white text-xs rounded-full px-2.5 py-1 mb-2 w-fit">
                      {cat.productCount} {L({ en: 'products', fr: 'produits' })}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-1">{L({ en: cat.nameEn, fr: cat.nameFr })}</h3>
                    {(cat.descriptionEn || cat.descriptionFr) && (
                      <p className="text-white/70 text-sm line-clamp-2 mb-3">{L({ en: cat.descriptionEn || '', fr: cat.descriptionFr || '' })}</p>
                    )}
                    <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                      {L({ en: 'View Products →', fr: 'Voir les Produits →' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

