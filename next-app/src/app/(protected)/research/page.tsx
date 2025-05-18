"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BookOpen, Search, AlertTriangle, ExternalLink } from "lucide-react"
import ReactMarkdown, { Components } from 'react-markdown'
import type { ReactNode } from 'react'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function ResearchPage() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    answer: string
    sources: string[]
  } | null>(null)
  const [recentQueries, setRecentQueries] = useState<string[]>([])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    
    if (!query.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/rag-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }
      
      const data = await response.json()
      setResult(data)
      
      // Add to recent queries
      setRecentQueries(prev => {
        const newQueries = [query, ...prev.filter(q => q !== query)]
        return newQueries.slice(0, 5) // Keep only the 5 most recent
      })
    } catch (err) {
      console.error("Error querying RAG system:", err)
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          setError("Cannot connect to the research server. Please ensure the server is running.")
        } else if (err.message.includes("status: 500")) {
          setError("The research server encountered an error. Please try again with a different query.")
        } else {
          setError(err.message)
        }
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  function formatSourceLink(source: string) {
    // Handle different source formats
    if (source.startsWith("http")) {
      return {
        text: new URL(source).hostname,
        url: source,
        isExternal: true
      }
    } else if (source.startsWith("PMC")) {
      // Extract PMC ID and create a link to PubMed Central
      const pmcidMatch = source.match(/PMC\d+/)
      if (pmcidMatch) {
        const pmcid = pmcidMatch[0]
        return {
          text: source,
          url: `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/`,
          isExternal: true
        }
      }
    }
    
    // Default for other source formats or fallback
    return {
      text: source,
      url: null,
      isExternal: false
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-center text-slate-900 dark:text-white sm:text-4xl">
          Medical Research <span className="text-teal-600 dark:text-teal-400">Assistant</span>
        </h1>
        <p className="max-w-2xl mx-auto text-center text-slate-600 dark:text-slate-400">
          Ask any medical question and get evidence-based answers from our AI research assistant,
          backed by the latest medical literature.
        </p>
      </div>
      
      <Card className="mb-8 border-teal-200 dark:border-teal-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Research Query
          </CardTitle>
          <CardDescription>
            Ask about treatments, diagnoses, or the latest research in any medical field
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="e.g., What are the latest treatments for Alzheimer's disease?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !query.trim()}
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </form>
          
          {recentQueries.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentQueries.map((q, i) => (
                  <Button 
                    key={i}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setQuery(q)
                      handleSearch(new Event('submit') as any)
                    }}
                  >
                    {q.length > 30 ? q.substring(0, 30) + '...' : q}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-48" />
          <div className="space-y-2">
            <Skeleton className="w-1/3 h-4" />
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {result && !isLoading && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="prose dark:prose-invert max-w-none prose-headings:text-teal-600 dark:prose-headings:text-teal-400 prose-strong:font-bold prose-a:text-teal-600 dark:prose-a:text-teal-400 overflow-x-auto">
                <ReactMarkdown
                  components={{
                    // Override components to better handle overflow
                    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
                      <pre {...props} className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-md whitespace-pre-wrap">
                        {children}
                      </pre>
                    ),
                    
                    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
                      <ul {...props} className="list-disc pl-5 break-words">
                        {children}
                      </ul>
                    ),
                    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
                      <li {...props} className="my-1 break-words">
                        {children}
                      </li>
                    ),
                    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
                      <p {...props} className="break-words whitespace-pre-wrap">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {result.answer}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
          
          {result.sources && result.sources.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 grid grid-cols-1 sm:grid-cols-2">
                  {result.sources.map((source, index) => {
                    const { text, url, isExternal } = formatSourceLink(source)
                    return (
                      <li key={index} className="flex items-start text-sm break-all">
                        <span className="mr-2 text-teal-600 dark:text-teal-400 flex-shrink-0">•</span>
                        <div className="break-words">
                          {url ? (
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                            >
                              {text}
                              {isExternal && <ExternalLink className="w-3 h-3 flex-shrink-0" />}
                            </a>
                          ) : (
                            <span>{text}</span>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
          Always consult with a qualified healthcare professional before making medical decisions.
          MedAlpine provides research assistance but does not provide medical advice.
        </p>
      </div>
    </div>
  )
}