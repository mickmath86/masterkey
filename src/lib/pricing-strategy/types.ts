// ─── Assessment Questions ─────────────────────────────────────────────────────

export interface Question {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  optional?: boolean;
}

export interface AssessmentResponse {
  questionId: string;
  questionLabel: string;
  answerValue: string;
  answerLabel: string;
}

// ─── Strategy Archetypes ──────────────────────────────────────────────────────

export type StrategyType =
  | "price-for-speed"
  | "price-at-market"
  | "price-to-test"
  | "prep-first";

export interface StrategyResult {
  strategyType: StrategyType;
  strategyLabel: string;
  confidenceBand: "High" | "Moderate" | "Needs Discussion";
  headline: string;
  rationale: string;
  keyRisks: string[];
  nextSteps: string[];
  practicalMeaning: string;
  disclaimer: string;
}

// ─── Derived Insights ─────────────────────────────────────────────────────────

export interface DerivedInsights {
  timelineCategory: "urgent" | "flexible" | "exploratory";
  prepCategory: "move-in-ready" | "minor-updates" | "needs-work";
  pricingPriority: "speed" | "price" | "balance";
  occupancyType: "owner-occupied" | "vacant" | "tenant-occupied";
}

// ─── Full Report ──────────────────────────────────────────────────────────────

export interface ReportSummary {
  strategyResult: StrategyResult;
  derivedInsights: DerivedInsights;
  responses: AssessmentResponse[];
  generatedAt: string;
}

// ─── Lead Info ────────────────────────────────────────────────────────────────

export interface LeadInfo {
  firstName: string;
  email: string;
  phone?: string;
  propertyAddress?: string;
  cityOrZip?: string;
}

// ─── Submission Payload ───────────────────────────────────────────────────────

export interface AssessmentSubmission {
  lead: LeadInfo;
  responses: AssessmentResponse[];
  sourcePath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  userAgent?: string;
}
