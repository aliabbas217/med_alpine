import { Metadata } from "next";
import { SignupForm } from "@/components/Signup";
import { getCurrentUser } from "@/actions/auth-actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up | MedAlpine",
  description: "Create a MedAlpine account to access personalized medical research",
};

export default async function SignupPage() {
  // Check if user is already logged in
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    // Changed from min-h-screen to h-screen to ensure exact viewport height
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="hidden w-1/2 relative overflow-hidden lg:block">
        {/* Different gradient direction and colors from login page */}
        <div className="absolute inset-0 bg-gradient-to-tl from-teal-700 via-teal-600 to-emerald-700"></div>
        
        {/* Hexagonal medical pattern - different from login page's lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="medicalHexagons" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(1.5) rotate(0)">
                <path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25Z" stroke="white" strokeWidth="1" fill="none"/>
                <path d="M50 15 L75 30 L75 70 L50 85 L25 70 L25 30Z" stroke="white" strokeWidth="0.5" fill="none"/>
                <circle cx="50" cy="50" r="10" stroke="white" strokeWidth="0.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#medicalHexagons)"/>
          </svg>
        </div>
        
        {/* Different placement of decorative elements compared to login */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-emerald-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-teal-300/10 rounded-full blur-[100px]"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <h1 className="mb-4 text-3xl font-bold text-white drop-shadow-sm">Join MedAlpine</h1>
          <p className="mb-8 text-xl text-center max-w-md text-white/90 drop-shadow-sm">
            Over 1 million research papers published annually. Let our AI find the ones that matter to you.
          </p>
          
          {/* Cards with frosted glass effect - styled differently from login */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
              <div className="text-3xl font-bold">73</div>
              <div className="text-sm text-white/90">Days in which medical knowledge doubles</div>
            </div>
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-white/90">Access to personalized research</div>
            </div>
          </div>
          
          {/* Additional highlight - different from login page */}
          <div className="mt-8 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
            <p className="text-sm text-center text-white/90">
              Join thousands of physicians already using MedAlpine
            </p>
          </div>
        </div>
      </div>
      
      {/* Added overflow-y-auto to enable scrolling within this container if needed */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}