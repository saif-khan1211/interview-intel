"use client";

import { useAuth } from "@clerk/nextjs";
import { FileText, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createAnalysis, getMyResume, uploadResume } from "@/lib/api";
import type { MyResumeResponse } from "@/types/analysis";
import JobDescriptionInput from "./JobDescriptionInput";
import JobUrlFetcher from "./JobUrlFetcher";
import ResumeUploader from "./ResumeUploader";

export default function AnalyzeForm() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [existingResume, setExistingResume] = useState<MyResumeResponse | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [jdText, setJdText] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<string>("");
  const [jdMode, setJdMode] = useState<"manual" | "url">("manual");

  useEffect(() => {
    getToken().then((token) => {
      if (!token) return;
      getMyResume(token).then((resume) => {
        setExistingResume(resume);
        setShowUploader(!resume);
      });
    });
  }, [getToken]);

  const handleExtracted = (data: { company_name: string; role_title: string; jd_text: string }) => {
    setJdText(data.jd_text);
    if (data.company_name) setCompany(data.company_name);
    if (data.role_title) setRole(data.role_title);
    setJdMode("manual");
  };

  const canSubmit =
    (file || (existingResume && !showUploader)) &&
    jdText.trim().length >= 50 &&
    company.trim() &&
    role.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setError(null);
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      let resume_id: number;

      if (file) {
        setStep("Uploading resume...");
        const result = await uploadResume(file, token);
        resume_id = result.resume_id;
      } else {
        resume_id = existingResume!.resume_id;
      }

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
          <p className="text-xs text-muted-foreground mt-0.5">Your resume on file</p>
        </div>

        {existingResume && !showUploader ? (
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground truncate">{existingResume.filename}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground shrink-0 ml-3"
              onClick={() => {
                setShowUploader(true);
                setFile(null);
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Change
            </Button>
          </div>
        ) : (
          <ResumeUploader
            onFileSelected={(f) => {
              setFile(f);
            }}
            selectedFile={file}
            onClear={() => setFile(null)}
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Job Description</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Paste the description or provide a URL</p>
        </div>
        <Tabs value={jdMode} onValueChange={(v) => setJdMode(v as "manual" | "url")}>
          <TabsList>
            <TabsTrigger value="manual">Enter manually</TabsTrigger>
            <TabsTrigger value="url">Paste job URL</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="mt-3">
            <JobDescriptionInput value={jdText} onChange={setJdText} />
          </TabsContent>
          <TabsContent value="url" className="mt-3">
            <JobUrlFetcher onExtracted={handleExtracted} />
          </TabsContent>
        </Tabs>
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
