import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Use Inter font for clean sans-serif look
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'] }); // Initialize Inter font

export const metadata: Metadata = {
  title: 'Resume Analyzer', // Updated title
  description: 'Get AI-powered analysis and ATS score for your resume.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply base styling including gradient background from globals.css */}
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
