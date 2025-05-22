import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Users,
  FileSearch,
  Brain,
  BarChart3,
  HeartPulse,
  Stethoscope,
  LogIn,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <div className="relative z-20 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container px-4 mx-auto flex items-center justify-between h-16 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="relative w-8 h-8 mr-2">
              <Image src="/logo.svg" alt="MedAlpine Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">MedAlpine</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-1.5">
                <LogIn className="h-4 w-4" />
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="container relative z-10 px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-12 h-12 mr-4">
                <Image src="/logo.svg" alt="MedAlpine Logo" fill className="object-contain" priority />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
                Med<span className="text-teal-600 dark:text-teal-400">Alpine</span>
              </h1>
            </div>

            <p className="mt-6 text-xl text-slate-700 dark:text-slate-300">
              Climb to new heights of medical knowledge with AI-powered research assistance
            </p>

            <div className="inline-flex items-center px-4 py-1.5 mt-4 text-xs font-medium rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Powered by advanced AI for medical professionals
            </div>

            {/* Problem Statement */}
            <div className="mt-8 p-5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex flex-col items-center">
                  <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">73</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-[150px] text-center">
                    Days for medical knowledge to double
                  </p>
                </div>
                <div className="h-12 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                <div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium text-center sm:text-left">
                    The modern physician's challenge: <span className="text-teal-600 dark:text-teal-400">evidence-based practice</span> in an era of information overload
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
                    MedAlpine helps you navigate the rapidly expanding medical literature with AI-powered insights
                  </p>
                </div>
              </div>
            </div>

            <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-600 dark:text-slate-400">
              Stay on top of the latest medical research tailored to your specialty. Over 1 million papers published
              annually, now filtered and personalized just for you.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20 gap-1"
                >
                  <BookOpen className="w-4 h-4 mr-1" /> Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto -mb-16">
          <div className="overflow-hidden rounded-xl border border-teal-200/50 shadow-xl dark:border-teal-500/20">
            <Image
              src="/dashboard-preview.png"
              alt="MedAlpine Dashboard Preview"
              width={1200}
              height={675}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-24 pb-16 bg-white dark:bg-slate-800">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Designed for the modern medical professional
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              MedAlpine helps doctors stay updated with the latest research and evidence-based practice
            </p>
          </div>

          <div className="grid max-w-5xl gap-8 mx-auto mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">Personalized Research Feed</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Receive tailored research papers based on your specialty and interests, updated daily
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">AI Research Assistant</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Ask questions and receive evidence-based answers with direct citations from medical literature
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">Diagnostic Simulator</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Practice diagnostic reasoning with AI-powered virtual patient scenarios
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">Physician Community</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Collaborate with peers through topic-based discussions and knowledge sharing
              </p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">Smart Bookmarking</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Save and organize research papers with intelligent categorization and search
              </p>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">Analytics Dashboard</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Track your learning progress and research engagement with detailed insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with improved design */}
      <section className="py-16 bg-gradient-to-r from-teal-50 via-slate-50 to-teal-50 dark:from-teal-900/20 dark:via-slate-900 dark:to-teal-900/20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Transforming medical research
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Helping physicians stay at the forefront of medical knowledge
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="p-6 text-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <FileSearch className="w-6 h-6" />
              </div>
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">1M+</div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">Research papers processed annually</div>
            </div>

            <div className="p-6 text-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <Brain className="w-6 h-6" />
              </div>
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">72</div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Days in which medical knowledge doubles
              </div>
            </div>

            <div className="p-6 text-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">24/7</div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">Access to personalized research</div>
            </div>

            <div className="p-6 text-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">100%</div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">Evidence-based insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced with multiple testimonials */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Trusted by medical professionals
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              See what physicians are saying about MedAlpine
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <Image
                    src="/avatar-doctor.jpg"
                    alt="Dr. Sarah Johnson"
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-slate-900 dark:text-white">Dr. Sarah Johnson</p>
                  <p className="text-slate-600 dark:text-slate-400">Cardiologist, Mayo Clinic</p>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                "MedAlpine has transformed how I keep up with cardiology research. I save hours weekly and discover
                relevant studies I would have otherwise missed."
              </p>
            </div>

            <div className="p-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <Image
                    src="/avatar-doctor.jpg"
                    alt="Dr. Michael Chen"
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-slate-900 dark:text-white">Dr. Michael Chen</p>
                  <p className="text-slate-600 dark:text-slate-400">Neurologist, Johns Hopkins</p>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                "The AI research assistant helps me quickly understand new findings and apply them to patient care. It's
                like having a research team at my fingertips."
              </p>
            </div>

            <div className="p-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <Image
                    src="/avatar-doctor.jpg"
                    alt="Dr. Emily Rodriguez"
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-slate-900 dark:text-white">Dr. Emily Rodriguez</p>
                  <p className="text-slate-600 dark:text-slate-400">Pediatrician, Children's Hospital</p>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                "The diagnostic simulator has been invaluable for my residents. It provides realistic cases that help
                them develop critical thinking skills in a safe environment."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced with medical imagery */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800 dark:from-teal-800 dark:to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63"
              fill="none"
              stroke="white"
              strokeWidth="100"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="container relative px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your medical research workflow?
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-teal-100">
            Join thousands of physicians who are staying at the forefront of medical knowledge with MedAlpine.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-teal-700 hover:bg-teal-50 shadow-lg hover:shadow-xl transition-all gap-2"
              >
                Get Started Today <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 gap-1"
              >
                <BookOpen className="w-4 h-4 mr-1" /> Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced with better organization */}
      <footer className="py-12 bg-white dark:bg-slate-800">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="relative w-8 h-8 mr-2">
                  <Image src="/logo.svg" alt="MedAlpine Logo" fill className="object-contain" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">MedAlpine</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                Helping physicians climb to new heights of medical knowledge with AI-powered research assistance. Our
                platform is designed to keep medical professionals at the cutting edge of their field.
              </p>
              <div className="flex gap-4 mt-6">
                <Link
                  href="#"
                  className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demo"
                    className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                  >
                    Demo
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} MedAlpine. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}