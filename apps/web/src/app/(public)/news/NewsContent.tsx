'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Newspaper, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { fadeInUp, scaleIn, stagger, viewportOnce } from '@/components/motion/variants';

export default function NewsPage() {
  const { L } = useLanguage();
  const { data: articles, isLoading } = useQuery<any[]>({
    queryKey: ['news'],
    queryFn: () => api.get('/api/news'),
  });

  const [featured, ...rest] = articles || [];

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[36vh] min-h-[260px] overflow-hidden bg-sidebar flex items-center">
        <Image src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&auto=format&fit=crop&q=50" alt="" fill className="object-cover object-center opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/95 via-sidebar/65 to-sidebar/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar/90 via-sidebar/25 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2.5 mb-3">
            <span className="w-6 h-px bg-primary flex-shrink-0" />
            <span className="text-primary font-display font-semibold text-[11px] uppercase tracking-[0.3em]">
              {L({ en: 'News & Insights', fr: 'Actualités & Analyses' })}
            </span>
          </motion.div>
          <h1 className="font-display font-extrabold text-section text-sidebar-foreground leading-[0.88] tracking-[-0.02em] mb-3">
            {L({ en: 'Industry News & Updates', fr: 'Actualités & Mises à Jour' }).split(' ').map((word, wi) => (
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
            {L({ en: 'Stay informed with the latest developments in global logistics, trade, and industrial supply.', fr: 'Restez informé des dernières évolutions en logistique mondiale, commerce et fournitures industrielles.' })}
          </motion.p>
        </div>

      </section>

      {/* ── ARTICLES ────────────────────────────────────────────────────────── */}
      <section className="bg-background py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading */}
          {isLoading && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-border">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="border border-border rounded-2xl p-5 space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !articles?.length && (
            <motion.div variants={fadeInUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div className="w-14 h-14 rounded-xl bg-foreground flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground">
                {L({ en: 'No news articles available yet.', fr: 'Aucun article disponible pour le moment.' })}
              </p>
            </motion.div>
          )}

          {/* Articles */}
          {!isLoading && articles && articles.length > 0 && (
            <AnimatePresence>
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-10">

                {/* Featured + sidebar layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                  {/* Featured */}
                  {featured && (
                    <motion.article variants={scaleIn}
                      className="lg:col-span-3 group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col">
                      {featured.imageUrl && (
                        <div className="aspect-video relative overflow-hidden">
                          <Image src={featured.imageUrl} alt={L({ en: featured.titleEn, fr: featured.titleFr })} fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary text-primary-foreground text-xs font-display font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full">
                              {L({ en: 'Featured', fr: 'À la Une' })}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {featured.category && (
                            <span className="bg-primary/10 text-primary text-xs font-semibold rounded-full px-2.5 py-0.5">
                              {featured.category}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(featured.publishedAt), 'dd MMM yyyy')}
                          </span>
                        </div>
                        <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-3 group-hover:text-primary transition-colors leading-tight flex-1">
                          {L({ en: featured.titleEn, fr: featured.titleFr })}
                        </h2>
                        {(featured.summaryEn || featured.summaryFr) && (
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                            {L({ en: featured.summaryEn || '', fr: featured.summaryFr || '' })}
                          </p>
                        )}
                        <Link href={`/news/${featured.id}`}
                          className="inline-flex items-center gap-1.5 text-primary text-sm font-display font-semibold hover:gap-2.5 transition-all duration-200">
                          {L({ en: 'Read Article', fr: 'Lire l\'Article' })}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </motion.article>
                  )}

                  {/* Sidebar articles */}
                  {rest.length > 0 && (
                    <div className="lg:col-span-2 space-y-4">
                      {rest.slice(0, 4).map((article) => (
                        <motion.article key={article.id} variants={fadeInUp}
                          className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-200 flex gap-0">
                          {article.imageUrl && (
                            <div className="w-24 sm:w-28 relative flex-shrink-0 overflow-hidden">
                              <Image src={article.imageUrl} alt={L({ en: article.titleEn, fr: article.titleFr })} fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                          )}
                          <div className="p-4 flex flex-col justify-center flex-1">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(article.publishedAt), 'dd MMM yyyy')}
                            </span>
                            <h2 className="font-display font-bold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {L({ en: article.titleEn, fr: article.titleFr })}
                            </h2>
                            <Link href={`/news/${article.id}`}
                              className="inline-flex items-center gap-1 text-primary text-xs font-semibold hover:gap-1.5 transition-all duration-200">
                              {L({ en: 'Read', fr: 'Lire' })}
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remaining grid */}
                {rest.length > 4 && (
                  <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-border">
                    {rest.slice(4).map((article) => (
                      <motion.article key={article.id} variants={scaleIn}
                        className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col">
                        {article.imageUrl && (
                          <div className="aspect-video relative overflow-hidden">
                            <Image src={article.imageUrl} alt={L({ en: article.titleEn, fr: article.titleFr })} fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            {article.category && (
                              <span className="bg-primary/10 text-primary text-xs font-semibold rounded-full px-2 py-0.5">
                                {article.category}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(article.publishedAt), 'dd MMM yyyy')}
                            </span>
                          </div>
                          <h2 className="font-display font-bold text-base leading-tight mb-3 group-hover:text-primary transition-colors flex-1">
                            {L({ en: article.titleEn, fr: article.titleFr })}
                          </h2>
                          <Link href={`/news/${article.id}`}
                            className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all duration-200 mt-auto">
                            {L({ en: 'Read More', fr: 'Lire la Suite' })}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </>
  );
}
