import type {
  AnalysisCreateResponse,
  AnalysisListItem,
  AnalysisStatusResponse,
  MyResumeResponse,
  ResumeUploadResponse,
} from "@/types/analysis";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function getMyResume(token: string): Promise<MyResumeResponse | null> {
  try {
    return await apiFetch<MyResumeResponse>("/api/resumes/me", token);
  } catch {
    return null;
  }
}

export async function uploadResume(
  file: File,
  token: string
): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<ResumeUploadResponse>("/api/resumes/upload", token, {
    method: "POST",
    body: formData,
  });
}

export async function createAnalysis(
  payload: {
    resume_id: number;
    jd_text: string;
    company_name: string;
    role_title: string;
  },
  token: string
): Promise<AnalysisCreateResponse> {
  return apiFetch<AnalysisCreateResponse>("/api/analyses", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getAnalysis(
  id: number,
  token: string
): Promise<AnalysisStatusResponse> {
  return apiFetch<AnalysisStatusResponse>(`/api/analyses/${id}`, token);
}

export async function listAnalyses(token: string): Promise<AnalysisListItem[]> {
  return apiFetch<AnalysisListItem[]>("/api/analyses", token);
}

export async function extractJobPosting(
  url: string,
  token: string
): Promise<{ company_name: string; role_title: string; jd_text: string }> {
  return apiFetch<{ company_name: string; role_title: string; jd_text: string }>(
    "/api/job-postings/extract",
    token,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }
  );
}
