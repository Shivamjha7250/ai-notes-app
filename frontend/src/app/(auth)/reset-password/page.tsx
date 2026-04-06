"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { api } from "@/lib/api";
import { Lock, Hash, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!otp || !password) return alert("Please enter OTP and new password");

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password, 
      });
      
      alert("Password updated successfully!");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1A3D] p-4 relative overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0066FF] opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00BFFF] opacity-20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl space-y-6 relative z-10">
        

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#0066FF] to-[#00BFFF] mb-2 shadow-lg shadow-blue-500/20">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">New Password</h1>
          <p className="text-blue-200/60 text-sm">
            Enter the OTP sent to <span className="text-blue-400 font-medium">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Verification Code</label>
            <div className="relative group">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5 group-focus-within:text-blue-300 transition-colors" />
              <input
                type="text"
                placeholder="6-digit OTP"
                maxLength={6}
                className="w-full bg-white/5 border border-white/10 p-3 pl-11 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 focus:border-[#0066FF] transition-all"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5 group-focus-within:text-blue-300 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 p-3 pl-11 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 focus:border-[#0066FF] transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0066FF] to-[#00BFFF] text-white p-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Update Password"
            )}
          </button>
        </div>

        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A1A3D] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}