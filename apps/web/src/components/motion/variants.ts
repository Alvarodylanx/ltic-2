// ─── Global Motion Variants ───────────────────────────────────────────────────
// Distances are intentionally modest (24–48 px) so elements feel like they
// "arrive" rather than "fly in". Spring damping ≥ 18 keeps oscillation off.
// viewportOnce.once: true — animations play once and stay; re-triggering on
// scroll-back is a UX anti-pattern that feels broken.

export const fadeInUp = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1,
            transition: { type: 'spring', stiffness: 90, damping: 22 } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -24, scale: 0.98 },
  show:   { opacity: 1, y: 0,   scale: 1,
            transition: { type: 'spring', stiffness: 90, damping: 22 } },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -48, scale: 0.97 },
  show:   { opacity: 1, x: 0,   scale: 1,
            transition: { type: 'spring', stiffness: 85, damping: 20 } },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 48,  scale: 0.97 },
  show:   { opacity: 1, x: 0,   scale: 1,
            transition: { type: 'spring', stiffness: 85, damping: 20 } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.82, y: 24 },
  show:   { opacity: 1, scale: 1,    y: 0,
            transition: { type: 'spring', stiffness: 130, damping: 18 } },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.70 },
  show:   { opacity: 1, scale: 1,
            transition: { type: 'spring', stiffness: 220, damping: 16 } },
};

export const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

export const staggerFast = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
};

// once: true — play once when entering the viewport; never re-trigger on scroll-back.
// amount: 0.12 — 12% of the element must be visible before the animation fires,
//               so elements don't animate while mostly hidden.
export const viewportOnce = { once: true, amount: 0.12 };
