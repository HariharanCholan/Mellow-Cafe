import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, ShieldCheck, Mail, Lock, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import API_BASE_URL from '@/config/api';

const AdminSetupPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: authLogin } = useAuth();

  const [verifyingToken, setVerifyingToken] = useState(true);
  const [tokenData, setTokenData] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  // Verification & Password state
  const [otp, setOtp] = useState('');
  const [otpToken, setOtpToken] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Validate setup token from URL
  useEffect(() => {
    if (!token) {
      setTokenError('No setup token provided. Please use the link sent to your email.');
      setVerifyingToken(false);
      return;
    }

    const checkToken = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/verify-setup-token?token=${token}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Invalid or expired setup token');
        }
        setTokenData(data);
      } catch (err) {
        setTokenError(err.message);
      } finally {
        setVerifyingToken(false);
      }
    };

    checkToken();
  }, [token]);

  // Send OTP to user's approved email
  const handleSendOtp = async () => {
    if (!tokenData?.email) return;
    setSendingOtp(true);
    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tokenData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setOtpToken(data.token);
      setOtpSent(true);
      toast({
        title: 'Verification Code Sent',
        description: `We've sent a 6-digit code to ${tokenData.email}`,
      });
    } catch (err) {
      toast({
        title: 'Error sending OTP',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || !otpToken) return;
    setVerifyingOtp(true);
    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, token: otpToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');
      setOtpVerified(true);
      toast({
        title: 'Email Verified ✅',
        description: 'You can now create your portal password.',
      });
    } catch (err) {
      toast({
        title: 'Verification Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Submit new password
  const handleSetupPassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords mismatch',
        description: 'The passwords you entered do not match.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/setup-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
          otpToken: otpToken || undefined,
          otp: otp || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to setup password');
      }

      // Automatically log the user in
      authLogin(data.user, data.token);

      toast({
        title: 'Welcome to Mellow Café Portal! 🎉',
        description: `Logged in as ${data.user.role}.`,
      });

      navigate('/admin/dashboard');
    } catch (err) {
      toast({
        title: 'Setup Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (verifyingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-800 mx-auto mb-3" />
          <p className="text-stone-600 font-medium text-sm">Validating invite link...</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <Card className="w-full max-w-md shadow-lg border border-red-200 bg-white">
          <CardHeader className="text-center pt-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
              ⚠️
            </div>
            <CardTitle className="text-xl font-bold font-serif text-stone-900">
              Invalid Setup Link
            </CardTitle>
            <p className="text-sm text-stone-500 mt-2">{tokenError}</p>
          </CardHeader>
          <CardContent className="px-8 pb-8 text-center">
            <Link to="/login">
              <Button className="w-full bg-amber-800 hover:bg-amber-900 text-white">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <Card className="w-full max-w-lg shadow-xl border border-stone-200/80 bg-white rounded-xl overflow-hidden">
        {/* Top Banner */}
        <div className="bg-amber-800 text-white p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-700/80 text-2xl mb-2">
            ☕
          </div>
          <h1 className="text-2xl font-serif font-bold">Admin Portal Setup</h1>
          <p className="text-amber-100 text-xs mt-1">Verify your email and create your secure password</p>
        </div>

        <CardContent className="p-6 md:p-8 space-y-6">
          {/* User & Role Details */}
          <div className="bg-stone-50 rounded-lg p-4 border border-stone-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Account</p>
              <p className="text-sm font-medium text-stone-900">{tokenData?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Assigned Role</p>
              <span className="inline-block bg-amber-100 text-amber-800 font-semibold text-xs px-2.5 py-0.5 rounded-full uppercase">
                {tokenData?.role}
              </span>
            </div>
          </div>

          {/* STEP 1: Email OTP Verification */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-800" />
                1. Verify Your Email
              </Label>
              {otpVerified && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>

            {!otpVerified ? (
              <div className="space-y-3">
                {!otpSent ? (
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    variant="outline"
                    className="w-full border-amber-800 text-amber-800 hover:bg-amber-50 font-medium text-sm py-2"
                  >
                    {sendingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      'Send 6-Digit Code to Email'
                    )}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value.trim())}
                      className="border-stone-200 bg-stone-50 text-center font-mono tracking-widest text-base"
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={verifyingOtp || otp.length < 6}
                      className="bg-amber-800 hover:bg-amber-900 text-white whitespace-nowrap"
                    >
                      {verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Email address confirmed. You can now set your password below.
              </div>
            )}
          </div>

          <hr className="border-stone-200" />

          {/* STEP 2: Set New Password Form */}
          <form onSubmit={handleSetupPassword} className="space-y-4">
            <Label className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-800" />
              2. Set Your Portal Password
            </Label>

            <div className="space-y-1">
              <Label htmlFor="new-pass" className="text-xs text-stone-500">New Password (min. 6 characters)</Label>
              <Input
                id="new-pass"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-stone-200 bg-stone-50"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirm-pass" className="text-xs text-stone-500">Confirm Password</Label>
              <Input
                id="confirm-pass"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="border-stone-200 bg-stone-50"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2.5 rounded-lg shadow transition-colors mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting Up Account...
                </>
              ) : (
                <>
                  Complete Setup &amp; Enter Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetupPasswordPage;
