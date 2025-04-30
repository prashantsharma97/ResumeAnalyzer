import { ResumeAnalyzerForm } from "@/components/resume-analyzer-form";

export default function Home() {
  return (
    // Removed bg-background here as it's now on the body via layout.tsx/globals.css
    // Adjusted padding for better spacing on different screen sizes
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12">
      <ResumeAnalyzerForm />
    </main>
  );
}
