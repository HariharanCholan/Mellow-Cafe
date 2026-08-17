import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Coffee } from "lucide-react";
import API_BASE_URL from "@/config/api";

import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

const user = result.user;

// 🔥 Send actual user data
const payload = {
  email: user.email,
  name: user.displayName,
  picture: user.photoURL,
};

console.log("Google Payload:", payload); // debug

const response = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Google Login Failed",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      toast({ title: "Logged in!", description: "Using Google" });
      navigate("/");
    } catch (err) {
      toast({
        title: "Google Login Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("userEmail", data.user.email);
      toast({ title: "Success!", description: "Login successful" });
      navigate("/");
    } catch (error) {
      toast({
        title: "Server Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Mellow Café</title>
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
                Welcome Back
              </CardTitle>
              <p className="text-sm text-stone-500 mt-1">
                Enter your details to access your account
              </p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-4">

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    onChange={handleChange} 
                    required 
                    className="border-stone-200 focus-visible:ring-amber-800/20 focus-visible:border-amber-800 bg-stone-50/50"
                  />
                </div>

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

                <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2 rounded-md transition-colors mt-6 cursor-pointer">
                  Login
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-stone-400">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-300 font-medium py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {/* Google Logo Icon */}
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.29 1.926 15.474 1 12.24 1 6.01 1 1 6.01 1 12.24s5.01 11.24 11.24 11.24c6.502 0 10.822-4.57 10.822-11.025 0-.742-.08-1.305-.18-1.854H12.24z"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </form>

              <div className="text-center text-sm text-stone-500 mt-6">
                Don't have an account?
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-semibold text-amber-800 hover:text-amber-900 ml-1 underline transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
