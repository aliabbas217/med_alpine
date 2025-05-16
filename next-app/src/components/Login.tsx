"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase/config"
import { Input } from "@/components/ui/input"
import { createSessionCookie } from "@/actions/auth-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FaGoogle, FaLock, FaEnvelope } from "react-icons/fa"
import { HeartPulse, Loader2, ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const { login, googleSignIn } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      // Get the ID token to create a session cookie
      const idToken = await auth.currentUser?.getIdToken(true)
      if (idToken) {
        const result = await createSessionCookie(idToken)
        if (result.success) {
          setLoginSuccess(true)
          toast.success("You have successfully logged in!")

          // Delay redirect to show success animation
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to login. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn()
      // Get the ID token to create a session cookie
      const idToken = await auth.currentUser?.getIdToken(true)
      if (idToken) {
        const result = await createSessionCookie(idToken)
        if (result.success) {
          setLoginSuccess(true)
          toast.success("You have successfully logged in with Google!")

          // Delay redirect to show success animation
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to login with Google.")
    }
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full p-8 space-y-6 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-slate-200 dark:border-slate-700"
      >
        {loginSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-10 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/30">
                <CheckCircle2 className="w-12 h-12 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Login Successful!</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Redirecting you to your dashboard...</p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/30">
                <HeartPulse className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in to your MedAlpine account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="w-4 h-4 text-slate-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-400"
                    placeholder="doctor@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/forgot-password"
                    className="text-sm text-teal-600 hover:text-teal-500 dark:text-teal-400 transition-colors"
                  >
                    Forgot password?
                  </motion.a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="w-4 h-4 text-slate-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200 h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 text-slate-500 bg-white dark:bg-slate-800 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 h-11"
                onClick={handleGoogleSignIn}
              >
                <FaGoogle className="w-4 h-4 mr-2 text-red-500" />
                Sign in with Google
              </Button>
            </motion.div>

            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/signup"
                className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 transition-colors"
              >
                Sign up
              </motion.a>
            </p>

            {/* Security badge */}
            <div className="flex items-center justify-center pt-2 text-xs text-slate-500 dark:text-slate-500">
              <FaLock className="w-3 h-3 mr-1" />
              Secure, encrypted connection
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
