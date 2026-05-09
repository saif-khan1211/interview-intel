"use client";

import { Textarea } from "@/components/ui/textarea";

const MAX_CHARS = 5000;

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function JobDescriptionInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Textarea
        placeholder="Paste the full job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        rows={10}
        className="resize-none text-sm"
      />
      <p className={`text-xs text-right ${value.length >= MAX_CHARS ? "text-destructive" : "text-muted-foreground"}`}>
        {value.length}/{MAX_CHARS}
      </p>
    </div>
  );
}
