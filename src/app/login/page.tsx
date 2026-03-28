"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

const bgImage = "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const error1 = searchParams.get("error");

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0">
        <Image src={bgImage} alt="Background" fill className="object-cover blur-sm brightness-[0.2]" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-zinc-950/90" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {message && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold rounded-2xl flex items-center gap-2 backdrop-blur-xl">
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        <div className="bg-zinc-900/50 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-zinc-100 tracking-tight">Welcome Back</h1>
            <p className="text-zinc-500 font-medium mt-2">Sign in to manage your green credits.</p>
          </div>

          {error1 === "AccountExists" && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold rounded-2xl text-center">
              This email is already registered with a password. Please log in with your credentials to link your Google account.
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold rounded-2xl text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email" required placeholder="johndoe@gmail.com"
                  className="w-full bg-zinc-950/50 border border-white/10 text-zinc-100 placeholder:text-zinc-700 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-950 transition-all"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password" required placeholder="********"
                  className="w-full bg-zinc-950/50 border border-white/10 text-zinc-100 placeholder:text-zinc-700 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-950 transition-all"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-95">
              {isLoading ? <><Loader2 className="animate-spin" size={18} /> Verifying...</> : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-zinc-500">
            Don&apos;t have an account? <Link href="/signup" className="text-emerald-500 font-bold hover:text-emerald-400 ml-1 transition-colors">Sign Up</Link>
          </div>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black">
            <span className="bg-zinc-950 px-4 text-zinc-500 tracking-[0.2em]">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full bg-zinc-900/50 hover:bg-zinc-800 text-zinc-100 font-bold py-4 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="text-emerald-500 animate-spin" size={32} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
