'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Tag, FileText, Truck, Newspaper,
  MessageSquare, Settings, LogOut, ShieldAlert, UserCircle,
  Globe, Bell, X, Handshake, Tv2, Images,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { checkAuth, logout } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminProfile } from '@/contexts/AdminProfileContext';
import { api } from '@/lib/api';

const NAV = [
  { href: '/admin/dashboard',     icon: LayoutDashboard, label: { en: 'Dashboard',  fr: 'Tableau de bord' } },
  { href: '/admin/products',      icon: Package,         label: { en: 'Products',   fr: 'Produits' } },
  { href: '/admin/categories',    icon: Tag,             label: { en: 'Categories', fr: 'Catégories' } },
  { href: '/admin/quotes',        icon: FileText,        label: { en: 'Quotes',     fr: 'Devis' } },
  { href: '/admin/orders',        icon: Truck,           label: { en: 'Orders',     fr: 'Commandes' } },
  { href: '/admin/news',          icon: Newspaper,       label: { en: 'News',       fr: 'Actualités' } },
  { href: '/admin/gallery',       icon: Images,          label: { en: 'Gallery',    fr: 'Galerie' } },
  { href: '/admin/spotlight',     icon: Tv2,             label: { en: 'Spotlight',  fr: 'Vitrine' } },
  { href: '/admin/contacts',      icon: MessageSquare,   label: { en: 'Contacts',   fr: 'Contacts' } },
  { href: '/admin/partners',      icon: Handshake,       label: { en: 'Partners',   fr: 'Partenaires' } },
  { href: '/admin/settings',      icon: Settings,        label: { en: 'Settings',   fr: 'Paramètres' } },
  { href: '/admin/profile',       icon: UserCircle,      label: { en: 'My Profile', fr: 'Mon profil' } },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [avatarError, setAvatarError] = useState(false);
  const [unread, setUnread] = useState(0);
  const { language, setLanguage, L } = useLanguage();
  const { profile } = useAdminProfile();

  const username = profile?.name || '';
  const avatarUrl = profile?.avatarUrl || null;

  useEffect(() => {
    checkAuth().then((res) => {
      if (!res.authenticated) router.push('/auth/login?redirect=/admin/dashboard');
    });
  }, [router]);

  useEffect(() => { setAvatarError(false); }, [avatarUrl]);

  useEffect(() => {
    const fetchCount = () =>
      api.get('/api/notifications/unread-count')
        .then((d: any) => setUnread(d.count ?? 0))
        .catch(() => {});

    fetchCount();

    const es = new EventSource('/api/notifications/stream', { withCredentials: true });
    es.onmessage = () => { setUnread((n) => n + 1); };
    es.onerror = () => { es.close(); };

    const fallback = setInterval(fetchCount, 60_000);
    return () => {
      es.close();
      clearInterval(fallback);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="w-64 min-h-screen h-full bg-sidebar text-sidebar-foreground flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <span className="font-bold">LTIC SARL</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-sidebar-accent/50 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-sidebar-foreground/60">{L({ en: 'Admin Panel', fr: 'Panneau admin' })}</p>
        {username && (
          <div className="flex items-center gap-2 mt-3">
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt={username}
                onError={() => setAvatarError(true)}
                className="h-8 w-8 rounded-full object-cover shrink-0 border border-sidebar-border"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-sidebar-border">
                <span className="text-xs font-bold text-primary">{username.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{username}</p>
              <p className="text-[10px] text-sidebar-foreground/50">{L({ en: 'Administrator', fr: 'Administrateur' })}</p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
            )}
          >
            <Icon className="h-4 w-4" />
            {L(label)}
          </Link>
        ))}

        {/* Notifications link with badge */}
        <Link
          href="/admin/notifications"
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
            pathname === '/admin/notifications'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
          )}
        >
          <Bell className="h-4 w-4" />
          <span className="flex-1">{L({ en: 'Notifications', fr: 'Notifications' })}</span>
          {unread > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </Link>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full"
        >
          <Globe className="h-4 w-4" />
          <span>{language === 'en' ? 'English' : 'Français'}</span>
          <span className="ml-auto text-xs bg-sidebar-accent/60 px-1.5 py-0.5 rounded font-semibold">
            {language.toUpperCase()}
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          {L({ en: 'Logout', fr: 'Déconnexion' })}
        </button>
      </div>
    </div>
  );
}
