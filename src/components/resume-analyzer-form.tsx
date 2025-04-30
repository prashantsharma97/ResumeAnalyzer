
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useEffect } from "react";
import { analyzeResume } from "@/ai/flows/analyze-resume";
import type { AnalyzeResumeOutput } from "@/ai/flows/analyze-resume";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AnalysisResults } from "@/components/analysis-results";
import { UploadCloud } from 'lucide-react'; // Changed icon to UploadCloud for better visual
import * as pdfjsLib from 'pdfjs-dist';


const formSchema = z.object({
  resumeText: z.string().min(50, { // Ensure minimum length after parsing
    message: "Resume text must be at least 50 characters.",
  }),
});

export function ResumeAnalyzerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResumeOutput | null>(null);
  const { toast } = useToast();

  // Initialize pdfjs worker
  useEffect(() => {
    // Dynamically import the worker script
    import('pdfjs-dist/build/pdf.worker.min.mjs').then(worker => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: "",
    },
  });

  const parsePdf = async (file: File): Promise<string> => {
    setIsParsing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => ('str' in item ? item.str : '')).join(" ") + "\n";
      }
      return fullText;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      toast({
        title: "Error Parsing PDF",
        description: "Could not extract text from the PDF file.",
        variant: "destructive",
      });
      throw new Error("PDF parsing failed"); // Re-throw to handle in calling function
    } finally {
      setIsParsing(false);
    }
  };


   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Reset validation state and analysis result when a new file is selected
      form.clearErrors("resumeText");
      setAnalysisResult(null);
      form.setValue("resumeText", ""); // Clear previous text

      setIsLoading(true); // Show loading indicator during file processing

      try {
        let text = "";
        if (file.type === "application/pdf") {
          text = await parsePdf(file);
        } else if (file.type === "text/plain") {
            const reader = new FileReader();
            text = await new Promise<string>((resolve, reject) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = (e) => reject(new Error("Could not read the selected file.")); // Fixed: Removed extra closing parenthesis
                reader.readAsText(file);
            });
        } else {
           toast({
             title: "Unsupported File Type",
             description: "Please upload a .txt or .pdf file.",
             variant: "destructive",
           });
           event.target.value = ''; // Clear the file input
           setIsLoading(false); // Hide loading
           return;
        }

        if (text.length < 50) {
           toast({
             title: "File Content Too Short",
             description: "The extracted resume text must be at least 50 characters.",
             variant: "destructive",
           });
           event.target.value = ''; // Clear the file input
           form.setValue("resumeText", ""); // Clear the hidden field value
        } else {
          form.setValue("resumeText", text);
          // Trigger validation manually after setting value from file
          form.trigger("resumeText");
           toast({
             title: "File Processed",
             description: `${file.name} is ready for analysis.`,
           });
        }
      } catch (error: any) {
         toast({
           title: "Error Processing File",
           description: error.message || "An unexpected error occurred.",
           variant: "destructive",
         });
         event.target.value = ''; // Clear the file input
         form.setValue("resumeText", "");
      } finally {
         setIsLoading(false); // Hide loading indicator after processing
      }


    } else {
        form.setValue("resumeText", ""); // Clear value if no file is selected
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Check again before submitting (although handled by button disable state mostly)
    if (!values.resumeText || values.resumeText.length < 50) {
        form.setError("resumeText", { message: "Please upload a valid .txt or .pdf resume file (min 50 characters)." });
        toast({
            title: "Upload Required",
            description: "Please upload your resume file before analyzing.",
            variant: "destructive",
        });
        return; // Prevent submission
    }

    setIsLoading(true);
    setAnalysisResult(null); // Clear previous results
    try {
      const result = await analyzeResume({ resumeText: values.resumeText });
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const disableAnalyzeButton = isLoading || isParsing || !form.watch("resumeText") || !!form.formState.errors.resumeText;
  const analyzeButtonText = isLoading ? "Analyzing..." : (isParsing ? "Parsing PDF..." : "Analyze Resume");


  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8 max-w-4xl">
      {/* Enhanced Card Styling */}
      <Card className="w-full shadow-xl rounded-xl border-border/40 bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-center text-primary tracking-tight">Resume Analyzer AI</CardTitle>
          <CardDescription className="text-center text-muted-foreground text-base pt-1">
            Upload your resume (.txt or .pdf) to get an AI-powered ATS score and improvement insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Hidden Field to store resume text */}
               <FormField
                  control={form.control}
                  name="resumeText"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

              {/* Enhanced File Upload Input Area */}
              <FormItem className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-accent/30 rounded-lg hover:border-accent transition-colors duration-200 bg-background/50">
                  <FormLabel htmlFor="resumeFile" className="flex flex-col items-center justify-center gap-3 font-semibold cursor-pointer text-lg text-muted-foreground hover:text-accent transition-colors">
                      <UploadCloud className="h-10 w-10 text-accent" />
                      <span>Click to upload or drag & drop</span>
                      <span className="text-sm font-normal">(.txt or .pdf, min 50 chars)</span>
                  </FormLabel>
                  <FormControl>
                       <Input
                        id="resumeFile"
                        type="file"
                        accept=".txt,.pdf"
                        onChange={handleFileUpload}
                        disabled={isLoading || isParsing}
                        className="opacity-0 absolute w-full h-full top-0 left-0 cursor-pointer" // Hidden input, label handles interaction
                      />
                  </FormControl>
                   {/* Display validation message for the hidden resumeText field here */}
                   <FormMessage className="text-center pt-2">{form.formState.errors.resumeText?.message}</FormMessage>
              </FormItem>


              <Button type="submit" disabled={disableAnalyzeButton} className="w-full bg-gradient-to-r from-accent via-teal-600 to-teal-700 hover:shadow-lg hover:from-accent/90 text-accent-foreground font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:bg-muted">
                {(isLoading || isParsing) && <LoadingSpinner className="mr-2 h-4 w-4" /> }
                {analyzeButtonText}
              </Button>
            </form>
          </Form>

          {/* Consolidate loading/parsing indicator */}
          {(isLoading || isParsing) && !analysisResult && (
            <div className="mt-8 flex flex-col items-center justify-center space-y-4">
              <LoadingSpinner className="h-12 w-12" />
              <p className="text-muted-foreground animate-pulse">{isParsing ? "Processing file..." : "Analyzing your resume, please wait..."}</p>
            </div>
          )}

          {analysisResult && !isLoading && !isParsing && (
            <div className="mt-10 pt-8 border-t border-border/50">
               <h2 className="text-2xl font-semibold mb-6 text-center tracking-tight">Analysis Results</h2>
              <AnalysisResults analysis={analysisResult} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
