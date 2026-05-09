"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Parsing your resume...",
  "Analyzing the job description...",
  "Researching interview patterns...",
  "Generating your prep plan...",
];

export default function AnalysisProgress({ company }: { company?: string }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const label = company && stepIndex === 2
    ? `Researching ${company} interview patterns...`
    : STEPS[stepIndex];

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">This takes about 30–60 seconds</p>
      </div>

      <div className="flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-8 rounded-full transition-colors duration-500 ${
              i <= stepIndex ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 text-xs text-muted-foreground max-w-xs text-center">
        {STEPS.map((s, i) => (
          <span key={s} className={i < stepIndex ? "line-through opacity-40" : i === stepIndex ? "text-foreground font-medium" : ""}>
            {i + 1}. {s}
          </span>
        ))}
      </div>
    </div>
  );
}
