'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = async () => {
    /* Arrow shoots upward, fades out, snaps back — then page scrolls */
    await controls.start({
      y: -18,
      opacity: 0,
      transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
    });
    controls.start({ y: 0, opacity: 1, transition: { duration: 0 } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleClick}
          aria-label="Back to top"
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40
                     w-11 h-11 rounded-full bg-primary text-primary-foreground
                     shadow-lg shadow-primary/30 flex items-center justify-center
                     hover:bg-primary/90 active:scale-95 overflow-hidden
                     transition-colors duration-200"
        >
          {/* Repeating upward arrows — top one exits, bottom one enters */}
          <motion.span
            animate={controls}
            className="flex flex-col items-center gap-[2px]"
          >
            <ArrowUp className="h-[18px] w-[18px] flex-shrink-0" />
          </motion.span>

          {/* Subtle upward-sweep shimmer on hover */}
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            initial={{ background: 'transparent' }}
            whileHover={{
              background: [
                'linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
                'linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 100%)',
                'linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
              ],
              transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
