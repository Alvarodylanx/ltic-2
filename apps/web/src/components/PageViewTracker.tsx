'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId(): string {
  const key = 'ltic_sid';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const sessionId = getSessionId();
      fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pathname, sessionId }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // never crash the page
    }
  }, [pathname]);

  return null;
}
