# 📄 ResumeAnalyzer

ResumeAnalyzer is an AI-powered web application that helps users analyze resumes and extract useful insights. Built using Next.js, Genkit, Firebase, and Tailwind CSS, it offers a modern and responsive UI with real-time resume analysis.

---

## 🚀 Features

- Upload and parse resumes (PDF support)
- Extract key information: name, email, skills, experience, etc.
- Use Google AI (via Genkit) for natural language analysis
- Visualize data using charts (Recharts)
- Firebase integration for storage and auth
- Responsive UI using TailwindCSS + Radix UI
- Form validation using React Hook Form + Zod

---

## 📦 Tech Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS, Radix UI
- **AI Integration**: Genkit + Google AI
- **State Management**: TanStack Query
- **Validation**: Zod + React Hook Form
- **Backend/Storage**: Firebase
- **PDF Parsing**: pdfjs-dist

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/prashantsharma97/ResumeAnalyzer.git
cd ResumeAnalyzer

### Install dependencies

npm install
# or
yarn

### Configure environment

GENKIT_API_KEY=""

### Run the development server
npm run dev


