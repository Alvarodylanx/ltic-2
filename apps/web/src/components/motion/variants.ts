const ease = [0.16, 1, 0.3, 1] as const; // expo-out — fast start, smooth settle

export const fadeInUp = {
  hidden: { opacity: 0, y: 48 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.65, ease } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease } },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.6, ease } },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.6, ease } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88, y: 24 },
  show:   { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.6, ease } },
};

export const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const staggerFast = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.03 } },
};

export const viewportOnce = { once: true, amount: 0.12 };
