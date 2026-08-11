// ─── Global Motion Variants ───────────────────────────────────────────────────
// Springs: stiffness ≥ 140 settles in < 400ms on 60fps. Lower values feel
// smooth on desktop but cause prolonged GPU work on mobile chipsets.

export const fadeInUp = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,
            transition: { type: 'spring', stiffness: 160, damping: 28 } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20, scale: 0.98 },
  show:   { opacity: 1, y: 0,   scale: 1,
            transition: { type: 'spring', stiffness: 160, damping: 28 } },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -40, scale: 0.97 },
  show:   { opacity: 1, x: 0,   scale: 1,
            transition: { type: 'spring', stiffness: 150, damping: 26 } },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 40,  scale: 0.97 },
  show:   { opacity: 1, x: 0,   scale: 1,
            transition: { type: 'spring', stiffness: 150, damping: 26 } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.35 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.84, y: 20 },
  show:   { opacity: 1, scale: 1,    y: 0,
            transition: { type: 'spring', stiffness: 180, damping: 24 } },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.72 },
  show:   { opacity: 1, scale: 1,
            transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

export const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerFast = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};

// Mobile-safe variants — opacity-only tween, no spring physics, no stagger delay.
// Use these on mobile to avoid long-running spring computations on weak GPUs.
export const fadeM = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.22 } },
};

export const staggerM = {
  hidden: {},
  show:   {},
};

// once: true — play once when entering the viewport; never re-trigger on scroll-back.
// amount: 0.12 — 12% of the element must be visible before the animation fires,
//               so elements don't animate while mostly hidden.
export const viewportOnce = { once: true, amount: 0.12 };
