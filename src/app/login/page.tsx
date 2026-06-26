"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Heart, Cake } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CakeImage from "@/components/CakeImage";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", remember: true });
  const router = useRouter();
  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        setLoading(false);
        return;
      }
      toast.success(mode === "login" ? "Welcome back! 🎉" : "Account created! 🎂");
      await refresh();
      router.push(data.user?.role === "admin" ? "/admin" : "/");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 lg:p-8 bg-bakery-pattern">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-cake">
        {/* Left - Banner */}
        <div className="relative hidden lg:block bg-gradient-to-br from-blush-400 via-blush-500 to-cocoa-500 p-12 overflow-hidden">
          <div className="absolute top-10 right-10 animate-float opacity-60">
            <CakeImage seed="login-1" variant="cupcake" className="w-32 h-32" />
          </div>
          <div className="absolute bottom-20 left-5 animate-float-slow opacity-50">
            <CakeImage seed="login-2" variant="chocolate" className="w-40 h-40" />
          </div>
          <div className="absolute top-1/3 left-1/2 animate-float opacity-40">
            <CakeImage seed="login-3" variant="birthday" className="w-24 h-24" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between text-white">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Cake className="w-7 h-7" />
                </div>
                <span className="font-display text-2xl font-bold">Sweet Delights</span>
              </div>
              <h2 className="font-display text-5xl font-bold leading-tight mb-4">
                Welcome to the<br />Sweetest Place<br />on the Internet
              </h2>
              <p className="text-lg text-white/90 max-w-md">
                Join thousands of happy customers who trust us for their sweetest moments.
              </p>
            </div>

            <div className="glass-dark rounded-2xl p-6 mt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2">
                  {["👩", "👨", "👰"].map((e, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur border-2 border-white flex items-center justify-center"
                    >
                      {e}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-semibold">10,000+ Happy Customers</div>
                  <div className="text-sm text-white/80">⭐⭐⭐⭐⭐ 4.9/5 rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="glass p-8 lg:p-12 flex flex-col justify-center bg-white/80">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-display text-4xl font-bold text-cocoa-600 mb-2">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-cocoa-400 mb-8">
                {mode === "login"
                  ? "Sign in to access your orders and favorites"
                  : "Join us and get 10% off your first order!"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "signup" && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cocoa-300" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none transition-colors bg-white/70"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cocoa-300" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none transition-colors bg-white/70"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cocoa-300" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none transition-colors bg-white/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cocoa-300 hover:text-cocoa-500"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {mode === "login" && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-cocoa-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                        className="w-4 h-4 rounded border-blush-300 text-blush-500 focus:ring-blush-500"
                      />
                      Remember me
                    </label>
                    <a href="#" className="text-blush-600 hover:text-blush-700 font-medium">
                      Forgot password?
                    </a>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake hover:shadow-xl disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Please wait...
                    </>
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-blush-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/70 text-cocoa-400">Or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => toast.error("Social login not configured")}
                    className="py-3 rounded-2xl border-2 border-blush-100 bg-white/70 hover:bg-blush-50 font-semibold text-cocoa-500 flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.error("Social login not configured")}
                    className="py-3 rounded-2xl border-2 border-blush-100 bg-white/70 hover:bg-blush-50 font-semibold text-cocoa-500 flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>

                <p className="text-center text-cocoa-400 mt-6">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-blush-600 hover:text-blush-700 font-semibold"
                  >
                    {mode === "login" ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
