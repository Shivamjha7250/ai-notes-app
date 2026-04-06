"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; 
import { Mail, KeyRound, BrainCircuit, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); 

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });

      setSuccess(true);
  
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {

      setError(err.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050A18] relative overflow-hidden font-sans text-white p-4">
      
  
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,102,255,0.15)_0%,_transparent_70%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px]" />

      <div className="z-10 w-full max-w-md px-6">
        
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3.5 bg-gradient-to-br from-[#0066FF] to-[#00BFFF] rounded-3xl shadow-[0_0_40px_rgba(0,102,255,0.6)]"
          >
            <BrainCircuit size={44} className="text-white" />
          </motion.div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight uppercase tracking-[2px]">AI Notes</h1>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Reset Password</h2>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">Enter your email and we'll send you a six-digit code to reset your password.</p>
          </div>


          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-4 rounded-xl mb-7 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-200 text-sm p-4 rounded-xl mb-7 text-center">
              Password reset code has been sent.
            </div>
          )}

          <form onSubmit={handle} className="space-y-7">
            <div className="space-y-2.5">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <motion.button 
              type="submit"
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-[#6366f1] via-[#0066FF] to-[#00BFFF] py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
            </motion.button>
          </form>

          <div className="mt-10 text-center flex justify-center">
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-400 font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}