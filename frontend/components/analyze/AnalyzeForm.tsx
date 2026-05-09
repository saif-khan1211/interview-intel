"use client";

import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAnalysis, uploadResume } from "@/lib/api";
import JobDescriptionInput from "./JobDescriptionInput";
import ResumeUploader from "./ResumeUploader";

export default function AnalyzeForm() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<string>("");

  const canSubmit = file && jdText.trim().length >= 50 && company.trim() && role.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setError(null);
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      setStep("Uploading resume...");
      const { resume_id } = await uploadResume(file!, token);

      setStep("Starting analysis...");
      const { analysis_id } = await createAnalysis(
        { resume_id, jd_text: jdText, company_name: company, role_title: role },
        token
      );

      router.push(`/results/${analysis_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
      setStep("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Resume</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Upload your current resume</p>
        </div>
        <ResumeUploader
          onFileSelected={setFile}
          selectedFile={file}
          onClear={() => setFile(null)}
        />
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Job Description</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Paste the full job description</p>
        </div>
        <JobDescriptionInput value={jdText} onChange={setJdText} />
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Role Details</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Company and role you&apos;re applying to</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            placeholder="Company name (e.g., Stripe)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            maxLength={200}
          />
          <Input
            placeholder="Role title (e.g., Senior Backend Engineer)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            maxLength={200}
          />
        </div>
      </section>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <Button type="submit" disabled={!canSubmit || loading} size="lg" className="w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {step}
          </>
        ) : (
          "Generate prep plan"
        )}
      </Button>
    </form>
  );
}
