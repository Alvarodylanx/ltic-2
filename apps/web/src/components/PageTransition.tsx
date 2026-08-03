'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
        exit={{    opacity: 0, y: -10, filter: 'blur(2px)', transition: { duration: 0.22, ease: [0.55, 0, 1, 0.45] } }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
