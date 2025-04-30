"use client";

import type { AnalyzeResumeOutput } from "@/ai/flows/analyze-resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Keep progress if needed, but Gauge is primary
import { ThumbsUp, ThumbsDown, Lightbulb, Gauge } from "lucide-react";

interface AnalysisResultsProps {
  analysis: AnalyzeResumeOutput | null;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  if (!analysis) {
    return null;
  }

  const { atsScore, strengths, weaknesses, suggestions } = analysis;

  // Determine color based on score for the Gauge Circle
  const getScoreColorClass = (score: number) => {
    if (score >= 85) return "text-green-500"; // Excellent
    if (score >= 70) return "text-yellow-500"; // Good
    if (score >= 50) return "text-orange-500"; // Needs Improvement
    return "text-red-500"; // Poor
  };

  const scoreColorClass = getScoreColorClass(atsScore);

  return (
    <div className="space-y-6">
      {/* ATS Score */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-md rounded-lg overflow-hidden">
        <CardHeader className="bg-muted/30 p-4 border-b border-border/30">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
            <Gauge className={`h-6 w-6 ${scoreColorClass}`} />
            ATS Score Estimate
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <div className="relative h-36 w-36"> {/* Increased size */}
             <svg className="h-full w-full" viewBox="0 0 36 36">
               {/* Background Circle */}
               <path
                 className="text-muted/50" // Softer background
                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="3" // Slightly thicker
               />
               {/* Score Arc */}
               <path
                 className={scoreColorClass} // Use dynamic color class
                 strokeDasharray={`${atsScore}, 100`}
                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="3.5" // Slightly thicker score arc
                 strokeLinecap="round"
                 transform="rotate(-90 18 18)" // Start from top
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className={`text-5xl font-bold ${scoreColorClass}`}>{atsScore}</span> {/* Larger text, dynamic color */}
               <span className="text-xs text-muted-foreground mt-1">out of 100</span>
            </div>
          </div>
           <p className="text-sm text-muted-foreground text-center max-w-md leading-relaxed">
            This score estimates how well your resume might perform in Applicant Tracking Systems. Higher scores indicate better keyword alignment and formatting.
           </p>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-md rounded-lg">
        <CardHeader className="p-4 border-b border-border/30">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-green-600">
            <ThumbsUp className="h-5 w-5" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm leading-relaxed">{strengths}</p>
        </CardContent>
      </Card>

      {/* Weaknesses */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-md rounded-lg">
        <CardHeader className="p-4 border-b border-border/30">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-red-600">
            <ThumbsDown className="h-5 w-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm leading-relaxed">{weaknesses}</p>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-md rounded-lg">
        <CardHeader className="p-4 border-b border-border/30">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-600"> {/* Changed color */}
            <Lightbulb className="h-5 w-5 text-yellow-500" /> {/* Kept icon color */}
            Actionable Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm leading-relaxed">{suggestions}</p>
        </CardContent>
      </Card>
    </div>
  );
}
