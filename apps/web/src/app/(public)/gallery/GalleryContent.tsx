'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { X, ChevronLeft, ChevronRight, Images, Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { fadeInUp, viewportOnce } from '@/components/motion/variants';

type GalleryItem = {
  id: number;
  titleEn?: string | null;
  titleFr?: string | null;
  category?: string | null;
  mediaUrl: string;
  mediaType: string;
  published: boolean;
};

function isYouTube(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/shorts\/))([^?&/\s]+)/);
  return m ? m[1] : '';
}

function VideoThumb({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const handleLoaded = () => { if (ref.current) ref.current.currentTime = 0.5; };
  const handleEnter = () => ref.current?.play();
  const handleLeave = () => {
    if (ref.current) { ref.current.pause(); ref.current.currentTime = 0.5; }
  };
  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="metadata"
      onLoadedMetadata={handleLoaded}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={className}
    />
  );
}

export default function GalleryContent() {
  const { L } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: items, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['gallery'],
    queryFn: () => api.get('/api/gallery'),
  });

  const categories = [
    'All',
    ...Array.from(new Set((items || []).map((i) => i.category).filter(Boolean))) as string[],
  ];

  const filtered =
    activeCategory === 'All'
      ? (items || [])
      : (items || []).filter((i) => i.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative -mt-[54px] lg:-mt-[80px] h-[calc(22vh+54px)] sm:h-[calc(30vh+54px)] lg:h-[calc(30vh+80px)] min-h-[200px] sm:min-h-[250px] lg:min-h-[280px] overflow-hidden bg-black">
        <Image src="/uploads/media/gallery-photo-030.jpg" alt="" fill sizes="100vw" className="object-cover object-top" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        <div className="relative z-10 h-full flex items-center pt-[60px] sm:pt-[70px] lg:pt-[100px]">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex items-center justify-center gap-2.5 mb-5"
            >
              <span className="w-6 h-px bg-primary flex-shrink-0" />
              <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.3em]">
                {L({ en: 'Media Gallery', fr: 'Galerie Média' })}
              </span>
              <span className="w-6 h-px bg-primary flex-shrink-0" />
            </motion.div>
            <h1 className="font-display font-extrabold text-section text-white leading-[0.88] tracking-[-0.02em] mb-6">
              {L({ en: 'Our Work in Pictures', fr: 'Nos Activités en Images' }).split(' ').map((word, wi) => (
                <span key={wi} className="inline-block overflow-hidden mr-[0.18em] last:mr-0">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '112%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1], delay: 0.1 + wi * 0.08 }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.55 }}
              className="text-white/75 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            >
              {L({
                en: 'A visual journey through our timber operations, international trade partnerships, and the people who drive LTIC SARL forward every day.',
                fr: 'Un voyage visuel à travers nos opérations bois, nos partenariats commerciaux internationaux et les personnes qui font avancer LTIC SARL chaque jour.',
              })}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────── */}
      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category filter pills */}
          {!isLoading && categories.length > 1 && (
            <motion.div
              variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="flex flex-wrap gap-2 mb-8 sm:mb-10"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {cat === 'All' ? L({ en: 'All', fr: 'Tout' }) : cat}
                </button>
              ))}
            </motion.div>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="break-inside-avoid mb-3 sm:mb-4">
                  <Skeleton
                    className={`w-full rounded-2xl ${
                      i % 3 === 0 ? 'aspect-square' : i % 3 === 1 ? 'aspect-[4/3]' : 'aspect-[3/4]'
                    }`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <motion.div
              variants={fadeInUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-24 gap-5 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                <Images className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground">
                {L({ en: 'No media items yet.', fr: 'Aucun média pour le moment.' })}
              </p>
            </motion.div>
          )}

          {/* Masonry grid */}
          {!isLoading && filtered.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4"
              >
                {filtered.map((item, idx) => {
                  const isVideo = item.mediaType === 'video';
                  const isYT = isVideo && isYouTube(item.mediaUrl);
                  const thumbSrc = isYT
                    ? `https://img.youtube.com/vi/${getYouTubeId(item.mediaUrl)}/hqdefault.jpg`
                    : item.mediaUrl;
                  const title = L({ en: item.titleEn || '', fr: item.titleFr || '' });

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.4) }}
                      className="break-inside-avoid mb-3 sm:mb-4"
                    >
                      <button
                        onClick={() => openLightbox(idx)}
                        className="group relative w-full overflow-hidden rounded-2xl block text-left
                                   focus-visible:ring-2 focus-visible:ring-primary outline-none"
                      >
                        {isVideo && !isYT ? (
                          <VideoThumb
                            src={item.mediaUrl}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <Image
                            src={thumbSrc || '/images/hero-slide-2.jpg'}
                            alt={title || item.category || ''}
                            width={800}
                            height={600}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

                        {/* Play button for videos */}
                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center
                                            shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Play className="h-5 w-5 text-primary fill-primary ml-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Caption on hover */}
                        {(title || item.category) && (
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4
                                          bg-gradient-to-t from-black/70 to-transparent
                                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {title && <p className="text-white text-sm font-semibold line-clamp-2">{title}</p>}
                            {item.category && <p className="text-white/70 text-xs mt-0.5">{item.category}</p>}
                          </div>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {current && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full
                           bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Next */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full
                           bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Media */}
            <motion.div
              key={current.id}
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="max-w-5xl w-full flex flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {current.mediaType === 'video' ? (
                isYouTube(current.mediaUrl) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(current.mediaUrl)}?autoplay=1`}
                    className="w-full aspect-video rounded-xl"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={current.mediaUrl}
                    controls
                    autoPlay
                    className="max-h-[75vh] max-w-full rounded-xl"
                  />
                )
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={current.mediaUrl}
                  alt={L({ en: current.titleEn || '', fr: current.titleFr || '' })}
                  className="max-h-[75vh] max-w-full object-contain rounded-xl"
                />
              )}

              {(current.titleEn || current.titleFr || current.category) && (
                <div className="text-center">
                  {(current.titleEn || current.titleFr) && (
                    <p className="text-white font-semibold">
                      {L({ en: current.titleEn || '', fr: current.titleFr || '' })}
                    </p>
                  )}
                  {current.category && (
                    <p className="text-white/60 text-sm mt-0.5">{current.category}</p>
                  )}
                </div>
              )}

              <p className="text-white/40 text-xs">{lightboxIndex + 1} / {filtered.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
