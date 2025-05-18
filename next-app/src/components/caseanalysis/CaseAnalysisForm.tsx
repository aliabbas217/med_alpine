"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BrainCog, Loader2, Check, Clipboard } from "lucide-react";
import { CaseAnalysisResponse } from "@/components/caseanalysis/CaseAnalysisResponse";
import { Badge } from "@/components/ui/badge";

const specialtyOptions = [
  { value: "general", label: "General Medicine" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "pulmonology", label: "Pulmonology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pathology", label: "Pathology" },
  { value: "emergency", label: "Emergency Medicine" },
];

type CaseAnalysisFormProps = {
  userId: string;
};

export function CaseAnalysisForm({ userId }: CaseAnalysisFormProps) {
  const [patientHistory, setPatientHistory] = useState("");
  const [currentSymptoms, setCurrentSymptoms] = useState("");
  const [patientPerspective, setPatientPerspective] = useState("");
  const [doctorOpinion, setDoctorOpinion] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(["general"]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<{analysis: string; sources: string[]} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSpecialtyChange = (value: string) => {
    if (value === "general") {
      setSelectedSpecialties(["general"]);
    } else {
      const newSpecialties = selectedSpecialties.filter(s => s !== "general");
      
      if (selectedSpecialties.includes(value)) {
        // Remove the specialty if it's already selected
        setSelectedSpecialties(newSpecialties.filter(s => s !== value));
      } else {
        // Add the specialty
        setSelectedSpecialties([...newSpecialties, value]);
      }
      
      // If no specialties are selected, default to general
      if (newSpecialties.length === 0) {
        setSelectedSpecialties(["general"]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analyze-case`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_history: patientHistory,
          current_symptoms: currentSymptoms,
          patient_perspective: patientPerspective,
          doctor_opinion: doctorOpinion,
          specialties: selectedSpecialties,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error submitting case:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = patientHistory && currentSymptoms && doctorOpinion && selectedSpecialties.length > 0;

  return (
    <div>
      {!response ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientHistory" className="text-base">
                Patient History
              </Label>
              <Textarea
                id="patientHistory"
                placeholder="Enter patient's medical history, age, gender, chronic conditions, medications..."
                className="mt-1.5 min-h-24"
                value={patientHistory}
                onChange={(e) => setPatientHistory(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="currentSymptoms" className="text-base">
                Current Symptoms
              </Label>
              <Textarea
                id="currentSymptoms"
                placeholder="Describe current symptoms, duration, severity, aggravating/relieving factors..."
                className="mt-1.5 min-h-24"
                value={currentSymptoms}
                onChange={(e) => setCurrentSymptoms(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="patientPerspective" className="text-base">
                Patient's Perspective
              </Label>
              <Textarea
                id="patientPerspective"
                placeholder="What does the patient think is happening? Any concerns or expectations? (Optional)"
                className="mt-1.5 min-h-20"
                value={patientPerspective}
                onChange={(e) => setPatientPerspective(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="doctorOpinion" className="text-base">
                Doctor's Initial Assessment
              </Label>
              <Textarea
                id="doctorOpinion"
                placeholder="Your current diagnostic thinking, differential diagnosis, or initial assessment plan..."
                className="mt-1.5 min-h-24"
                value={doctorOpinion}
                onChange={(e) => setDoctorOpinion(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label className="text-base">
                Relevant Medical Specialties
              </Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {specialtyOptions.map(specialty => (
                  <Badge 
                    key={specialty.value}
                    variant={selectedSpecialties.includes(specialty.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleSpecialtyChange(specialty.value)}
                  >
                    {selectedSpecialties.includes(specialty.value) && (
                      <Check className="w-3.5 h-3.5 mr-1" />
                    )}
                    {specialty.label}
                  </Badge>
                ))}
              </div>
              <p className="mt-1.5 text-sm text-slate-500">
                Select all that apply. This helps retrieve relevant research papers.
              </p>
            </div>
          </div>
          
          {error && (
            <div className="p-4 mt-4 text-red-800 bg-red-50 rounded-md border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full sm:w-auto" 
            size="lg"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Case...
              </>
            ) : (
              <>
                <BrainCog className="w-4 h-4 mr-2" />
                Analyze Case
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <CaseAnalysisResponse 
            analysis={response.analysis} 
            sources={response.sources} 
          />
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Button 
              variant="secondary" 
              onClick={() => setResponse(null)}
            >
              Analyze Another Case
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                const caseDetails = `
                  # Medical Case Analysis
                  
                  ## Case Details
                  **Patient History:** ${patientHistory}
                  
                  **Current Symptoms:** ${currentSymptoms}
                  
                  **Patient's Perspective:** ${patientPerspective}
                  
                  **Doctor's Assessment:** ${doctorOpinion}
                  
                  ## AI Analysis
                  ${response.analysis}
                  
                  ## Reference Papers
                  ${response.sources.map(source => `- ${source}`).join('\n')}
                `;
                
                navigator.clipboard.writeText(caseDetails);
              }}
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Copy Full Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}