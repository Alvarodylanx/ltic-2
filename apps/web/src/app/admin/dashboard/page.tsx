'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Package, FileText, Truck, MessageSquare, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  responded: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

export default function DashboardPage() {
  const { L } = useLanguage();
  const { data: stats, isLoading, isError } = useQuery<any>({
    queryKey: ['stats', 'dashboard'],
    queryFn: () => api.get('/api/stats/dashboard'),
    retry: 2,
  });

  const statCards = [
    { label: L({ en: 'Total Products', fr: 'Produits totaux' }), icon: Package, value: stats?.totalProducts, color: 'text-foreground' },
    { label: L({ en: 'Pending Quotes', fr: 'Devis en attente' }), icon: FileText, value: stats?.pendingQuotes, color: 'text-primary' },
    { label: L({ en: 'Active Orders', fr: 'Commandes actives' }), icon: Truck, value: stats?.activeOrders, color: 'text-foreground' },
    { label: L({ en: 'Unread Inquiries', fr: 'Messages non lus' }), icon: MessageSquare, value: stats?.unreadContacts, color: 'text-primary' },
  ];

  if (isError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="font-semibold">{L({ en: 'Failed to load dashboard data', fr: 'Impossible de charger le tableau de bord' })}</p>
        <p className="text-sm text-muted-foreground">{L({ en: 'Check your connection and refresh the page.', fr: 'Vérifiez votre connexion et actualisez la page.' })}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">{L({ en: 'Dashboard', fr: 'Tableau de bord' })}</h1>
        <p className="text-muted-foreground mt-1">{L({ en: 'Overview of your LTIC SARL operations', fr: 'Aperçu de vos opérations LTIC SARL' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map(({ label, icon: Icon, value, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <p className={`text-3xl font-bold ${color}`}>{value ?? 0}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quotes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">{L({ en: 'Recent Quotes', fr: 'Devis récents' })}</CardTitle>
            <Link href="/admin/quotes" className="text-xs text-primary hover:underline font-medium">
              {L({ en: 'View all', fr: 'Voir tout' })}
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <div className="space-y-1">
                {stats?.recentQuotes?.map((quote: any) => (
                  <Link
                    key={quote.id}
                    href="/admin/quotes"
                    className="flex items-center justify-between py-2.5 px-2 rounded-md -mx-2 border-b last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{quote.companyName}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(quote.createdAt), 'dd MMM yyyy')}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[quote.status] || 'bg-gray-100 text-gray-700'}`}>
                      {quote.status}
                    </span>
                  </Link>
                )) || <p className="text-muted-foreground text-sm">{L({ en: 'No quotes yet', fr: 'Aucun devis pour l\'instant' })}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">{L({ en: 'Recent Contacts', fr: 'Contacts récents' })}</CardTitle>
            <Link href="/admin/contacts" className="text-xs text-primary hover:underline font-medium">
              {L({ en: 'View all', fr: 'Voir tout' })}
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <div className="space-y-1">
                {stats?.recentContacts?.map((contact: any) => (
                  <Link
                    key={contact.id}
                    href="/admin/contacts"
                    className="flex items-center justify-between py-2.5 px-2 rounded-md -mx-2 border-b last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{format(new Date(contact.createdAt), 'dd MMM')}</span>
                      {!contact.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </Link>
                )) || <p className="text-muted-foreground text-sm">{L({ en: 'No contacts yet', fr: 'Aucun contact pour l\'instant' })}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
