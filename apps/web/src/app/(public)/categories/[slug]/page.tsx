'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { L } = useLanguage();

  const { data: categories } = useQuery<any[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/api/categories'),
  });

  const category = categories?.find((c) => c.slug === slug);

  const { data: products, isLoading } = useQuery<any[]>({
    queryKey: ['products', 'category', category?.id],
    queryFn: () => api.get(`/api/products?categoryId=${category!.id}`),
    enabled: !!category?.id,
  });

  return (
    <>
      <section className="relative bg-sidebar py-10 overflow-hidden">
        {category?.imageUrl && (
          <div className="absolute inset-0">
            <Image src={category.imageUrl} alt={category ? L({ en: category.nameEn, fr: category.nameFr }) : ''} fill className="object-cover opacity-10" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/categories" className="inline-flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {L({ en: 'All Categories', fr: 'Toutes les Catégories' })}
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-sidebar-foreground mb-4">
            {category ? L({ en: category.nameEn, fr: category.nameFr }) : ''}
          </h1>
          {category && (category.descriptionEn || category.descriptionFr) && (
            <p className="text-xl text-sidebar-foreground/80 max-w-2xl mx-auto">
              {L({ en: category.descriptionEn || '', fr: category.descriptionFr || '' })}
            </p>
          )}
        </div>
      </section>

      <section className="bg-background py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="border rounded-xl overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : !products?.length ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">{L({ en: 'No products in this category yet.', fr: 'Aucun produit dans cette catégorie pour le moment.' })}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group bg-card border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300">
                  <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                    {product.imageUrl && <Image src={product.imageUrl} alt={L({ en: product.nameEn, fr: product.nameFr })} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm group-hover:text-primary transition-colors mb-2">{L({ en: product.nameEn, fr: product.nameFr })}</h3>
                    <Button size="sm" className="w-full">{L({ en: 'View Details', fr: 'Voir les Détails' })}</Button>
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
