import { Metadata } from "next";
import { LoginForm } from "@/components/Login";
import { getCurrentUser } from "@/actions/auth-actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | MedAlpine",
  description: "Sign in to your MedAlpine account",
};

export default async function LoginPage() {
  // Check if user is already logged in
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Left side with pattern/gradient */}
      <div className="hidden w-1/2 lg:block relative overflow-hidden">
        {/* Background gradient - made slightly more subtle */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700"></div>
        
        {/* More subtle line-based pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="subtleLines" patternUnits="userSpaceOnUse" width="120" height="120" patternTransform="scale(1) rotate(0)">
                <line x1="0" y1="0" x2="120" y2="120" stroke="white" strokeWidth="1" />
                <line x1="120" y1="0" x2="0" y2="120" stroke="white" strokeWidth="1" />
                <line x1="60" y1="0" x2="60" y2="120" stroke="white" strokeWidth="1" />
                <line x1="0" y1="60" x2="120" y2="60" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#subtleLines)"/>
          </svg>
        </div>
        
        {/* More subtle decorative elements */}
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-teal-400/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan-400/10 rounded-full blur-[100px]"></div>
        
        {/* Content with improved contrast for readability */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <h1 className="mb-4 text-3xl font-bold text-white drop-shadow-sm">Welcome to MedAlpine</h1>
          <p className="mb-8 text-xl text-center max-w-md text-white/90 drop-shadow-sm">
            Access cutting-edge medical research tailored to your specialty and stay at the forefront of medical knowledge.
          </p>
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
            <blockquote className="italic text-lg text-white/90">
              "MedAlpine helps me stay updated with the latest research in my field, saving me countless hours of searching."
            </blockquote>
            <div className="mt-4 text-sm text-white/80">
              - Dr. Sarah Johnson, Cardiologist
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}