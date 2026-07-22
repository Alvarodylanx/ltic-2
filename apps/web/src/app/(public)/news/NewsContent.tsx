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
      {/* ── PAGE HEADER ─────────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-32 flex flex-col justify-center">
            <motion.div variants={fadeInUp} className="w-10 h-0.5 bg-primary mb-8" />
            <motion.p variants={fadeInUp}
              className="text-primary font-display font-bold text-xs uppercase tracking-[0.3em] mb-4">
              {L({ en: 'News & Insights', fr: 'Actualités & Analyses' })}
            </motion.p>
            <motion.h1 variants={fadeInUp}
              className="font-display font-extrabold text-section text-foreground leading-none mb-6">
              {L({ en: 'Industry\nUpdates', fr: 'Actualités\ndu Secteur' })}
            </motion.h1>
            <motion.p variants={fadeInUp}
              className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg">
              {L({ en: 'Stay informed with the latest developments in global logistics, trade, and industrial supply.', fr: 'Restez informé des dernières évolutions en logistique mondiale, commerce et fournitures industrielles.' })}
            </motion.p>
          </motion.div>

          <motion.div
            variants={scaleIn} initial="hidden" animate="show"
            className="relative h-72 lg:h-auto min-h-[360px] hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&auto=format&fit=crop&q=70"
              alt="News" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-foreground/25" />
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────────── */}
      <section className="bg-background py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading state */}
          {isLoading && (
            <div className="space-y-12">
              {/* Featured skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border">
                <Skeleton className="h-72 lg:h-96" />
                <div className="p-8 space-y-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="border border-border">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !articles?.length && (
            <motion.div variants={fadeInUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-28 gap-6 text-center">
              <div className="w-20 h-20 border border-border flex items-center justify-center">
                <Newspaper className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-display font-extrabold text-xl mb-2">
                  {L({ en: 'No Articles Yet', fr: 'Aucun Article' })}
                </p>
                <p className="text-muted-foreground text-sm">
                  {L({ en: 'Check back soon for news and industry insights.', fr: 'Revenez bientôt pour des actualités et analyses sectorielles.' })}
                </p>
              </div>
            </motion.div>
          )}

          {/* Articles */}
          {!isLoading && articles && articles.length > 0 && (
            <AnimatePresence>
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-12">

                {/* Featured article — large editorial card */}
                {featured && (
                  <motion.article variants={fadeInUp}
                    className="group grid grid-cols-1 lg:grid-cols-2 border border-border overflow-hidden hover:border-primary/50 transition-colors duration-300">
                    <div className="relative h-72 lg:h-auto min-h-[320px] overflow-hidden">
                      {featured.imageUrl ? (
                        <Image
                          src={featured.imageUrl}
                          alt={L({ en: featured.titleEn, fr: featured.titleFr })} fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Newspaper className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-primary-foreground text-xs font-display font-bold uppercase tracking-[0.2em] px-3 py-1.5">
                          {L({ en: 'Featured', fr: 'À la une' })}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-5">
                        {featured.category && (
                          <span className="border border-primary text-primary text-xs font-display font-bold uppercase tracking-[0.15em] px-2.5 py-1">
                            {featured.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(featured.publishedAt), 'dd MMM yyyy')}
                        </span>
                      </div>
                      <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight tracking-tight mb-4 group-hover:text-primary transition-colors duration-200">
                        {L({ en: featured.titleEn, fr: featured.titleFr })}
                      </h2>
                      {(featured.summaryEn || featured.summaryFr) && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                          {L({ en: featured.summaryEn || '', fr: featured.summaryFr || '' })}
                        </p>
                      )}
                      <Link href={`/news/${featured.id}`}
                        className="inline-flex items-center gap-2 text-primary font-display font-bold text-sm uppercase tracking-[0.2em] hover:gap-3 transition-all duration-200">
                        {L({ en: 'Read Article', fr: 'Lire l\'Article' })}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.article>
                )}

                {/* Rest of articles — 3-col grid */}
                {rest.length > 0 && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-0.5 bg-primary flex-shrink-0" />
                      <p className="text-muted-foreground text-xs uppercase tracking-[0.25em] font-display font-bold">
                        {L({ en: 'More Articles', fr: 'Plus d\'Articles' })}
                      </p>
                    </div>

                    <motion.div
                      variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {rest.map((article) => (
                        <motion.article key={article.id} variants={scaleIn}
                          className="group border border-border overflow-hidden hover:border-primary/50 transition-colors duration-300 flex flex-col">
                          {article.imageUrl && (
                            <div className="aspect-video relative overflow-hidden flex-shrink-0">
                              <Image
                                src={article.imageUrl}
                                alt={L({ en: article.titleEn, fr: article.titleFr })} fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                          )}
                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2.5 mb-3">
                              {article.category && (
                                <span className="border border-border text-muted-foreground text-xs font-display font-semibold uppercase tracking-[0.1em] px-2 py-0.5">
                                  {article.category}
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(article.publishedAt), 'dd MMM yyyy')}
                              </span>
                            </div>
                            <h2 className="font-display font-extrabold text-base leading-tight mb-3 group-hover:text-primary transition-colors duration-200 flex-1">
                              {L({ en: article.titleEn, fr: article.titleFr })}
                            </h2>
                            <Link href={`/news/${article.id}`}
                              className="inline-flex items-center gap-1.5 text-primary text-xs font-display font-bold uppercase tracking-[0.2em] hover:gap-2.5 transition-all duration-200 mt-auto">
                              {L({ en: 'Read', fr: 'Lire' })}
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </motion.article>
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
