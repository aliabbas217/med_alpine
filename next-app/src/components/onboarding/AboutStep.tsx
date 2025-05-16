import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface AboutStepProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export function AboutStep({ value, onChange, onComplete, onPrev, isSubmitting }: AboutStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tell Us More (Optional)</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Share details about your background to help us tailor your experience
        </p>
      </div>

      <div className="mt-8">
        <label htmlFor="about" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Your background and interests
        </label>
        <Textarea
          id="about"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder="Example: I'm a neurosurgeon with 8 years of experience specializing in pediatric cases. I'm particularly interested in new minimally invasive techniques and am currently conducting research on brain tumor treatments."
          className="resize-none w-full rounded-md border border-slate-300 dark:border-slate-600 p-3 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400"
        />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          The more specific you are, the better we can personalize your research feed.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onPrev}
          variant="outline"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={onComplete}
          disabled={isSubmitting}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </div>
    </div>
  );
}