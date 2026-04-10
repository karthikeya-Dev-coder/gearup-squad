import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error('Fill all fields');
    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Verification email sent to ${verifyEmail || user?.email}`);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Manage your account" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5" />Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div><Label className="text-muted-foreground">Name</Label><p className="font-medium">{user?.name}</p></div>
          <div><Label className="text-muted-foreground">Email</Label><p className="font-medium">{user?.email}</p></div>
          <div><Label className="text-muted-foreground">Role</Label><p className="font-medium capitalize">{user?.role}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Lock className="w-5 h-5" />Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div><Label>Current Password</Label><Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></div>
            <div><Label>New Password</Label><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></div>
            <Button type="submit" className="gradient-primary text-primary-foreground">Update Password</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Mail className="w-5 h-5" />Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div><Label>Email</Label><Input type="email" value={verifyEmail} onChange={e => setVerifyEmail(e.target.value)} placeholder={user?.email} /></div>
            <Button type="submit" variant="outline">Send Verification Email</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
