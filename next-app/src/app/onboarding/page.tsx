import { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { getCurrentUser } from "@/actions/auth-actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Complete Your Profile | MedAlpine",
  description: "Help us personalize your medical research experience",
};

export default async function OnboardingPage() {
  // Get the current user
  const user = await getCurrentUser();
  
  // If there's no user, redirect to login
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container max-w-3xl px-4 py-12 mx-auto sm:px-6 sm:py-16">
        <OnboardingFlow userId={user.uid} />
      </div>
    </div>
  );
}