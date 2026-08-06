'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>();

  // Show bar on any internal link click — fires immediately, before React commits
  useEffect(() => {
    const show = () => {
      const bar = barRef.current;
      if (!bar) return;
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current!);
      bar.style.transition = 'none';
      bar.style.width = '0%';
      bar.style.opacity = '1';
      // Two rAFs: first resets width without transition, second animates to 70%
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          bar.style.transition = 'width 1.2s cubic-bezier(0.1, 0.6, 0.4, 1)';
          bar.style.width = '70%';
        });
      });
    };

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href === '#') return;
      if (href === pathname) return; // same page, no navigation
      show();
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname]);

  // Complete bar when pathname changes (navigation done)
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    cancelAnimationFrame(rafRef.current!);
    bar.style.transition = 'width 0.2s ease-out, opacity 0.3s ease-out 0.15s';
    bar.style.width = '100%';
    timerRef.current = setTimeout(() => {
      if (bar) bar.style.opacity = '0';
    }, 200);
    return () => clearTimeout(timerRef.current);
  }, [pathname]);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2px',
        width: '0%',
        opacity: 0,
        zIndex: 9999,
        background: 'hsl(var(--primary))',
        pointerEvents: 'none',
        borderRadius: '0 2px 2px 0',
        boxShadow: '0 0 6px hsl(var(--primary) / 0.6)',
      }}
    />
  );
}
