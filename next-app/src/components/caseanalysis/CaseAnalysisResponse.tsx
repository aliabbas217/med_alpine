"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import Markdown from 'react-markdown';

interface CaseAnalysisResponseProps {
  analysis: string;
  sources: string[];
}

export function CaseAnalysisResponse({ analysis, sources }: CaseAnalysisResponseProps) {
  const [activeTab, setActiveTab] = useState("analysis");
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
        <CardTitle className="text-xl text-slate-900 dark:text-white">
          Medical Case Analysis
        </CardTitle>
        <CardDescription>
          Evidence-based analysis using latest medical research
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 border-b border-slate-200 dark:border-slate-700">
          <TabsList className="h-12">
            <TabsTrigger value="analysis" className="text-base">
              Analysis
            </TabsTrigger>
            <TabsTrigger value="sources" className="text-base">
              Sources ({sources.length})
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="analysis" className="p-0">
          <CardContent className="p-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <Markdown>{analysis}</Markdown>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="sources" className="p-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              Reference Papers
            </h3>
            <ul className="space-y-2">
              {sources.map((source, index) => (
                <li key={source} className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {index + 1}
                  </span>
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${source}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 flex items-center"
                  >
                    {source}
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 inline-block" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Click on any paper ID to view the full paper on PubMed Central.
            </p>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}