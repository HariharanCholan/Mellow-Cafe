import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../components/ui/use-toast";
import { Coffee } from "lucide-react";

// Google signup (keep if needed)
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [token, setToken] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  /* ---------------------------------------------------
      INPUT HANDLER
  ----------------------------------------------------- */
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------------------------------------------------
      GOOGLE SIGNUP
  ----------------------------------------------------- */
  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Google Signup Successful" });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Google Signup Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  /* ---------------------------------------------------
      SEND OTP (EMAIL)
  ----------------------------------------------------- */
  const sendOTP = async () => {
    if (!formData.email) {
      toast({ title: "Enter email", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setToken(data.token);
      setOtpSent(true);

      toast({ title: "OTP sent to email 📩" });
    } catch (err) {
      toast({
        title: "Failed to send OTP",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  /* ---------------------------------------------------
      VERIFY OTP
  ----------------------------------------------------- */
  const verifyOTP = async () => {
    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp,
          token,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setIsVerified(true);
      toast({ title: "Email Verified ✅" });
    } catch (err) {
      toast({
        title: "Invalid or Expired OTP",
        variant: "destructive",
      });
    }
  };

  /* ---------------------------------------------------
      REGISTER USER
  ----------------------------------------------------- */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      toast({
        title: "Please verify email first",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agree) {
      toast({
        title: "Accept terms to continue",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Registration Failed",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Account Created 🎉" });
      navigate("/login");
    } catch {
      toast({ title: "Server Error", variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - Mellow Café</title>
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-md border border-stone-200/80 bg-white">
            <CardHeader className="text-center pt-8">
              <div className="mx-auto h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center mb-2">
                <Coffee className="h-6 w-6 text-amber-800" />
              </div>
              <CardTitle className="text-2xl font-bold font-serif text-stone-900">
                Create Account
              </CardTitle>
              <p className="text-sm text-stone-500 mt-1">
                Join Mellow Café to start ordering
              </p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleRegister} className="space-y-4">

                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    onChange={handleChange}
                    required
                    className="border-stone-200 focus-visible:ring-amber-800/20 focus-visible:border-amber-800 bg-stone-50/50"
                  />
                </div>

                {/* EMAIL + OTP SEND */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      onChange={handleChange}
                      required
                      disabled={isVerified}
                      className="border-stone-200 focus-visible:ring-amber-800/20 focus-visible:border-amber-800 bg-stone-50/50"
                    />
                    <Button
                      type="button"
                      onClick={sendOTP}
                      disabled={isVerified}
                      className="bg-stone-800 hover:bg-stone-900 text-white text-xs px-3 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {otpSent ? "Resend" : "Send OTP"}
                    </Button>
                  </div>
                </div>

                {/* OTP INPUT */}
                {otpSent && !isVerified && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1"
                  >
                    <Label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Enter OTP</Label>
                    <div className="flex gap-2">
                      <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit code"
                        className="border-stone-200 focus-visible:ring-amber-800/20 focus-visible:border-amber-800 bg-stone-50/50 tracking-widest"
                      />
                      <Button
                        type="button"
                        onClick={verifyOTP}
                        className="bg-amber-800 hover:bg-amber-900 text-white text-xs px-3 shrink-0 cursor-pointer"
                      >
                        Verify
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* VERIFIED BADGE */}
                {isVerified && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2"
                  >
                    <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Email verified successfully
                  </motion.div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    onChange={handleChange}
                    required
                    className="border-stone-200 focus-visible:ring-amber-800/20 focus-visible:border-amber-800 bg-stone-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    onChange={handleChange}
                    required
                    className="border-stone-200 focus-visible:ring-amber-800/20 focus-visible:border-amber-800 bg-stone-50/50"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="agree"
                    type="checkbox"
                    onChange={handleChange}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800/20 cursor-pointer"
                  />
                  <Label htmlFor="agree" className="text-sm text-stone-600 cursor-pointer">
                    I agree to the{" "}
                    <span className="text-amber-800 underline font-medium cursor-pointer">Terms & Conditions</span>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2 rounded-md transition-colors mt-4 cursor-pointer"
                >
                  Create Account
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-stone-400">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-300 font-medium py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.29 1.926 15.474 1 12.24 1 6.01 1 1 6.01 1 12.24s5.01 11.24 11.24 11.24c6.502 0 10.822-4.57 10.822-11.025 0-.742-.08-1.305-.18-1.854H12.24z" />
                  </svg>
                  Sign up with Google
                </Button>
              </form>

              <div className="text-center text-sm text-stone-500 mt-6">
                Already have an account?{" "}
                <button
                  className="font-semibold text-amber-800 hover:text-amber-900 underline transition-colors cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;