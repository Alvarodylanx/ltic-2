'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Reply } from 'lucide-react';

export default function AdminContactsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [replyContact, setReplyContact] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);

  const qc = useQueryClient();
  const { L } = useLanguage();

  const { data: contacts, isLoading } = useQuery<any[]>({
    queryKey: ['admin-contacts'],
    queryFn: () => api.get('/api/contacts?limit=100'),
  });

  const markReadMutation = useMutation({
    mutationFn: ({ id, read }: { id: number; read: boolean }) => api.patch(`/api/contacts/${id}`, { read }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-contacts'] }),
  });

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContact || !replyMessage.trim()) return;
    setReplying(true);
    try {
      const result: any = await api.post(`/api/contacts/${replyContact.id}/reply`, { message: replyMessage });
      if (result.sent) {
        toast.success(L({ en: 'Reply sent successfully', fr: 'Réponse envoyée avec succès' }));
        setReplyContact(null);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">{L({ en: 'Contact Inquiries', fr: 'Messages de contact' })}</h1>
        <p className="text-muted-foreground mt-1">{L({ en: 'Manage incoming contact messages', fr: 'Gérez les messages de contact entrants' })}</p>
      </div>

      {isLoading ? <div className="space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div> : (
        <div className="bg-card border rounded-xl overflow-hidden space-y-0">
          {contacts?.map((contact) => (
            <div key={contact.id} className={`border-b last:border-0 ${!contact.read ? 'border-l-4 border-l-primary' : ''}`}>
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => {
                  setExpanded(expanded === contact.id ? null : contact.id);
                  if (!contact.read) markReadMutation.mutate({ id: contact.id, read: true });
                }}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {!contact.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{contact.name}</span>
                      {contact.company && <span className="text-muted-foreground text-xs">— {contact.company}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{contact.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">{format(new Date(contact.createdAt), 'dd MMM yyyy')}</span>
                  {expanded === contact.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
              {expanded === contact.id && (
                <div className="px-6 pb-5 bg-muted/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{L({ en: 'Email', fr: 'E-mail' })}: </span>
                      <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a>
                    </div>
                    {contact.phone && (
                      <div>
                        <span className="text-muted-foreground">{L({ en: 'Phone', fr: 'Téléphone' })}: </span>
                        {contact.phone}
                      </div>
                    )}
                  </div>
                  <div className="bg-background rounded-lg p-4 border mb-3">
                    <p className="text-sm leading-relaxed">{contact.message}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => markReadMutation.mutate({ id: contact.id, read: !contact.read })}
                      className="text-xs text-primary hover:underline"
                    >
                      {contact.read ? L({ en: 'Mark as Unread', fr: 'Marquer comme non lu' }) : L({ en: 'Mark as Read', fr: 'Marquer comme lu' })}
                    </button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1.5 text-xs"
                      onClick={(e) => { e.stopPropagation(); setReplyContact(contact); setReplyMessage(''); }}
                    >
                      <Reply className="h-3.5 w-3.5" />
                      {L({ en: 'Reply by Email', fr: 'Répondre par email' })}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!contacts?.length && <p className="text-center text-muted-foreground py-12">{L({ en: 'No contact messages yet', fr: 'Aucun message de contact pour l\'instant' })}</p>}
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog open={!!replyContact} onOpenChange={(open) => { if (!open) { setReplyContact(null); setReplyMessage(''); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Reply className="h-4 w-4 text-primary" />
              {L({ en: 'Reply to Contact', fr: 'Répondre au contact' })}
            </DialogTitle>
          </DialogHeader>

          {replyContact && (
            <div className="bg-muted/50 border rounded-lg px-4 py-3 text-xs text-muted-foreground space-y-1">
              <p><span className="font-semibold text-foreground">{L({ en: 'To:', fr: 'À :' })}</span> {replyContact.name} &lt;{replyContact.email}&gt;</p>
              <p><span className="font-semibold text-foreground">{L({ en: 'Re:', fr: 'Objet :' })}</span> {replyContact.subject}</p>
              <div className="border-t pt-2 mt-2 text-muted-foreground/80 italic line-clamp-2">
                {replyContact.message}
              </div>
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
              <Button type="button" variant="outline" onClick={() => { setReplyContact(null); setReplyMessage(''); }}>
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
    </div>
  );
}
