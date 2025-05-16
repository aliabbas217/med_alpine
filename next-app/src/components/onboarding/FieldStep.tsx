import { Button } from "@/components/ui/button";
import { Brain, Heart, Syringe, Baby, Bone, Microscope, Stethoscope, Activity } from "lucide-react";

interface FieldStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function FieldStep({ value, onChange, onNext, onPrev }: FieldStepProps) {
  const fields = [
    {
      id: "cardiology",
      name: "Cardiology",
      icon: <Heart className="w-6 h-6" />
    },
    {
      id: "neurology",
      name: "Neurology",
      icon: <Brain className="w-6 h-6" />
    },
    {
      id: "pulmonology",
      name: "Pulmonology",
      icon: <Syringe className="w-6 h-6" />
    },
    {
      id: "pediatrics",
      name: "Pediatrics",
      icon: <Baby className="w-6 h-6" />
    },
    {
      id: "orthopedics",
      name: "Orthopedics",
      icon: <Bone className="w-6 h-6" />
    },
    {
      id: "pathology",
      name: "Pathology",
      icon: <Microscope className="w-6 h-6" />
    },
    {
      id: "general",
      name: "General Medicine",
      icon: <Stethoscope className="w-6 h-6" />
    },
    {
      id: "emergency",
      name: "Emergency Medicine",
      icon: <Activity className="w-6 h-6" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Field of Interest</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Select your primary medical specialty or area of interest
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        {fields.map((field) => (
          <div 
            key={field.id}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all text-center
              ${value === field.id 
                ? "border-teal-500 bg-teal-50/50 dark:bg-teal-900/20" 
                : "border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-800"
              }`}
            onClick={() => onChange(field.id)}
          >
            <div className={`p-2 rounded-full mb-2
              ${value === field.id
                ? "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300"
                : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
              }`}
            >
              {field.icon}
            </div>
            <span className="font-medium text-slate-900 dark:text-white">{field.name}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onPrev}
          variant="outline"
        >
          Back
        </Button>
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