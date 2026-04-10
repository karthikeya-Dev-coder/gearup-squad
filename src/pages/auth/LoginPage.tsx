import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Mail, Lock, Smartphone, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { sendOtp } from '@/services/api';
import { UserRole } from '@/types';

export default function LoginPage() {
  const { login, isLoading, error, detectRole } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'email' | 'credentials'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [detectedRole, setDetectedRole] = useState<UserRole | null>(null);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = detectRole(email);
    if (!role) {
      toast.error('Email not recognized. Try admin@sports.edu, priya@sports.edu, or arjun@student.edu');
      return;
    }
    setDetectedRole(role);
    setStep('credentials');
    if (role === 'student') setLoginMethod('password');
  };

  const handleSendOtp = async () => {
    setOtpSending(true);
    await sendOtp(email);
    setOtpSending(false);
    setOtpSent(true);
    setResendTimer(30);
    toast.success('OTP sent! Use 123456 for demo.');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = loginMethod === 'otp' ? otp.join('') : undefined;
    const passwordValue = loginMethod === 'password' ? password : undefined;
    const success = await login(email, passwordValue, otpValue);
    if (success) {
      toast.success('Welcome back!');
      navigate(`/${detectedRole}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-info/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-elevated border-border/50 relative animate-scale-in">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
            <Trophy className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">SportSync</CardTitle>
          <CardDescription>Sports Equipment Booking System</CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mt-4">
                  Demo: admin@sports.edu · priya@sports.edu · arjun@student.edu
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 animate-slide-up">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{email}</span>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setDetectedRole(null); setPassword(''); setOtp(['','','','','','']); setOtpSent(false); }}
                  className="ml-auto text-xs text-primary hover:underline"
                >
                  Change
                </button>
              </div>

              {detectedRole && (
                <div className="flex items-center justify-center">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">
                    {detectedRole} Account
                  </span>
                </div>
              )}

              {/* Student: toggle password/OTP */}
              {detectedRole === 'student' && (
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${loginMethod === 'password' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-secondary'}`}
                  >
                    <Lock className="w-3.5 h-3.5 inline mr-1.5" />Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${loginMethod === 'otp' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-secondary'}`}
                  >
                    <Smartphone className="w-3.5 h-3.5 inline mr-1.5" />OTP
                  </button>
                </div>
              )}

              {loginMethod === 'password' || detectedRole !== 'student' ? (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {!otpSent ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleSendOtp}
                      disabled={otpSending}
                    >
                      {otpSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Smartphone className="w-4 h-4 mr-2" />}
                      {otpSending ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  ) : (
                    <>
                      <Label>Enter 6-digit OTP</Label>
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
                            className="w-11 h-12 text-center text-lg font-semibold border border-input rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                          />
                        ))}
                      </div>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={resendTimer > 0 || otpSending}
                          className="text-xs text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                        >
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground"
                disabled={isLoading || (loginMethod === 'otp' && detectedRole === 'student' && (!otpSent || otp.join('').length < 6))}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
