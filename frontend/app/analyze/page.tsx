import AnalyzeForm from "@/components/analyze/AnalyzeForm";

export default function AnalyzePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">New analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your resume and paste the job description to generate your personalized prep plan.
        </p>
      </div>
      <AnalyzeForm />
    </div>
  );
}
