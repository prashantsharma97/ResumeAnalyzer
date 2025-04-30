// src/ai/flows/analyze-resume.ts
'use server';

/**
 * @fileOverview Analyzes a resume to provide an ATS score, strengths, weaknesses, and suggestions for improvement.
 *
 * - analyzeResume - A function that handles the resume analysis process.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be analyzed.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  atsScore: z
    .number()
    .describe('An estimated ATS score from 0 to 100.'),
  strengths: z
    .string()
    .describe('The strengths of the resume.'),
  weaknesses: z
    .string()
    .describe('The weaknesses or missing elements of the resume.'),
  suggestions: z
    .string()
    .describe('Specific suggestions for improving the resume.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {
    schema: z.object({
      resumeText: z
        .string()
        .describe('The text content of the resume to be analyzed.'),
    }),
  },
  output: {
    schema: z.object({
      atsScore: z
        .number()
        .describe('An estimated ATS score from 0 to 100.'),
      strengths: z
        .string()
        .describe('The strengths of the resume.'),
      weaknesses: z
        .string()
        .describe('The weaknesses or missing elements of the resume.'),
      suggestions: z
        .string()
        .describe('Specific suggestions for improving the resume.'),
    }),
  },
  prompt: `You are an expert ATS (Applicant Tracking System) evaluator.\n\nA user has uploaded their resume. Please analyze the resume and give the user an ATS score from 0 to 100.\nAlso highlight the strengths of the resume, point out the weaknesses or missing elements, and provide specific suggestions for improving the resume.\n\nResume:\n{{{resumeText}}}\n\nRespond in JSON format with keys: atsScore, strengths, weaknesses, and suggestions.\n`,
});

const analyzeResumeFlow = ai.defineFlow<
  typeof AnalyzeResumeInputSchema,
  typeof AnalyzeResumeOutputSchema
>(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumePrompt(input);
    return output!;
  }
);
