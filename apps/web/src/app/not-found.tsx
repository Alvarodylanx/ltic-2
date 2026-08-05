import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Package, Phone, Newspaper, Info } from 'lucide-react';

const navLinks = [
  { href: '/',         label: 'Home',     icon: Home },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/about',    label: 'About',    icon: Info },
  { href: '/news',     label: 'News',     icon: Newspaper },
  { href: '/contact',  label: 'Contact',  icon: Phone },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">LTIC</span>
          <span>SARL</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </Link>
          ))}
        </nav>
      </header>

      {/* 404 content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for does not exist or has been moved.
          </p>

          <Button asChild className="mb-10">
            <Link href="/">Back to Home</Link>
          </Button>

          {/* Quick nav for mobile */}
          <div className="sm:hidden grid grid-cols-2 gap-3 mt-6">
            {navLinks.slice(1).map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-sm hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Simple footer */}
      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LTIC SARL. All rights reserved.
      </footer>
    </div>
  );
}
