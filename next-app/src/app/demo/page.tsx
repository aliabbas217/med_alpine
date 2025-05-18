import { Metadata } from "next";
import { ArrowLeft, Brain, BookOpen, HeartPulse, Sparkles, FileSearch } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MedAlpine Demo",
  description: "Watch a demonstration of the MedAlpine medical assistant in action"
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-12 max-w-5xl">
        <header className="mb-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white text-center">
            Med<span className="text-teal-600 dark:text-teal-400">Alpine</span> Demo
          </h1>
          
          <p className="mt-4 text-center text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            See how MedAlpine helps physicians analyze medical cases with evidence-based insights from the latest research
          </p>
        </header>
        
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-teal-200/50 shadow-xl dark:border-teal-500/20 mb-12 bg-black">
          <video 
            controls
            poster="/demo-thumbnail.jpg"
            className="w-full h-full"
            preload="metadata"
          >
            <source src="/videos/demo-final.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About this Demo</h2>
          
          <p className="text-slate-600 dark:text-slate-400">
            This demonstration showcases how MedAlpine helps healthcare professionals analyze complex medical cases
            by providing evidence-based insights powered by the latest research papers. Our AI-driven platform bridges the gap between
            the rapidly expanding medical literature and clinical practice.
          </p>
          
          <h3 className="text-xl font-semibold mt-8 text-slate-900 dark:text-white">Key Features Demonstrated</h3>
          
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            <div className="flex p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 mr-4 flex-shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Case Analysis</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Submit comprehensive case details and receive AI-generated diagnostic insights
                </p>
              </div>
            </div>
            
            <div className="flex p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 mr-4 flex-shrink-0">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Evidence Retrieval</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Automatically find relevant research papers based on case details
                </p>
              </div>
            </div>
            
            <div className="flex p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 mr-4 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Medical Term Normalization</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Converting layman's terms to proper medical terminology for accurate matching
                </p>
              </div>
            </div>
            
            <div className="flex p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 mr-4 flex-shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Specialty Focus</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Filter insights by relevant medical specialties for targeted assistance
                </p>
              </div>
            </div>
          </div>
          
          <div className="my-12 p-6 rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-900/20">
            <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-300 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" /> 
              Why MedAlpine Matters
            </h3>
            <p className="mt-2 text-teal-700 dark:text-teal-400">
              Medical knowledge doubles approximately every 73 days. Physicians struggle to keep up with this pace
              while maintaining busy clinical practices. MedAlpine addresses this challenge by providing instant access to 
              relevant research evidence at the point of clinical decision-making.
            </p>
          </div>
          
          <h3 className="text-xl font-semibold mt-8 text-slate-900 dark:text-white">How It Works</h3>
          
          <ol className="list-decimal pl-6 space-y-4 my-6">
            <li className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">Input case details</span>: Enter patient history, symptoms, and your initial assessment
            </li>
            <li className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">Select specialties</span>: Choose relevant medical fields for more focused results
            </li>
            <li className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">Retrieve evidence</span>: Our AI finds the most relevant research papers from our database
            </li>
            <li className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">Generate insights</span>: Receive a comprehensive analysis based on the latest medical evidence
            </li>
          </ol>
          
          <div className="mt-10 flex justify-center">
            <Link 
              href="/signin" 
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
            >
              Try MedAlpine Now
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-700 py-6 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} MedAlpine. All rights reserved.
        </div>
      </footer>
    </div>
  );
}