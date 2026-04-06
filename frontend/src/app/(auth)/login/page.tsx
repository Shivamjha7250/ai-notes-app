"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Lock, Mail, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", otp: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      alert(res.data.message);
      setStep(2);
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-login", {
        email: formData.email,
        otp: formData.otp,
      });
      localStorage.setItem("token", res.data.token);
      alert("Login Successful!");
      router.push("/dashboard"); 
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1A3D] p-4 relative overflow-hidden font-sans">
  
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#0066FF] opacity-20 blur-[130px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#00BFFF] opacity-20 blur-[130px] rounded-full"></div>

      <div className="w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-8 relative z-10">
        
    
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-[#00BFFF] mb-4 rotate-3 shadow-xl shadow-blue-500/20 transition-transform hover:rotate-0">
            {step === 1 ? <UserCheck className="text-white w-10 h-10" /> : <ShieldCheck className="text-white w-10 h-10" />}
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight italic">
            {step === 1 ? "Welcome Back" : "Security Check"}
          </h1>
          <p className="text-blue-200/60 text-sm font-medium">
            {step === 1 ? "Access your future-ready AI notes" : `Enter the 6-digit code sent to your email`}
          </p>
        </div>

        <form onSubmit={step === 1 ? handleLogin : handleVerifyOTP} className="space-y-5">
          {step === 1 ? (
            <>
      
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-300 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5 group-focus-within:text-blue-300 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="shivam@gmail.com"
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/40 focus:border-[#0066FF] transition-all"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

        
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-blue-300 uppercase tracking-widest">Password</label>
                  <Link href={`/forgot-password?email=${formData.email}`} className="text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5 group-focus-within:text-blue-300 transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/40 focus:border-[#0066FF] transition-all"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-300 uppercase tracking-widest ml-1 text-center block">One-Time Password</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5 group-focus-within:text-blue-300 transition-colors" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="000000"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white text-center text-2xl tracking-[0.5em] font-mono placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/40 focus:border-[#00BFFF] transition-all"
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0066FF] to-[#00BFFF] text-white p-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(0,102,255,0.3)] hover:shadow-[0_15px_40px_rgba(0,102,255,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {step === 1 ? "Sign In" : "Verify & Enter"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
              Create One
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}