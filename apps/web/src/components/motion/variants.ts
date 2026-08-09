const ease = [0.16, 1, 0.3, 1] as const;

export const fadeInUp = {
  hidden: { opacity: 0, y: 80,  scale: 0.90 },
  show:   { opacity: 1, y: 0,   scale: 1,
            transition: { type: 'spring', stiffness: 85, damping: 15 } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -55, scale: 0.95 },
  show:   { opacity: 1, y: 0,   scale: 1,
            transition: { type: 'spring', stiffness: 85, damping: 15 } },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -100, scale: 0.92 },
  show:   { opacity: 1, x: 0,    scale: 1,
            transition: { type: 'spring', stiffness: 80, damping: 15 } },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 100,  scale: 0.92 },
  show:   { opacity: 1, x: 0,    scale: 1,
            transition: { type: 'spring', stiffness: 80, damping: 15 } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.55 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.60, y: 60, rotate: -4 },
  show:   { opacity: 1, scale: 1,    y: 0,  rotate: 0,
            transition: { type: 'spring', stiffness: 130, damping: 13 } },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.45 },
  show:   { opacity: 1, scale: 1,
            transition: { type: 'spring', stiffness: 220, damping: 13 } },
};

export const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.14, delayChildren: 0.06 } },
};

export const staggerFast = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.03 } },
};

export const viewportOnce = { once: false, amount: 0.12 };
