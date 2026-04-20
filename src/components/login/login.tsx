import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  User,
  KeyRound,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/types';

export default function LoginPage() {
  const { login, logout, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') || 'student') as UserRole;
  const [activeTab, setActiveTab] = useState<UserRole>(initialTab);
  const [view, setView] = useState<'login' | 'forgot-password'>('login');

  // Login states
  const [identifier, setIdentifier] = useState(''); // Email or User ID
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Clear states when tab changes
  useEffect(() => {
    setIdentifier('');
    setPassword('');
    setView('login');
    setForgotStep('email');
    setOtp(['', '', '', '', '', '']);
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Pass activeTab as expectedRole — AuthContext will reject before loader if roles don't match
    const result = await login(identifier, password, activeTab);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(`/${activeTab}`);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return toast.error('Please enter your email');

    setIsSendingReset(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotStep('otp');
      toast.success('Code sent!', {
        description: `6-digit verification code sent to ${forgotEmail}.`,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return toast.error('Please enter the complete 6-digit code');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');

    setIsSendingReset(true);
    try {
      await api.post('/auth/reset-password', {
        email: forgotEmail,
        otp: otpCode,
        newPassword
      });
      toast.success('Password updated!', {
        description: 'You can now log in with your new password.',
      });
      setView('login');
      setForgotStep('email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-info/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Branding Area */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 p-1.5 bg-card shadow-xl animate-float">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Sports Equip</h1>
            <p className="text-muted-foreground font-medium">Professional Equipment Management</p>
          </div>
        </div>

        {view === 'login' ? (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-secondary shadow-inner rounded-xl mb-6">
              <TabsTrigger value="admin" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <ShieldCheck className="w-4 h-4 mr-2" /> Admin
              </TabsTrigger>
              <TabsTrigger value="staff" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Building2 className="w-4 h-4 mr-2" /> Staff
              </TabsTrigger>
              <TabsTrigger value="student" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <GraduationCap className="w-4 h-4 mr-2" /> Student
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="border-border/50 shadow-elevated overflow-hidden bg-card/80 backdrop-blur-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {activeTab === 'admin' ? <ShieldCheck className="w-5 h-5" /> : activeTab === 'staff' ? <Building2 className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                    </div>
                    <CardTitle className="text-xl capitalize">{activeTab} Login</CardTitle>
                  </div>
                  <CardDescription>
                    {activeTab === 'admin' ? 'Access your administrative dashboard' : activeTab === 'staff' ? 'Manage your assigned equipment categories' : 'Book equipment and view your activities'}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="id">{activeTab === 'admin' ? 'User ID' : 'Email Address'}</Label>
                      <div className="relative">
                        {activeTab === 'admin' ? (
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        )}
                        <Input
                          id="id"
                          placeholder={activeTab === 'admin' ? 'Enter Admin ID' : 'Enter your email'}
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="pl-10 h-12 bg-card/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Password</Label>
                        {activeTab !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => setView('forgot-password')}
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 bg-card/50"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 pb-6">
                    <Button type="submit" className="w-full h-12 gradient-primary text-primary-foreground shadow-lg" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                      {isLoading ? 'Processing...' : 'Secure Log In'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="border-border/50 shadow-elevated bg-card/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
            <CardHeader className="pb-4">
              <button
                onClick={() => setView('login')}
                className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors mb-4 group w-fit"
              >
                <ArrowLeft className="w-3 h-3 mr-1 transition-transform group-hover:-translate-x-1" /> Back to login
              </button>
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <CardDescription>
                {forgotStep === 'email' ? "We'll send a 6-digit code to your university email." : "Enter the code and choose your new password."}
              </CardDescription>
            </CardHeader>

            <form onSubmit={forgotStep === 'email' ? handleForgotPassword : handleResetPassword}>
              <CardContent className="space-y-4">
                {forgotStep === 'email' ? (
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="e.g. arjun@student.edu"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="pl-10 h-12 bg-card/50"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                      <Label className="text-center block text-sm font-semibold">6-Digit Verification Code</Label>
                      <div className="flex gap-2 justify-center">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            ref={el => { otpRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleOtpChange(i, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(i, e)}
                            className="w-10 h-12 text-center text-lg font-bold border border-input rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                            required
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Min 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-10 pr-10 h-12"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 pr-10 h-12"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pb-6">
                <Button type="submit" className="w-full h-12 gradient-primary text-primary-foreground shadow-lg" disabled={isSendingReset}>
                  {isSendingReset ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (forgotStep === 'email' ? <Mail className="w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />)}
                  {isSendingReset ? (forgotStep === 'email' ? 'Sending Code...' : 'Updating...') : (forgotStep === 'email' ? 'Send Verification Code' : 'Reset Password & Login')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
