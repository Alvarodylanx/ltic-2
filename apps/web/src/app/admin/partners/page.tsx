'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Handshake, Plus, Trash2, Pencil, X, Save, Loader2, Globe, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

interface Partner {
  id: number;
  name: string;
  logoUrl?: string;
  sectorEn: string;
  sectorFr: string;
  productsEn?: string;
  productsFr?: string;
  website?: string;
  displayOrder: number;
  active: boolean;
}

const EMPTY: Omit<Partner, 'id' | 'active' | 'displayOrder'> = {
  name: '', logoUrl: '', sectorEn: '', sectorFr: '', productsEn: '', productsFr: '', website: '',
};

export default function AdminPartnersPage() {
  const qc = useQueryClient();
  const { L } = useLanguage();
  const [editId, setEditId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });

  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ['partners', 'all'],
    queryFn: () => api.get('/api/partners/all'),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['partners'] });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/api/partners', data),
    onSuccess: () => { invalidate(); setShowAdd(false); setForm({ ...EMPTY }); toast.success(L({ en: 'Partner added', fr: 'Partenaire ajouté' })); },
    onError:   () => toast.error(L({ en: 'Failed to add partner', fr: 'Échec de l\'ajout' })),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Partner> }) => api.patch(`/api/partners/${id}`, data),
    onSuccess: () => { invalidate(); setEditId(null); toast.success(L({ en: 'Partner updated', fr: 'Partenaire mis à jour' })); },
    onError:   () => toast.error(L({ en: 'Failed to update', fr: 'Échec de la mise à jour' })),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/partners/${id}`),
    onSuccess: () => { invalidate(); toast.success(L({ en: 'Partner deleted', fr: 'Partenaire supprimé' })); },
    onError:   () => toast.error(L({ en: 'Failed to delete', fr: 'Échec de la suppression' })),
  });

  const toggleActive = (p: Partner) =>
    updateMutation.mutate({ id: p.id, data: { active: !p.active } });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Handshake className="h-6 w-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold">{L({ en: 'Partners & Brands', fr: 'Partenaires & Marques' })}</h1>
          </div>
          <p className="text-muted-foreground text-sm">{L({ en: 'Manage the brand/partner carousel shown on the home page', fr: 'Gérez le carrousel de marques affiché sur la page d\'accueil' })}</p>
        </div>
        <Button onClick={() => { setShowAdd(true); setEditId(null); setForm({ ...EMPTY }); }} className="gap-2 flex-shrink-0">
          <Plus className="h-4 w-4" />{L({ en: 'Add Partner', fr: 'Ajouter un Partenaire' })}
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-card border rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">{L({ en: 'New Partner / Brand', fr: 'Nouveau Partenaire / Marque' })}</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowAdd(false)}><X className="h-4 w-4" /></Button>
          </div>
          <PartnerForm form={form} setForm={setForm} />
          <div className="flex gap-3 mt-4">
            <Button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.name} className="gap-2">
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {L({ en: 'Save', fr: 'Enregistrer' })}
            </Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>{L({ en: 'Cancel', fr: 'Annuler' })}</Button>
          </div>
        </div>
      )}

      {/* Partners list */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">{L({ en: 'Loading…', fr: 'Chargement…' })}</div>
      ) : partners.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Handshake className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{L({ en: 'No partners yet. Add your first one.', fr: 'Aucun partenaire. Ajoutez le premier.' })}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {partners.map((p) => (
            <div key={p.id} className={`bg-card border rounded-xl overflow-hidden transition-opacity ${p.active ? '' : 'opacity-60'}`}>
              {editId === p.id ? (
                <div className="p-6">
                  <PartnerForm form={form} setForm={setForm} />
                  <div className="flex gap-3 mt-4">
                    <Button onClick={() => updateMutation.mutate({ id: p.id, data: form })} disabled={updateMutation.isPending} className="gap-2">
                      {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {L({ en: 'Save', fr: 'Enregistrer' })}
                    </Button>
                    <Button variant="outline" onClick={() => setEditId(null)}>{L({ en: 'Cancel', fr: 'Annuler' })}</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4">
                  {/* Logo or initial */}
                  <div className="w-14 h-14 rounded-xl border bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {p.logoUrl
                      ? <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain p-1" />
                      : <span className="text-xl font-bold text-primary">{p.name.charAt(0)}</span>
                    }
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{p.name}</p>
                    <p className="text-xs text-primary">{p.sectorEn}</p>
                    {p.productsEn && <p className="text-xs text-muted-foreground truncate mt-0.5">{p.productsEn}</p>}
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                        <Globe className="h-3 w-3" />{p.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleActive(p)} className="text-muted-foreground hover:text-primary transition-colors" title={p.active ? 'Deactivate' : 'Activate'}>
                      {p.active ? <ToggleRight className="h-6 w-6 text-primary" /> : <ToggleLeft className="h-6 w-6" />}
                    </button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditId(p.id); setShowAdd(false);
                      setForm({ name: p.name, logoUrl: p.logoUrl || '', sectorEn: p.sectorEn, sectorFr: p.sectorFr, productsEn: p.productsEn || '', productsFr: p.productsFr || '', website: p.website || '' });
                    }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(p.id)} disabled={deleteMutation.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PartnerForm({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const { L } = useLanguage();
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f: any) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <Label>{L({ en: 'Brand / Partner Name *', fr: 'Nom de la Marque / Partenaire *' })}</Label>
        <Input value={form.name} onChange={set('name')} placeholder="e.g. TotalEnergies" className="mt-1" />
      </div>
      <div>
        <Label>{L({ en: 'Sector (English)', fr: 'Secteur (Anglais)' })}</Label>
        <Input value={form.sectorEn} onChange={set('sectorEn')} placeholder="Energy & Lubricants" className="mt-1" />
      </div>
      <div>
        <Label>{L({ en: 'Secteur (Français)', fr: 'Secteur (Français)' })}</Label>
        <Input value={form.sectorFr} onChange={set('sectorFr')} placeholder="Énergie & Lubrifiants" className="mt-1" />
      </div>
      <div>
        <Label>{L({ en: 'Products Supplied (EN)', fr: 'Produits Fournis (EN)' })}</Label>
        <Input value={form.productsEn} onChange={set('productsEn')} placeholder="Lubricants, motor oils, greases" className="mt-1" />
      </div>
      <div>
        <Label>{L({ en: 'Produits Fournis (FR)', fr: 'Produits Fournis (FR)' })}</Label>
        <Input value={form.productsFr} onChange={set('productsFr')} placeholder="Lubrifiants, huiles moteur, graisses" className="mt-1" />
      </div>
      <div className="sm:col-span-2">
        <Label>{L({ en: 'Website (optional)', fr: 'Site web (optionnel)' })}</Label>
        <Input value={form.website} onChange={set('website')} placeholder="https://totalenergies.com" className="mt-1" />
      </div>
      <div className="sm:col-span-2">
        <Label>{L({ en: 'Logo Image (optional)', fr: 'Image du Logo (optionnel)' })}</Label>
        <div className="mt-1">
          <MediaUpload
            value={form.logoUrl}
            onChange={(url) => setForm((f: any) => ({ ...f, logoUrl: url }))}
          />
        </div>
      </div>
    </div>
  );
}
