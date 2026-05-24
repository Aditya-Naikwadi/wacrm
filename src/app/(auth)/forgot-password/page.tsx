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
import { CheckCircle, ArrowLeft, Mail, Loader2, KeyRound } from "lucide-react";
import { use3DTilt } from "@/hooks/use-3d-tilt";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  // Custom 3D Tilt Hook
  const { ref, style, glowStyle } = use3DTilt(8);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

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
                Reset link sent
              </CardTitle>
              <CardDescription className="text-slate-400 mt-2 px-2 [transform:translateZ(15px)] leading-relaxed">
                We&apos;ve sent a password reset link to <span className="text-white font-semibold">{email}</span>.
                Please check your inbox to complete the password reset.
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
          <CardHeader className="items-center text-center p-0 mb-6">
            {/* 3D Floating Icon Box */}
            <div 
              className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_4px_20px_rgba(var(--primary),0.2)] [transform:translateZ(30px)] transition-all duration-300"
            >
              <KeyRound className="h-7 w-7 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white [transform:translateZ(20px)]">
              Reset password
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1 [transform:translateZ(15px)] text-sm">
              Enter your email and we&apos;ll send you a recovery link
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <form onSubmit={handleReset} className="flex flex-col gap-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-[shake_0.4s_ease-in-out_1]">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="flex flex-col gap-2 group [transform:translateZ(10px)]">
                <Label htmlFor="email" className="text-slate-300 text-xs font-semibold tracking-wider uppercase ml-1 group-focus-within:text-primary transition-colors">
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
                    className="pl-11 h-11 border-slate-800 bg-slate-900/50 text-white placeholder:text-slate-600 rounded-xl focus-visible:border-primary/50 focus-visible:ring-primary/15 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                disabled={loading}
                className="relative mt-2 h-11 w-full bg-gradient-to-r from-primary to-primary-hover text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden group flex items-center justify-center gap-2 [transform:translateZ(15px)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </Button>
            </form>

            <div className="mt-6 flex justify-center [transform:translateZ(10px)]">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white font-medium transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to sign in</span>
              </Link>
            </div>
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
