import { Button } from "@/components/ui/button";

interface FrequencyStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function FrequencyStep({ value, onChange, onNext, onPrev }: FrequencyStepProps) {
  const frequencies = [
    {
      id: "daily",
      name: "Daily",
      description: "I read medical literature every day"
    },
    {
      id: "weekly",
      name: "Weekly",
      description: "I dedicate time each week to stay updated"
    },
    {
      id: "monthly",
      name: "Monthly",
      description: "I review key findings on a monthly basis"
    },
    {
      id: "quarterly",
      name: "Quarterly",
      description: "I catch up on research every few months"
    },
    {
      id: "rarely",
      name: "Rarely",
      description: "I find it difficult to make time for research"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Research Habits</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          How often do you typically read medical research papers?
        </p>
      </div>

      <div className="space-y-3 mt-8">
        {frequencies.map((frequency) => (
          <div 
            key={frequency.id}
            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
              ${value === frequency.id 
                ? "border-teal-500 bg-teal-50/50 dark:bg-teal-900/20" 
                : "border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-800"
              }`}
            onClick={() => onChange(frequency.id)}
          >
            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
              ${value === frequency.id
                ? "border-teal-500 bg-white dark:bg-slate-900"
                : "border-slate-300 dark:border-slate-600"
              }`}
            >
              {value === frequency.id && (
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">{frequency.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{frequency.description}</p>
            </div>
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