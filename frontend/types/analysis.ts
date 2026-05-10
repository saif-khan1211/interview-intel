export interface LeetCodeProblem {
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface CodingPattern {
  name: string;
  problems: LeetCodeProblem[];
}

export interface CodingPrep {
  patterns: CodingPattern[];
}

export interface PriorityTopic {
  topic: string;
  why: string;
  estimated_hours: number;
}

export interface PrepPlan {
  fit_score: number;
  match_summary: string;
  strengths: string[];
  skill_gaps: string[];
  interviewer_concerns: string[];
  high_priority_topics: PriorityTopic[];
  medium_priority_topics: PriorityTopic[];
  low_priority_topics: PriorityTopic[];
  what_to_ignore: string[];
  coding_prep: CodingPrep;
  system_design_topics: string[];
  behavioral_focus: string[];
  interview_signals: string[];
  glassdoor_sources?: string[];
  estimated_total_prep_days: number;
  timeline_breakdown: string;
}

export interface AnalysisStatusResponse {
  id: number;
  status: "pending" | "processing" | "completed" | "failed";
  fit_score: number | null;
  result: PrepPlan | null;
  error_message: string | null;
  created_at: string;
  company_name: string;
  role_title: string;
  from_cache: boolean;
}

export interface AnalysisListItem {
  id: number;
  status: "pending" | "processing" | "completed" | "failed";
  fit_score: number | null;
  created_at: string;
  company_name: string;
  role_title: string;
  from_cache: boolean;
}

export interface ResumeUploadResponse {
  resume_id: number;
  filename: string;
}

export interface AnalysisCreateResponse {
  analysis_id: number;
  status: string;
  from_cache: boolean;
}

export interface MyResumeResponse {
  resume_id: number;
  filename: string;
}
