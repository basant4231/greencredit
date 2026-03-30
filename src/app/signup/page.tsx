"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Key, Loader2, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import AuthHero from "@/component/AuthHero";
import glassStyles from "@/styles/auth/AuthGlass.module.css";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) return setError("Password must be 8+ characters");

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");

      setStep(2);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid OTP");

      router.push("/login?message=Email verified! You can now log in.");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthHero>
      <div id="auth-form" className="w-full max-w-md">
        <div className={`${glassStyles.card} p-8`}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {step === 1 ? "Create Account" : "Verify Email"}
            </h1>
            <p className="mt-2 text-white/60">
              {step === 1 ? "Join the EcoCredit movement" : `Enter the code sent to ${formData.email}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/20 p-3 text-center text-sm text-red-200">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div className="group relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60 group-focus-within:text-white" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full rounded-lg border border-white/30 bg-white/5 py-3 pl-12 pr-4 text-white focus:border-white/60 focus:bg-white/10 focus:outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60 group-focus-within:text-white" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full rounded-lg border border-white/30 bg-white/5 py-3 pl-12 pr-4 text-white focus:border-white/60 focus:bg-white/10 focus:outline-none"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60 group-focus-within:text-white" />
                <input
                  type="password"
                  required
                  placeholder="Password (8+ chars)"
                  className="w-full rounded-lg border border-white/30 bg-white/5 py-3 pl-12 pr-4 text-white focus:border-white/60 focus:bg-white/10 focus:outline-none"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/30 bg-white/10 py-3 font-medium text-white transition-all hover:bg-white/20 active:scale-95 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <><span>Next</span><ArrowRight size={18} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div className="group relative">
                <Key className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60 group-focus-within:text-white" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  autoComplete="one-time-code"
                  placeholder="000000"
                  className="w-full rounded-lg border border-white/30 bg-white/5 py-3 pl-4 pr-4 text-center font-bold tracking-[1em] text-white focus:border-emerald-500 focus:outline-none"
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 font-bold text-white shadow-lg hover:bg-blue-600"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Verify & Create Account"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-white/50 hover:text-white"
              >
                Back to Signup
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-white/80">
            Already a member?
            <Link href="/login" className="ml-1 font-bold text-emerald-400 hover:underline">
              Log in
            </Link>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs font-medium uppercase">
              <span className="bg-[#0f172a] px-4 tracking-widest text-white">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/30 bg-white/10 py-3 font-medium text-white transition-all hover:bg-white/20 active:scale-95"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </AuthHero>
  );
}
