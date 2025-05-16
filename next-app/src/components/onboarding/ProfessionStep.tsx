import { Button } from "@/components/ui/button";
import { UserIcon, GraduationCapIcon, BookOpenIcon } from "lucide-react";

interface ProfessionStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function ProfessionStep({ value, onChange, onNext }: ProfessionStepProps) {
  const professions = [
    {
      id: "professional",
      name: "Medical Professional",
      description: "Practicing physician, surgeon, or medical specialist",
      icon: <UserIcon className="w-6 h-6" />
    },
    {
      id: "teacher",
      name: "Medical Educator",
      description: "Professor, researcher, or medical school faculty",
      icon: <BookOpenIcon className="w-6 h-6" />
    },
    {
      id: "student",
      name: "Medical Student",
      description: "Student in medical school or residency program",
      icon: <GraduationCapIcon className="w-6 h-6" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tell us about yourself</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          We'll personalize your research experience based on your background
        </p>
      </div>

      <div className="space-y-4 mt-8">
        {professions.map((profession) => (
          <div 
            key={profession.id}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
              ${value === profession.id 
                ? "border-teal-500 bg-teal-50/50 dark:bg-teal-900/20" 
                : "border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-800"
              }`}
            onClick={() => onChange(profession.id)}
          >
            <div className={`p-2 rounded-full mr-4
              ${value === profession.id
                ? "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300"
                : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
              }`}
            >
              {profession.icon}
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">{profession.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{profession.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!value}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}