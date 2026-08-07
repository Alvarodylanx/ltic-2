'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, MapPin, X, Clock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(
  () => import('@/components/map/LocationPickerMap').then((m) => m.LocationPickerMap),
  { ssr: false, loading: () => <div className="h-[380px] w-full bg-muted animate-pulse rounded-sm" /> }
);

const STATUSES = [
  { value: 'processing',      en: 'Processing',       fr: 'En traitement' },
  { value: 'customs-cleared', en: 'Customs Cleared',  fr: 'Dédouané' },
  { value: 'shipped',         en: 'Shipped',           fr: 'Expédié' },
  { value: 'in-transit',      en: 'In Transit',        fr: 'En transit' },
  { value: 'delivered',       en: 'Delivered',         fr: 'Livré' },
  { value: 'cancelled',       en: 'Cancelled',         fr: 'Annulé' },
];

const EMPTY_FORM = {
  clientName: '', clientEmail: '', customerId: '',
  origin: '', destination: '', description: '',
  status: 'processing', estimatedDelivery: '',
};

const EMPTY_TIMELINE_EVENT = {
  status: 'processing',
  date: new Date().toISOString().slice(0, 16),
  description: '',
  location: '',
};

export default function AdminOrdersPage() {
  const qc = useQueryClient();
  const { L } = useLanguage();

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [locationOrder, setLocationOrder] = useState<any | null>(null);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState('');

  const [timelineOrder, setTimelineOrder] = useState<any | null>(null);
  const [timelineEvent, setTimelineEvent] = useState(EMPTY_TIMELINE_EVENT);
  const [deleteTimelineIdx, setDeleteTimelineIdx] = useState<number | null>(null);

  const { data: orders, isLoading } = useQuery<any[]>({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/api/orders?limit=200'),
  });

  const { data: allCustomers } = useQuery<any[]>({
    queryKey: ['admin-customers'],
    queryFn: () => api.get('/api/customers'),
  });

  const createMutation = useMutation({
    mutationFn: (body: any) => api.post('/api/orders', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success(L({ en: 'Order created', fr: 'Commande créée' }));
      setShowAdd(false);
      setForm(EMPTY_FORM);
    },
    onError: () => toast.error(L({ en: 'Failed to create order', fr: 'Échec de la création' })),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.patch(`/api/orders/${id}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-orders'] }); toast.success(L({ en: 'Order updated', fr: 'Commande mise à jour' })); },
    onError: () => toast.error(L({ en: 'Failed to update', fr: 'Échec de la mise à jour' })),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/orders/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success(L({ en: 'Order deleted', fr: 'Commande supprimée' }));
      setDeleteId(null);
    },
    onError: () => toast.error(L({ en: 'Failed to delete', fr: 'Échec de la suppression' })),
  });

  const locationMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) => api.patch(`/api/orders/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success(L({ en: 'Location saved', fr: 'Position enregistrée' }));
      setLocationOrder(null);
    },
    onError: () => toast.error(L({ en: 'Failed to save location', fr: "Échec de l'enregistrement" })),
  });

  const addTimelineMutation = useMutation({
    mutationFn: ({ id, event }: { id: number; event: any }) => api.post(`/api/orders/${id}/timeline`, event),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      setTimelineOrder(data);
      setTimelineEvent(EMPTY_TIMELINE_EVENT);
      toast.success(L({ en: 'Timeline event added', fr: 'Événement ajouté' }));
    },
    onError: () => toast.error(L({ en: 'Failed to add event', fr: "Échec de l'ajout" })),
  });

  const removeTimelineMutation = useMutation({
    mutationFn: ({ id, index }: { id: number; index: number }) => api.delete(`/api/orders/${id}/timeline/${index}`),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      setTimelineOrder(data);
      setDeleteTimelineIdx(null);
      toast.success(L({ en: 'Event removed', fr: 'Événement supprimé' }));
    },
    onError: () => toast.error(L({ en: 'Failed to remove event', fr: 'Échec de la suppression' })),
  });

  function openLocationPicker(order: any) {
    setLocationOrder(order);
    setLocationCoords(
      order.currentLat && order.currentLng
        ? { lat: Number(order.currentLat), lng: Number(order.currentLng) }
        : null
    );
    setLocationLabel(order.currentLocationLabel || '');
  }

  function saveLocation() {
    if (!locationOrder || !locationCoords) return;
    locationMutation.mutate({
      id: locationOrder.id,
      body: {
        currentLat: String(locationCoords.lat),
        currentLng: String(locationCoords.lng),
        currentLocationLabel: locationLabel || null,
      },
    });
  }

  function clearLocation() {
    if (!locationOrder) return;
    locationMutation.mutate({
      id: locationOrder.id,
      body: { currentLat: null, currentLng: null, currentLocationLabel: null },
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body: any = {
      clientName: form.clientName,
      clientEmail: form.clientEmail || undefined,
      origin: form.origin || undefined,
      destination: form.destination || undefined,
      description: form.description || undefined,
      status: form.status,
      estimatedDelivery: form.estimatedDelivery || undefined,
    };
    if (form.customerId) body.customerId = Number(form.customerId);
    createMutation.mutate(body);
  }

  function addTimelineEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!timelineOrder) return;
    addTimelineMutation.mutate({
      id: timelineOrder.id,
      event: {
        status: timelineEvent.status,
        date: timelineEvent.date,
        description: timelineEvent.description,
        location: timelineEvent.location || undefined,
      },
    });
  }

  const headers = [
    L({ en: 'Tracking #', fr: 'N° suivi' }),
    L({ en: 'Client', fr: 'Client' }),
    L({ en: 'Origin', fr: 'Origine' }),
    L({ en: 'Destination', fr: 'Destination' }),
    L({ en: 'Status', fr: 'Statut' }),
    L({ en: 'Est. Delivery', fr: 'Livraison prévue' }),
    L({ en: 'Created', fr: 'Créé le' }),
    '',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{L({ en: 'Orders & Shipments', fr: 'Commandes & Expéditions' })}</h1>
          <p className="text-muted-foreground mt-1">{L({ en: 'Manage shipment tracking and order status', fr: 'Gérez le suivi des expéditions et le statut des commandes' })}</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {L({ en: 'Add Order', fr: 'Ajouter une commande' })}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-muted/50 border-b">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-sm font-bold text-primary">{order.trackingNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{order.clientName}</p>
                    {order.clientEmail && <p className="text-xs text-muted-foreground">{order.clientEmail}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{order.origin || '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{order.destination || '—'}</td>
                  <td className="px-4 py-3">
                    <Select value={order.status} onValueChange={(val) => updateMutation.mutate({ id: order.id, status: val })}>
                      <SelectTrigger className="h-8 text-xs w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{L({ en: s.en, fr: s.fr })}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{order.estimatedDelivery || '—'}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{format(new Date(order.createdAt), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => { setTimelineOrder(order); setTimelineEvent(EMPTY_TIMELINE_EVENT); }}
                        title={L({ en: 'Manage timeline', fr: 'Gérer la chronologie' })}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className={`h-8 w-8 ${order.currentLat ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
                        onClick={() => openLocationPicker(order)}
                        title={L({ en: 'Set location', fr: 'Définir la position' })}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(order.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders?.length && (
            <p className="text-center text-muted-foreground py-12">{L({ en: 'No orders yet', fr: "Aucune commande pour l'instant" })}</p>
          )}
        </div>
      )}

      {/* Add Order Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{L({ en: 'Create New Order', fr: 'Créer une commande' })}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
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
                <Label>{L({ en: 'Link to Customer', fr: 'Lier au compte' })}</Label>
                <Select value={form.customerId} onValueChange={(v) => setForm({ ...form, customerId: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={L({ en: 'Select customer…', fr: 'Choisir un compte…' })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{L({ en: 'None', fr: 'Aucun' })}</SelectItem>
                    {allCustomers?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.fullName} — {c.email}
                      </SelectItem>
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
                  placeholder={L({ en: 'Cargo description…', fr: 'Description du fret…' })} className="mt-1" />
              </div>
              <div>
                <Label>{L({ en: 'Status', fr: 'Statut' })}</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
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
              {L({ en: 'Tracking number is auto-generated (LTIC + date + random).', fr: 'Le numéro de suivi est généré automatiquement.' })}
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>{L({ en: 'Cancel', fr: 'Annuler' })}</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? L({ en: 'Creating…', fr: 'Création…' }) : L({ en: 'Create Order', fr: 'Créer la commande' })}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title={L({ en: 'Delete Order?', fr: 'Supprimer la commande ?' })}
        description={L({ en: 'This will permanently delete the order and cannot be undone.', fr: 'Cette action est irréversible.' })}
        confirmLabel={L({ en: 'Delete', fr: 'Supprimer' })}
        onConfirm={() => deleteId !== null && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />

      {/* Set Location Dialog */}
      <Dialog open={!!locationOrder} onOpenChange={(open) => { if (!open) setLocationOrder(null); }}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {L({ en: 'Set Shipment Location', fr: "Définir la position de l'expédition" })}
            </DialogTitle>
            {locationOrder && (
              <p className="text-xs text-muted-foreground font-mono mt-0.5">{locationOrder.trackingNumber}</p>
            )}
          </DialogHeader>

          <div className="px-6 pb-2 pt-4">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              {L({ en: 'Location Label (optional)', fr: 'Nom du lieu (optionnel)' })}
            </Label>
            <Input
              className="mt-1.5 mb-4"
              placeholder={L({ en: 'e.g. Port of Hamburg, Germany', fr: 'ex. Port de Hambourg, Allemagne' })}
              value={locationLabel}
              onChange={(e) => setLocationLabel(e.target.value)}
            />
          </div>

          <div className="px-6">
            {locationCoords && (
              <p className="text-xs text-muted-foreground mb-2 font-mono">
                {L({ en: 'Pin', fr: 'Épingle' })}: {locationCoords.lat.toFixed(5)}, {locationCoords.lng.toFixed(5)}
              </p>
            )}
            {!locationCoords && (
              <p className="text-xs text-muted-foreground mb-2">
                {L({ en: 'Click on the map to drop a pin at the shipment\'s current location.', fr: 'Cliquez sur la carte pour placer une épingle à la position actuelle de l\'expédition.' })}
              </p>
            )}
            <LocationPickerMap
              initial={locationCoords}
              onChange={setLocationCoords}
            />
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border mt-4 flex-row justify-between">
            <Button
              type="button" variant="ghost" size="sm"
              className="text-destructive hover:text-destructive text-xs"
              onClick={clearLocation}
              disabled={!locationOrder?.currentLat || locationMutation.isPending}
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              {L({ en: 'Clear Location', fr: 'Effacer la position' })}
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setLocationOrder(null)}>
                {L({ en: 'Cancel', fr: 'Annuler' })}
              </Button>
              <Button
                type="button" size="sm"
                onClick={saveLocation}
                disabled={!locationCoords || locationMutation.isPending}
              >
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                {locationMutation.isPending
                  ? L({ en: 'Saving…', fr: 'Enregistrement…' })
                  : L({ en: 'Save Location', fr: 'Enregistrer la position' })}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timeline Management Dialog */}
      <Dialog open={!!timelineOrder} onOpenChange={(open) => { if (!open) { setTimelineOrder(null); setDeleteTimelineIdx(null); } }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {L({ en: 'Shipment Timeline', fr: 'Chronologie de l\'expédition' })}
            </DialogTitle>
            {timelineOrder && (
              <p className="text-xs text-muted-foreground font-mono">{timelineOrder.trackingNumber} — {timelineOrder.clientName}</p>
            )}
          </DialogHeader>

          {/* Existing events */}
          <div className="max-h-60 overflow-y-auto">
            {(!timelineOrder?.timeline || timelineOrder.timeline.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                {L({ en: 'No timeline events yet. Add the first one below.', fr: 'Aucun événement. Ajoutez-en un ci-dessous.' })}
              </p>
            ) : (
              <div className="space-y-2 pr-1">
                {[...(timelineOrder?.timeline || [])].reverse().map((event: any, revIdx: number) => {
                  const realIdx = (timelineOrder?.timeline?.length ?? 0) - 1 - revIdx;
                  return (
                    <div key={realIdx} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wide">{event.status}</span>
                          <span className="text-xs text-muted-foreground">{event.date ? new Date(event.date).toLocaleString() : ''}</span>
                        </div>
                        <p className="text-sm">{event.description}</p>
                        {event.location && <p className="text-xs text-muted-foreground mt-0.5">{event.location}</p>}
                      </div>
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-destructive/70 hover:text-destructive flex-shrink-0"
                        onClick={() => {
                          if (timelineOrder) {
                            removeTimelineMutation.mutate({ id: timelineOrder.id, index: realIdx });
                          }
                        }}
                        disabled={removeTimelineMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add new event form */}
          <div className="border-t pt-4 mt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {L({ en: 'Add Event', fr: 'Ajouter un événement' })}
            </p>
            <form onSubmit={addTimelineEvent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">{L({ en: 'Status', fr: 'Statut' })} *</Label>
                  <Select value={timelineEvent.status} onValueChange={(v) => setTimelineEvent({ ...timelineEvent, status: v })}>
                    <SelectTrigger className="mt-1 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{L({ en: s.en, fr: s.fr })}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">{L({ en: 'Date & Time', fr: 'Date et heure' })} *</Label>
                  <Input
                    type="datetime-local"
                    value={timelineEvent.date}
                    onChange={(e) => setTimelineEvent({ ...timelineEvent, date: e.target.value })}
                    className="mt-1 h-8 text-xs"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">{L({ en: 'Description', fr: 'Description' })} *</Label>
                  <Input
                    value={timelineEvent.description}
                    onChange={(e) => setTimelineEvent({ ...timelineEvent, description: e.target.value })}
                    placeholder={L({ en: 'e.g. Shipment cleared customs', fr: 'ex. Expédition dédouanée' })}
                    className="mt-1 h-8 text-xs"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">{L({ en: 'Location (optional)', fr: 'Lieu (optionnel)' })}</Label>
                  <Input
                    value={timelineEvent.location}
                    onChange={(e) => setTimelineEvent({ ...timelineEvent, location: e.target.value })}
                    placeholder={L({ en: 'e.g. Port of Douala, Cameroon', fr: 'ex. Port de Douala, Cameroun' })}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setTimelineOrder(null)}>
                  {L({ en: 'Close', fr: 'Fermer' })}
                </Button>
                <Button type="submit" size="sm" disabled={addTimelineMutation.isPending}>
                  <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                  {addTimelineMutation.isPending
                    ? L({ en: 'Adding…', fr: 'Ajout…' })
                    : L({ en: 'Add Event', fr: 'Ajouter' })}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
