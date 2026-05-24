"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { MessageSquare, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { use3DTilt } from "@/hooks/use-3d-tilt";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Custom 3D Tilt Hook
  const { ref, style, glowStyle } = use3DTilt(8);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

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
              <MessageSquare className="h-7 w-7 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white [transform:translateZ(20px)]">
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1 [transform:translateZ(15px)] text-sm">
              Sign in to manage your WhatsApp CRM pipeline
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
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

              {/* Password Input */}
              <div className="flex flex-col gap-2 group [transform:translateZ(10px)]">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-slate-300 text-xs font-semibold tracking-wider uppercase group-focus-within:text-primary transition-colors">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4.5 w-4.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Workspace</span>
                    <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400 [transform:translateZ(10px)]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary-hover font-semibold transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-primary transition-all duration-300"
              >
                Create account
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
