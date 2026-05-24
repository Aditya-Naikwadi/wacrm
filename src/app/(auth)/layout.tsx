import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MessageSquare, Sparkles, Zap, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 font-sans flex flex-col lg:flex-row">
      
      {/* Dynamic Animated Background Mesh - Visible Everywhere */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-45">
        {/* Neon Cosmic Grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" 
        />
        
        {/* Animated Radial Gradients */}
        <div 
          className="absolute -top-[40%] -left-[20%] h-[100%] w-[100%] rounded-full bg-[radial-gradient(circle_at_center,var(--primary-soft-2)_0%,transparent_70%)] animate-pulse"
          style={{ animationDuration: "12s" }}
        />
        <div 
          className="absolute -bottom-[30%] -right-[10%] h-[90%] w-[90%] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.645_0.22_16_/_0.15)_0%,transparent_60%)] animate-pulse"
          style={{ animationDuration: "18s", animationDelay: "2s" }}
        />
        <div 
          className="absolute top-[20%] left-[40%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle_at_center,var(--primary-soft)_0%,transparent_65%)] animate-pulse"
          style={{ animationDuration: "15s", animationDelay: "4s" }}
        />
      </div>

      {/* LEFT PANEL: 3D Product Showcase & Copy (Desktop Only) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 z-10 overflow-hidden border-r border-slate-900 bg-slate-950/40 backdrop-blur-md">
        
        {/* Header/Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            wacrm<span className="text-primary">.</span>
          </span>
        </div>

        {/* 3D Graphic Content Showcase Area */}
        <div className="relative my-auto py-12 flex flex-col items-center justify-center">
          
          {/* Subtle Rotating Light rays behind */}
          <div className="absolute w-[500px] h-[500px] bg-[conic-gradient(from_0deg,transparent,var(--primary-soft),transparent,var(--primary-soft-2),transparent)] opacity-20 rounded-full blur-3xl animate-spin" style={{ animationDuration: "40s" }} />

          {/* Core Graphic Wrapper with 3D Float */}
          <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
            
            {/* The Glassmorphic Dashboard Card */}
            <div className="relative w-[340px] rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-xl z-20 overflow-hidden group">
              {/* Highlight sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              
              {/* Dashboard Mock Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="h-2.5 w-24 rounded bg-slate-800" />
              </div>

              {/* Chat Thread Mocks */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary shadow-sm">AD</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-16 rounded bg-slate-200" />
                      <div className="h-1.5 w-6 rounded bg-slate-600" />
                    </div>
                    <div className="h-3 w-full rounded bg-slate-800" />
                  </div>
                </div>
                
                <div className="flex items-start gap-3 pl-8">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-20 rounded bg-primary/60" />
                      <div className="h-1.5 w-6 rounded bg-slate-600" />
                    </div>
                    <div className="h-3.5 w-[90%] rounded bg-primary/20 border border-primary/10 p-1 flex items-center"><div className="h-1.5 w-full bg-primary/40 rounded-full" /></div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-400">US</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-12 rounded bg-slate-400" />
                      <div className="h-1.5 w-6 rounded bg-slate-600" />
                    </div>
                    <div className="h-3 w-3/4 rounded bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING 3D GLASS SPHERE (Background Layer) */}
            <div 
              className="absolute -top-8 -left-8 w-28 h-28 rounded-full z-10 shadow-[inset_-10px_-10px_25px_rgba(0,0,0,0.5),10px_10px_25px_rgba(0,0,0,0.3)] bg-radial-[circle_at_30%_30%] from-white/20 via-white/5 to-transparent backdrop-blur-[2px] border border-white/20 animate-[float-delayed_7s_ease-in-out_infinite]"
            />

            {/* FLOATING 3D WHATSAPP CHAT BUBBLE (Foreground Layer) */}
            <div 
              className="absolute -bottom-6 -right-6 w-36 rounded-2xl border border-emerald-500/20 bg-emerald-950/60 p-4 shadow-[0_15px_30px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.1)] backdrop-blur-xl z-30 flex items-center gap-3 animate-[float_5s_ease-in-out_infinite]"
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <MessageSquare className="h-4.5 w-4.5 text-emerald-950 stroke-[2.5]" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="h-2 w-16 rounded bg-emerald-400" />
                <div className="h-1.5 w-12 rounded bg-emerald-600" />
              </div>
            </div>

            {/* FLOATING 3D GLASS CONE / PYRAMID (Gradient Accent Layer) */}
            <div 
              className="absolute -bottom-12 -left-12 w-20 h-20 z-0 bg-gradient-to-tr from-primary/30 to-purple-500/10 rounded-br-[40px] rounded-tl-[40px] rotate-45 blur-[1px] border border-white/5 shadow-2xl animate-[float-delayed_9s_ease-in-out_infinite]"
            />
          </div>

          {/* Features Highlights underneath */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-medium text-slate-300">Automations</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-medium text-slate-300">Shared Inbox</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-medium text-slate-300">Broadcasts</span>
            </div>
          </div>
        </div>

        {/* Footer Copy */}
        <div className="flex justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} wacrm. All rights reserved.</p>
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
        </div>
      </div>

      {/* RIGHT PANEL: Auth Card Form Display */}
      <div className="relative flex-1 flex flex-col justify-center items-center px-4 py-12 lg:px-8 xl:px-12 z-10">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-8 left-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            wacrm<span className="text-primary">.</span>
          </span>
        </div>

        {/* Dynamic transition block wrapper */}
        <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out_1]">
          {children}
        </div>
      </div>

      {/* Embedded CSS Animations for Glass and Float */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin {
          animation: spin 60s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
