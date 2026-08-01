'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2, Save, Lock, UserCircle, Mail, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminProfile, AdminProfile } from '@/contexts/AdminProfileContext';

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(path, { ...options, headers, credentials: 'include' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

function PasswordInput({ id, value, onChange, placeholder, autoComplete }: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '••••••••'}
        autoComplete={autoComplete}
        className="pr-10"
        required
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function AdminProfilePage() {
  const { L } = useLanguage();
  const { profile, setProfile } = useAdminProfile();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [nameForm, setNameForm] = useState({ name: '' });
  const [emailForm, setEmailForm] = useState({ email: '', currentPassword: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (profile) {
      setNameForm({ name: profile.name });
      setEmailForm((prev) => ({ ...prev, email: profile.email }));
    } else {
      adminFetch<AdminProfile>('/api/admin/profile').then((data) => {
        setProfile(data);
      }).catch((err) => {
        setLoadError(err.message || 'Failed to load profile');
      });
    }
  }, [profile?.id]);

  useEffect(() => { setAvatarError(false); }, [profile?.avatarUrl]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameForm.name.trim()) return;
    setSavingName(true);
    try {
      const updated = await adminFetch<AdminProfile>('/api/admin/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: nameForm.name }),
      });
      setProfile(updated);
      toast.success(L({ en: 'Display name updated', fr: 'Nom d\'affichage mis à jour' }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingName(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(emailForm.email)) {
      toast.error(L({ en: 'Please enter a valid email address', fr: 'Veuillez entrer une adresse e-mail valide' }));
      return;
    }
    if (!emailForm.currentPassword) {
      toast.error(L({ en: 'Current password is required to change email', fr: 'Le mot de passe actuel est requis pour changer l\'e-mail' }));
      return;
    }
    setSavingEmail(true);
    try {
      const updated = await adminFetch<AdminProfile>('/api/admin/profile/email', {
        method: 'PATCH',
        body: JSON.stringify({ email: emailForm.email, currentPassword: emailForm.currentPassword }),
      });
      setProfile(updated);
      setEmailForm({ email: updated.email, currentPassword: '' });
      toast.success(L({ en: 'Email address updated — use your new email to log in next time', fr: 'E-mail mis à jour — utilisez votre nouvel e-mail pour vous connecter' }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(L({ en: 'New passwords do not match', fr: 'Les nouveaux mots de passe ne correspondent pas' }));
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error(L({ en: 'Password must be at least 8 characters', fr: 'Le mot de passe doit comporter au moins 8 caractères' }));
      return;
    }
    setSavingPassword(true);
    try {
      await adminFetch('/api/admin/profile/password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success(L({ en: 'Password changed successfully', fr: 'Mot de passe modifié avec succès' }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch('/api/admin/profile/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) throw new Error(L({ en: 'Upload failed', fr: 'Échec de l\'envoi' }));
      const updated = await res.json();
      setProfile(updated);
      setAvatarError(false);
      toast.success(L({ en: 'Profile picture updated', fr: 'Photo de profil mise à jour' }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingAvatar(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (loadError) return (
    <div className="flex flex-col items-center justify-center h-96 gap-3">
      <p className="text-destructive font-medium">Failed to load profile</p>
      <p className="text-sm text-muted-foreground">{loadError}</p>
      <button onClick={() => { setLoadError(null); window.location.reload(); }} className="text-sm underline text-primary">Retry</button>
    </div>
  );

  if (!profile) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{L({ en: 'My Profile', fr: 'Mon profil' })}</h1>
        <p className="text-muted-foreground mt-1">{L({ en: 'Manage your admin account credentials and settings', fr: 'Gérez vos identifiants et paramètres du compte administrateur' })}</p>
      </div>

      <div className="space-y-6">

        {/* Avatar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <UserCircle className="h-4 w-4" /> {L({ en: 'Profile Picture', fr: 'Photo de profil' })}
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile.avatarUrl && !avatarError ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  onError={() => setAvatarError(true)}
                  className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center border-4 border-background shadow-lg">
                  <span className="text-white text-2xl font-bold">{profile.name[0]?.toUpperCase()}</span>
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <input ref={fileRef} id="avatar-upload" name="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploadingAvatar} className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> {L({ en: 'Change Photo', fr: 'Changer la photo' })}
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">{L({ en: 'JPG, PNG — max 5 MB', fr: 'JPG, PNG — 5 Mo max' })}</p>
            </div>
          </div>
        </motion.div>

        {/* Display Name */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="bg-card border rounded-2xl p-6">
          <h3 className="font-semibold mb-1">{L({ en: 'Display Name', fr: 'Nom d\'affichage' })}</h3>
          <p className="text-xs text-muted-foreground mb-4">{L({ en: 'Shown in the admin sidebar and dashboard', fr: 'Affiché dans la barre latérale et le tableau de bord' })}</p>
          <form onSubmit={handleSaveName} className="flex gap-3">
            <Input
              value={nameForm.name}
              onChange={(e) => setNameForm({ name: e.target.value })}
              placeholder={L({ en: 'Administrator', fr: 'Administrateur' })}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={savingName} className="flex items-center gap-2 flex-shrink-0">
              {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {L({ en: 'Save', fr: 'Enregistrer' })}
            </Button>
          </form>
        </motion.div>

        {/* Email Address */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-card border rounded-2xl p-6">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Mail className="h-4 w-4" /> {L({ en: 'Email Address', fr: 'Adresse e-mail' })}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {L({ en: 'Current', fr: 'Actuel' })}: <span className="font-medium text-foreground">{profile.email}</span>
            &nbsp;— {L({ en: 'Your current password is required to change this.', fr: 'Votre mot de passe actuel est requis pour modifier ceci.' })}
          </p>
          <form onSubmit={handleChangeEmail} className="space-y-3">
            <div>
              <Label htmlFor="newEmail">{L({ en: 'New Email Address', fr: 'Nouvelle adresse e-mail' })}</Label>
              <Input
                id="newEmail"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="new@example.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="emailPassword">{L({ en: 'Current Password (required)', fr: 'Mot de passe actuel (requis)' })}</Label>
              <PasswordInput
                id="emailPassword"
                value={emailForm.currentPassword}
                onChange={(v) => setEmailForm((p) => ({ ...p, currentPassword: v }))}
                autoComplete="current-password"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={savingEmail} className="flex items-center gap-2">
                {savingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                {L({ en: 'Update Email', fr: 'Mettre à jour l\'e-mail' })}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="bg-card border rounded-2xl p-6">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Lock className="h-4 w-4" /> {L({ en: 'Change Password', fr: 'Changer le mot de passe' })}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{L({ en: 'Minimum 8 characters. Use a strong, unique password.', fr: 'Minimum 8 caractères. Utilisez un mot de passe fort et unique.' })}</p>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <Label htmlFor="currentPassword">{L({ en: 'Current Password', fr: 'Mot de passe actuel' })}</Label>
              <PasswordInput
                id="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(v) => setPasswordForm((p) => ({ ...p, currentPassword: v }))}
                autoComplete="current-password"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="newPassword">{L({ en: 'New Password', fr: 'Nouveau mot de passe' })}</Label>
                <PasswordInput
                  id="newPassword"
                  value={passwordForm.newPassword}
                  onChange={(v) => setPasswordForm((p) => ({ ...p, newPassword: v }))}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">{L({ en: 'Confirm New Password', fr: 'Confirmer le nouveau mot de passe' })}</Label>
                <PasswordInput
                  id="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={(v) => setPasswordForm((p) => ({ ...p, confirmPassword: v }))}
                  autoComplete="new-password"
                />
              </div>
            </div>
            {passwordForm.newPassword && passwordForm.confirmPassword &&
              passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-xs text-destructive">{L({ en: 'Passwords do not match', fr: 'Les mots de passe ne correspondent pas' })}</p>
              )}
            <div className="flex justify-end">
              <Button type="submit" disabled={savingPassword} className="flex items-center gap-2">
                {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {L({ en: 'Update Password', fr: 'Mettre à jour le mot de passe' })}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Security note */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="bg-muted/40 border rounded-2xl p-5 flex gap-3">
          <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{L({ en: 'Security reminders', fr: 'Rappels de sécurité' })}</p>
            <p>{L({ en: 'Passwords are hashed with bcrypt (cost 12) — never stored in plain text.', fr: 'Les mots de passe sont hachés avec bcrypt (coût 12) — jamais en clair.' })}</p>
            <p>{L({ en: 'Changing your email or password requires your current password as verification.', fr: 'La modification de l\'e-mail ou du mot de passe nécessite votre mot de passe actuel.' })}</p>
            <p>{L({ en: 'After changing email, use the new address to log in on all devices.', fr: 'Après avoir changé l\'e-mail, utilisez la nouvelle adresse sur tous vos appareils.' })}</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
