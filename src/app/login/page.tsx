"use client";
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

const bgImage = "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message'); // Grabs the "Account Created" message from the URL
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
const error1 = searchParams.get("error");
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  // 2. Use NextAuth's signIn instead of fetch()
  const result = await signIn("credentials", {
    redirect: false, // We handle the redirect ourselves
    email: formData.email,
    password: formData.password,
  });

  if (result?.error) {
    setError("Invalid email or password");
    setIsLoading(false);
  } else {
    // 3. Success! Now the user has a real "Session"
    router.push("/dashboard");
  }
};

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={bgImage} alt="Background" fill className="object-cover blur-sm brightness-50" priority />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Success Message from Signup */}
        {message && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-sm rounded-xl flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-white/60 mt-2">Sign in to manage your green credits.</p>
          </div>
{error1 === "AccountExists" && (
  <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/30 text-amber-200 text-sm rounded-xl text-center">
    This email is already registered with a password. Please log in with your credentials to link your Google account.
  </div>
)}
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-200 text-sm rounded-xl text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-widest mb-2 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5 group-focus-within:text-white" />
                <input 
                  type="email" required placeholder="johndoe@gmail.com"
                  className="w-full bg-white/5 border border-white/30 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-white/60 focus:bg-white/10 transition-all"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5 group-focus-within:text-white" />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/30 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-white/60 focus:bg-white/10 transition-all"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 transition-all">
              {isLoading ? <><Loader2 className="animate-spin" size={18} /> Verifying...</> : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/80">
            Don't have an account? <Link href="/signup" className="text-blue-400 font-bold hover:underline ml-1">Sign Up</Link>
          </div>
        </div>
        {/* Divider */}
<div className="relative my-8">
  <div className="absolute inset-0 flex items-center" aria-hidden="true">
    {/* This is the line */}
    <div className="w-full border-t border-white/10"></div>
  </div>
  <div className="relative flex justify-center text-xs uppercase font-medium">
    {/* Change 'bg-transparent' to a color that matches your background image's dark areas */}
    {/* Using a dark hex like #111827 (Tailwind's gray-900) usually works best for dark themes */}
    <span className="bg-[#0f172a] px-4 text-white tracking-widest">
      Or continue with
    </span>
  </div>
</div>

{/* Google Button */}
<button
  type="button"
  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg border border-white/30 transition-all flex items-center justify-center gap-3 active:scale-95"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
    />
  </svg>
  Sign in with Google
</button>
      </div>
    </div>
  );
}