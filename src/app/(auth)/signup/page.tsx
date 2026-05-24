"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, User, Mail, Lock, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { use3DTilt } from "@/hooks/use-3d-tilt";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  // Custom 3D Tilt Hook
  const { ref, style, glowStyle } = use3DTilt(8);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  // Real-time password hints
  const hasMinLength = password.length >= 6;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  if (success) {
    return (
      <div className="w-full flex items-center justify-center p-2 [perspective:1000px]">
        <Card 
          ref={ref}
          style={style}
          className="relative w-full max-w-md border-emerald-500/20 bg-slate-900/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-2xl p-1 transition-all duration-300 [transform-style:preserve-3d]"
        >
          {/* Green Glow Reflection */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-2xl z-0" 
            style={{
              opacity: 0.8,
              background: `radial-gradient(circle 200px at center, rgba(16, 185, 129, 0.15) 0%, transparent 80%)`,
            }} 
          />

          {/* Card Border Inner Overlay */}
          <div className="absolute inset-px rounded-[15px] bg-slate-950/80 z-0" />

          <div className="relative z-10 p-8 flex flex-col items-center text-center [transform:translateZ(10px)]">
            <CardHeader className="items-center text-center p-0 mb-6">
              {/* 3D Success Icon */}
              <div 
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-[0_4px_25px_rgba(16,185,129,0.2)] animate-bounce [transform:translateZ(30px)]"
                style={{ animationDuration: "3s" }}
              >
                <CheckCircle className="h-9 w-9 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white [transform:translateZ(20px)]">
                Check your email
              </CardTitle>
              <CardDescription className="text-slate-400 mt-2 px-2 [transform:translateZ(15px)] leading-relaxed">
                We&apos;ve sent a confirmation link to <span className="text-white font-semibold">{email}</span>.
                Please check your inbox and click the link to activate your workspace.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0 w-full mt-2">
              <Link href="/login" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl h-11 transition-all"
                >
                  Back to sign in
                </Button>
              </Link>
            </CardContent>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-2 [perspective:1000px]">
      <Card 
        ref={ref}
        style={style}
        className="relative w-full max-w-md border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-2xl p-1 transition-all duration-300 [transform-style:preserve-3d]"
      >
        
        {/* Glow Reflection Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl z-0" 
          style={glowStyle} 
        />

        {/* Card Border Inner Overlay */}
        <div className="absolute inset-px rounded-[15px] bg-slate-950/80 z-0" />

        <div className="relative z-10 p-6 flex flex-col [transform:translateZ(10px)]">
          <CardHeader className="items-center text-center p-0 mb-5">
            {/* 3D Floating Icon Box */}
            <div 
              className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_4px_20px_rgba(var(--primary),0.2)] [transform:translateZ(30px)] transition-all duration-300"
            >
              <Sparkles className="h-7 w-7 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white [transform:translateZ(20px)]">
              Create account
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1 [transform:translateZ(15px)] text-sm">
              Get started with wacrm for WhatsApp Teams
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-[shake_0.4s_ease-in-out_1]">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div className="flex flex-col gap-1.5 group [transform:translateZ(10px)]">
                <Label htmlFor="fullName" className="text-slate-400 text-xs font-semibold tracking-wider uppercase ml-1 group-focus-within:text-primary transition-colors">
                  Full Name
                </Label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 h-4.5 w-4.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="pl-11 h-10 border-slate-800 bg-slate-900/50 text-white placeholder:text-slate-600 rounded-xl focus-visible:border-primary/50 focus-visible:ring-primary/15 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5 group [transform:translateZ(10px)]">
                <Label htmlFor="email" className="text-slate-400 text-xs font-semibold tracking-wider uppercase ml-1 group-focus-within:text-primary transition-colors">
                  Email Address
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4.5 w-4.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 h-10 border-slate-800 bg-slate-900/50 text-white placeholder:text-slate-600 rounded-xl focus-visible:border-primary/50 focus-visible:ring-primary/15 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 group [transform:translateZ(10px)]">
                <Label htmlFor="password" className="text-slate-400 text-xs font-semibold tracking-wider uppercase ml-1 group-focus-within:text-primary transition-colors">
                  Password
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4.5 w-4.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-11 h-10 border-slate-800 bg-slate-900/50 text-white placeholder:text-slate-600 rounded-xl focus-visible:border-primary/50 focus-visible:ring-primary/15 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5 group [transform:translateZ(10px)]">
                <Label htmlFor="confirmPassword" className="text-slate-400 text-xs font-semibold tracking-wider uppercase ml-1 group-focus-within:text-primary transition-colors">
                  Confirm Password
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4.5 w-4.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-11 h-10 border-slate-800 bg-slate-900/50 text-white placeholder:text-slate-600 rounded-xl focus-visible:border-primary/50 focus-visible:ring-primary/15 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Dynamic Interactive Requirements */}
              <div className="mt-1 flex flex-col gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800/40 text-xs [transform:translateZ(5px)]">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full transition-all duration-300 ${hasMinLength ? "bg-emerald-500 shadow-[0_0_6px_var(--primary)]" : "bg-slate-700"}`} />
                  <span className={hasMinLength ? "text-emerald-400 transition-colors" : "text-slate-500 transition-colors"}>At least 6 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full transition-all duration-300 ${passwordsMatch ? "bg-emerald-500 shadow-[0_0_6px_var(--primary)]" : "bg-slate-700"}`} />
                  <span className={passwordsMatch ? "text-emerald-400 transition-colors" : "text-slate-500 transition-colors"}>Passwords match</span>
                </div>
              </div>

              {/* Create Button */}
              <Button
                type="submit"
                disabled={loading}
                className="relative mt-2 h-11 w-full bg-gradient-to-r from-primary to-primary-hover text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden group flex items-center justify-center gap-2 [transform:translateZ(15px)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Workspace Account</span>
                    <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-400 [transform:translateZ(10px)]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary-hover font-semibold transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-primary transition-all duration-300"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </div>
      </Card>

      {/* Shake Animation for Error */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}} />
    </div>
  );
}
