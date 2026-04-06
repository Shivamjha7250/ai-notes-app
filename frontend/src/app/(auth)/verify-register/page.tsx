"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { ShieldCheck, BrainCircuit, ArrowLeft } from "lucide-react";
import Link from "next/link";

function VerifyRegisterContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return setError("Please enter the OTP");

    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-register", { email, otp });
      router.push("/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid OTP or request failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050A18] relative overflow-hidden font-sans text-white p-4">
      

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,102,255,0.15)_0%,_transparent_70%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px]" />

      <div className="z-10 w-full max-w-md">
        
  
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3.5 bg-gradient-to-br from-[#0066FF] to-[#00BFFF] rounded-3xl shadow-[0_0_40px_rgba(0,102,255,0.6)]"
          >
            <BrainCircuit size={44} className="text-white" />
          </motion.div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-center uppercase tracking-[2px]">Verify Email</h1>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-9">
            <h2 className="text-2xl font-bold">Registration Almost Done!</h2>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              We've sent a 6-digit verification code to <br />
              <span className="text-blue-400 font-medium break-all">{email}</span>
            </p>
          </div>

      
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded-xl mb-6 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Verification Code</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={22} />
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-gray-700 tracking-[10px] text-center text-2xl font-bold text-blue-400"
                />
              </div>
            </div>

            <motion.button 
              type="submit"
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-[#6366f1] via-[#0066FF] to-[#00BFFF] py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-60 text-white"
            >
              {loading ? "Verifying Account..." : "Confirm Registration"}
            </motion.button>
          </form>

  
          <div className="mt-8 flex flex-col items-center gap-5">
            <p className="text-sm text-gray-400">
              Didn't receive the code?{" "}
              <button type="button" className="text-blue-400 font-semibold hover:underline">Resend OTP</button>
            </p>
            
            <Link 
              href="/register" 
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Register
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyRegister() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050A18] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyRegisterContent />
    </Suspense>
  );
}