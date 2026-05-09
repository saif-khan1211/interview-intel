import type { PrepPlan } from "@/types/analysis";
import BehavioralCard from "./BehavioralCard";
import CodingPrepCard from "./CodingPrepCard";
import InterviewSignalsCard from "./InterviewSignalsCard";
import MatchSummaryCard from "./MatchSummaryCard";
import PriorityTopicsCard from "./PriorityTopicsCard";
import StrengthsGapsCard from "./StrengthsGapsCard";
import SystemDesignCard from "./SystemDesignCard";
import TimelineCard from "./TimelineCard";

export default function ResultsLayout({
  plan,
  company,
  role,
}: {
  plan: PrepPlan;
  company: string;
  role: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <MatchSummaryCard plan={plan} company={company} role={role} />
      <StrengthsGapsCard plan={plan} />
      <PriorityTopicsCard plan={plan} />
      <CodingPrepCard plan={plan} />
      <SystemDesignCard plan={plan} />
      <BehavioralCard plan={plan} />
      <InterviewSignalsCard plan={plan} company={company} />
      <TimelineCard plan={plan} />
    </div>
  );
}
