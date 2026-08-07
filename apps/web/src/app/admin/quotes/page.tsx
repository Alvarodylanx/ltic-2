'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PackagePlus, Reply, AlertTriangle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  reviewed:  'bg-blue-100 text-blue-700',
  responded: 'bg-green-100 text-green-700',
  closed:    'bg-gray-100 text-gray-700',
};

const ORDER_STATUSES = [
  { value: 'processing',      en: 'Processing',      fr: 'En traitement' },
  { value: 'customs-cleared', en: 'Customs Cleared', fr: 'Dédouané' },
  { value: 'shipped',         en: 'Shipped',         fr: 'Expédié' },
  { value: 'in-transit',      en: 'In Transit',      fr: 'En transit' },
  { value: 'delivered',       en: 'Delivered',       fr: 'Livré' },
  { value: 'cancelled',       en: 'Cancelled',       fr: 'Annulé' },
];

const EMPTY_FORM = {
  clientName: '', clientEmail: '', customerId: 'none',
  origin: '', destination: '', description: '',
  status: 'processing', estimatedDelivery: '',
};

type OrderForm = typeof EMPTY_FORM;

export default function AdminQuotesPage() {
  const qc = useQueryClient();
  const { L } = useLanguage();

  const [convertQuote, setConvertQuote] = useState<any | null>(null);
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [replyQuote, setReplyQuote] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);

  const { data: quotes, isLoading } = useQuery<any[]>({
    queryKey: ['admin-quotes'],
    queryFn: () => api.get('/api/quotes?limit=100'),
  });

  const { data: allCustomers } = useQuery<any[]>({
    queryKey: ['admin-customers'],
    queryFn: () => api.get('/api/customers'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.patch(`/api/quotes/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-quotes'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/quotes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-quotes'] });
      toast.success(L({ en: 'Quote deleted', fr: 'Devis supprimé' }));
    },
    onError: () => toast.error(L({ en: 'Failed to delete quote', fr: 'Échec de la suppression' })),
  });

  function handleDelete(quote: any) {
    if (!confirm(L({ en: `Delete quote from ${quote.companyName}? This cannot be undone.`, fr: `Supprimer le devis de ${quote.companyName} ? Cette action est irréversible.` }))) return;
    deleteMutation.mutate(quote.id);
  }

  function openConvert(quote: any) {
    const description = [
      quote.productInterest,
      quote.quantity ? `Qty: ${quote.quantity}` : '',
      quote.companyName ? `(${quote.companyName})` : '',
    ].filter(Boolean).join(' — ');
    setForm({
      ...EMPTY_FORM,
      clientName: quote.contactName || quote.companyName || '',
      clientEmail: quote.email || '',
      description,
    });
    setConvertQuote(quote);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!convertQuote) return;
    setSubmitting(true);
    try {
      const body: any = {
        clientName:        form.clientName,
        clientEmail:       form.clientEmail || undefined,
        origin:            form.origin || undefined,
        destination:       form.destination || undefined,
        description:       form.description || undefined,
        status:            form.status,
        estimatedDelivery: form.estimatedDelivery || undefined,
        quoteId:           convertQuote.id,
      };
      if (form.customerId && form.customerId !== 'none') body.customerId = Number(form.customerId);

      await api.post('/api/orders', body);
      await api.patch(`/api/quotes/${convertQuote.id}`, { status: 'responded' });

      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-quotes'] });
      toast.success(L({ en: 'Order created — quote marked as Responded', fr: 'Commande créée — devis marqué Répondu' }));
      setConvertQuote(null);
      setForm(EMPTY_FORM);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('already exists') || err.status === 409) {
        toast.error(L({ en: 'An order already exists for this quote', fr: 'Une commande existe déjà pour ce devis' }));
      } else {
        toast.error(msg || L({ en: 'Failed to create order', fr: 'Échec de la création' }));
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyQuote || !replyMessage.trim()) return;
    setReplying(true);
    try {
      const result: any = await api.post(`/api/quotes/${replyQuote.id}/reply`, { message: replyMessage });
      if (result.sent) {
        toast.success(L({ en: 'Reply sent successfully', fr: 'Réponse envoyée avec succès' }));
        setReplyQuote(null);
        setReplyMessage('');
      } else {
        toast.warning(
          result.error === 'Email not configured on this server'
            ? L({ en: 'Email not configured — message not sent', fr: 'Email non configuré — message non envoyé' })
            : (result.error || L({ en: 'Failed to send email', fr: "Échec de l'envoi" }))
        );
      }
    } catch {
      toast.error(L({ en: 'Failed to send reply', fr: "Échec de l'envoi" }));
    } finally {
      setReplying(false);
    }
  }

  const headers = [
    L({ en: 'Date',             fr: 'Date' }),
    L({ en: 'Company',          fr: 'Entreprise' }),
    L({ en: 'Contact',          fr: 'Contact' }),
    L({ en: 'Email',            fr: 'E-mail' }),
    L({ en: 'Product Interest', fr: 'Produit souhaité' }),
    L({ en: 'Qty',              fr: 'Qté' }),
    L({ en: 'Status',           fr: 'Statut' }),
    '',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">{L({ en: 'Quote Requests', fr: 'Demandes de devis' })}</h1>
        <p className="text-muted-foreground mt-1">{L({ en: 'Manage incoming quote requests', fr: 'Gérez les demandes de devis entrantes' })}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-muted/50 border-b">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes?.map((quote) => (
                <tr key={quote.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{format(new Date(quote.createdAt), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-3 font-medium text-sm">{quote.companyName}</td>
                  <td className="px-4 py-3 text-sm">{quote.contactName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{quote.email}</td>
                  <td className="px-4 py-3 text-sm max-w-[160px] truncate">{quote.productInterest}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{quote.quantity || '—'}</td>
                  <td className="px-4 py-3">
                    <Select value={quote.status} onValueChange={(val) => updateStatusMutation.mutate({ id: quote.id, status: val })}>
                      <SelectTrigger className="h-8 text-xs w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{L({ en: 'Pending',   fr: 'En attente' })}</SelectItem>
                        <SelectItem value="reviewed">{L({ en: 'Reviewed',  fr: 'Examiné' })}</SelectItem>
                        <SelectItem value="responded">{L({ en: 'Responded', fr: 'Répondu' })}</SelectItem>
                        <SelectItem value="closed">{L({ en: 'Closed',    fr: 'Fermé' })}</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => { setReplyQuote(quote); setReplyMessage(''); }}
                        title={L({ en: 'Reply by email', fr: 'Répondre par email' })}
                      >
                        <Reply className="h-3.5 w-3.5" />
                        {L({ en: 'Reply', fr: 'Répondre' })}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`h-8 gap-1.5 text-xs whitespace-nowrap ${
                          quote.status === 'responded'
                            ? 'border-border text-muted-foreground'
                            : 'border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground'
                        }`}
                        onClick={() => openConvert(quote)}
                        title={quote.status === 'responded' ? L({ en: 'Already converted — will create a duplicate', fr: 'Déjà converti — créera un doublon' }) : undefined}
                      >
                        {quote.status === 'responded' && <AlertTriangle className="h-3 w-3" />}
                        {quote.status !== 'responded' && <PackagePlus className="h-3.5 w-3.5" />}
                        {L({ en: 'Convert', fr: 'Convertir' })}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(quote)}
                        title={L({ en: 'Delete quote', fr: 'Supprimer le devis' })}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!quotes?.length && (
            <p className="text-center text-muted-foreground py-12">{L({ en: 'No quote requests yet', fr: "Aucune demande de devis pour l'instant" })}</p>
          )}
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog open={!!replyQuote} onOpenChange={(open) => { if (!open) { setReplyQuote(null); setReplyMessage(''); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Reply className="h-4 w-4 text-primary" />
              {L({ en: 'Reply to Quote Request', fr: 'Répondre à la demande de devis' })}
            </DialogTitle>
          </DialogHeader>

          {replyQuote && (
            <div className="bg-muted/50 border rounded-lg px-4 py-3 text-xs text-muted-foreground">
              <p><span className="font-semibold text-foreground">{L({ en: 'To:', fr: 'À :' })}</span> {replyQuote.contactName} &lt;{replyQuote.email}&gt;</p>
              <p className="mt-1"><span className="font-semibold text-foreground">{L({ en: 'Re:', fr: 'Objet :' })}</span> {replyQuote.productInterest}</p>
            </div>
          )}

          <form onSubmit={handleReply} className="space-y-3">
            <div>
              <Label>{L({ en: 'Message', fr: 'Message' })} *</Label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={L({ en: 'Write your reply here…', fr: 'Écrivez votre réponse ici…' })}
                required
                rows={6}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setReplyQuote(null); setReplyMessage(''); }}>
                {L({ en: 'Cancel', fr: 'Annuler' })}
              </Button>
              <Button type="submit" disabled={replying || !replyMessage.trim()}>
                {replying
                  ? L({ en: 'Sending…', fr: 'Envoi…' })
                  : L({ en: 'Send Reply', fr: 'Envoyer la réponse' })}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Convert to Order Dialog */}
      <Dialog open={!!convertQuote} onOpenChange={(open) => { if (!open) { setConvertQuote(null); setForm(EMPTY_FORM); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-primary" />
              {L({ en: 'Create Order from Quote', fr: 'Créer une commande depuis le devis' })}
            </DialogTitle>
          </DialogHeader>

          {convertQuote?.status === 'responded' && (
            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-xs text-yellow-800">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>{L({ en: 'This quote was already responded to. Proceeding will attempt to create a new order — the server will block it if one already exists.', fr: 'Ce devis a déjà reçu une réponse. Continuer tentera de créer une commande — le serveur bloquera si une commande existe déjà.' })}</p>
            </div>
          )}

          {convertQuote && (
            <div className="bg-muted/50 border rounded-lg px-4 py-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{L({ en: 'Quote:', fr: 'Devis :' })}</span>{' '}
              {convertQuote.productInterest}{convertQuote.quantity ? ` × ${convertQuote.quantity}` : ''}{' '}
              — {convertQuote.companyName}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>{L({ en: 'Client Name', fr: 'Nom du client' })} *</Label>
                <Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="John Doe" required className="mt-1" />
              </div>
              <div>
                <Label>{L({ en: 'Client Email', fr: 'Email du client' })}</Label>
                <Input type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  placeholder="john@example.com" className="mt-1" />
              </div>
              <div>
                <Label>{L({ en: 'Link to Customer Account', fr: 'Lier au compte' })}</Label>
                <Select value={form.customerId} onValueChange={(v) => setForm({ ...form, customerId: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={L({ en: 'Select…', fr: 'Choisir…' })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{L({ en: 'None', fr: 'Aucun' })}</SelectItem>
                    {allCustomers?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.fullName} — {c.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{L({ en: 'Origin', fr: 'Origine' })}</Label>
                <Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  placeholder="Douala, CM" className="mt-1" />
              </div>
              <div>
                <Label>{L({ en: 'Destination', fr: 'Destination' })}</Label>
                <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="Paris, FR" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>{L({ en: 'Description', fr: 'Description' })}</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1" />
              </div>
              <div>
                <Label>{L({ en: 'Status', fr: 'Statut' })}</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{L({ en: s.en, fr: s.fr })}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{L({ en: 'Est. Delivery', fr: 'Livraison prévue' })}</Label>
                <Input value={form.estimatedDelivery} onChange={(e) => setForm({ ...form, estimatedDelivery: e.target.value })}
                  placeholder="2026-07-15" className="mt-1" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {L({ en: 'Tracking number is auto-generated. Quote will be marked as Responded.', fr: 'Le numéro de suivi est généré automatiquement. Le devis sera marqué Répondu.' })}
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setConvertQuote(null); setForm(EMPTY_FORM); }}>
                {L({ en: 'Cancel', fr: 'Annuler' })}
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? L({ en: 'Creating…', fr: 'Création…' })
                  : L({ en: 'Create Order', fr: 'Créer la commande' })}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
