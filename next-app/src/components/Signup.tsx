"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createSessionCookie } from "@/actions/auth-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FaGoogle, FaLock, FaEnvelope, FaUser } from "react-icons/fa"
import { Stethoscope, Loader2, ArrowRight, CheckCircle2, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { auth } from "@/lib/firebase/config"

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const { signUp, googleSignIn } = useAuth()
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, name);
      // Get the ID token to create a session cookie
      const idToken = await auth.currentUser?.getIdToken(true);
      if (idToken) {
        const result = await createSessionCookie(idToken);
        if (result.success) {
          setSignupSuccess(true);
          toast.success("Account created successfully!");
          
          // Redirect to onboarding instead of dashboard
          setTimeout(() => {
            router.push("/onboarding");
          }, 1000);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
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
          setSignupSuccess(true)
          toast.success("Signed up successfully with Google!")

          // Delay redirect to show success animation
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to sign up with Google.")
    }
  }

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" }

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    const labels = ["Weak", "Fair", "Good", "Strong"]
    return {
      strength,
      label: strength > 0 ? labels[strength - 1] : "",
    }
  }

  const passwordStrength = getPasswordStrength(password)
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]

  return (
    <div className="relative w-full max-w-md">
      {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full p-6 space-y-4 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-slate-200 dark:border-slate-700"
      >
        {signupSuccess ? (
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Created!</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Redirecting you to your dashboard...</p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/30">
                <Stethoscope className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create an Account</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Join MedAlpine and access tailored medical research
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="w-4 h-4 text-slate-400" />
                  </div>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-400"
                    placeholder="Dr. John Doe"
                  />
                </div>
              </div>

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
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
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

                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Password strength:
                        <span
                          className={`ml-1 font-medium ${
                            passwordStrength.strength === 0
                              ? "text-slate-400"
                              : passwordStrength.strength === 1
                                ? "text-red-500"
                                : passwordStrength.strength === 2
                                  ? "text-orange-500"
                                  : passwordStrength.strength === 3
                                    ? "text-yellow-500"
                                    : "text-green-500"
                          }`}
                        >
                          {passwordStrength.label || "Too weak"}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-full w-1/4 ${i < passwordStrength.strength ? strengthColors[i] : "bg-transparent"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="w-4 h-4 text-slate-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`pl-10 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-400 ${
                      confirmPassword && password !== confirmPassword ? "border-red-500 dark:border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200 h-11"
                  disabled={isLoading || (!!confirmPassword && password !== confirmPassword)}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign up
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
                Sign up with Google
              </Button>
            </motion.div>

            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/login"
                className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 transition-colors"
              >
                Sign in
              </motion.a>
            </p>

            {/* Security badge */}
            <div className="flex items-center justify-center pt-2 text-xs text-slate-500 dark:text-slate-500">
              <Shield className="w-3 h-3 mr-1" />
              Your data is securely encrypted
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
