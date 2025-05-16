"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ProfessionStep,
  FieldStep,
  FrequencyStep,
  AboutStep,
  OnboardingComplete
} from "@/components/onboarding/steps";
import { saveUserOnboardingData } from "@/actions/onboarding-actions";
import { toast } from "sonner";

type OnboardingData = {
  profession: string;
  field: string;
  frequency: string;
  about: string;
}

export function OnboardingFlow({ userId }: { userId: string }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    profession: "",
    field: "",
    frequency: "",
    about: "",
  });

  const router = useRouter();

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(0, prev - 1));
  };
  
  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Save data to Firestore using server action
      await saveUserOnboardingData(userId, data);
      
      toast(
         "Profile Complete!",
      );
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast(
 
        "Failed to save your preferences. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  // Define all steps in the flow
  const steps = [
    <ProfessionStep 
      key="profession"
      value={data.profession}
      onChange={(value) => updateData("profession", value)}
      onNext={nextStep}
    />,
    <FieldStep 
      key="field"
      value={data.field}
      onChange={(value) => updateData("field", value)}
      onNext={nextStep}
      onPrev={prevStep}
    />,
    <FrequencyStep 
      key="frequency"
      value={data.frequency}
      onChange={(value) => updateData("frequency", value)}
      onNext={nextStep}
      onPrev={prevStep}
    />,
    <AboutStep 
      key="about"
      value={data.about}
      onChange={(value) => updateData("about", value)}
      onComplete={handleComplete}
      onPrev={prevStep}
      isSubmitting={isSubmitting}
    />,
    <OnboardingComplete key="complete" />
  ];
  
  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl" />
      
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full">
          <motion.div
            className="h-1 bg-teal-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-right">
          Step {step + 1} of {steps.length - 1}
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-slate-200 dark:border-slate-700">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}