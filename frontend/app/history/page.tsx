import AnalysisHistoryList from "@/components/history/AnalysisHistoryList";

export default function HistoryPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Your analyses</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Previous interview prep plans you&apos;ve generated.
        </p>
      </div>
      <AnalysisHistoryList />
    </div>
  );
}
