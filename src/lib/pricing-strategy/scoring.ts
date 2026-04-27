import type {
  AssessmentResponse,
  DerivedInsights,
  StrategyResult,
  StrategyType,
} from "./types";

// ─── Derive structured insights from raw responses ───────────────────────────

export function deriveInsights(responses: AssessmentResponse[]): DerivedInsights {
  const get = (id: string) => responses.find((r) => r.questionId === id)?.answerValue ?? "";

  const timeline    = get("timeline");
  const condition   = get("condition");
  const priority    = get("priority");
  const occupancy   = get("occupancy");

  const timelineCategory: DerivedInsights["timelineCategory"] =
    timeline === "30-days" ? "urgent"
    : timeline === "flexible" ? "exploratory"
    : "flexible";

  const prepCategory: DerivedInsights["prepCategory"] =
    condition === "move-in-ready" ? "move-in-ready"
    : condition === "minor-updates" ? "minor-updates"
    : "needs-work";

  const pricingPriority: DerivedInsights["pricingPriority"] =
    priority === "highest-price" ? "price"
    : priority === "fastest-sale" ? "speed"
    : "balance";

  const occupancyType: DerivedInsights["occupancyType"] =
    occupancy === "tenant-occupied" ? "tenant-occupied"
    : occupancy === "vacant" ? "vacant"
    : "owner-occupied";

  return { timelineCategory, prepCategory, pricingPriority, occupancyType };
}

// ─── Map insights → strategy archetype ───────────────────────────────────────

export function scoreStrategy(insights: DerivedInsights): {
  strategyType: StrategyType;
  confidenceBand: StrategyResult["confidenceBand"];
} {
  const { timelineCategory, prepCategory, pricingPriority } = insights;

  // Price for speed: urgent timeline or speed priority
  if (timelineCategory === "urgent" || pricingPriority === "speed") {
    return { strategyType: "price-for-speed", confidenceBand: "High" };
  }

  // Prep first: needs work + not in a rush + price-focused
  if (prepCategory === "needs-work" && pricingPriority === "price" && timelineCategory !== "urgent") {
    return { strategyType: "prep-first", confidenceBand: "Moderate" };
  }

  // Price to test: move-in-ready + price-focused + flexible timeline
  if (prepCategory === "move-in-ready" && pricingPriority === "price" && timelineCategory === "exploratory") {
    return { strategyType: "price-to-test", confidenceBand: "Moderate" };
  }

  // Default: price at market
  return { strategyType: "price-at-market", confidenceBand: "High" };
}

// ─── Strategy archetype copy ──────────────────────────────────────────────────

const STRATEGY_PROFILES: Record<StrategyType, Omit<StrategyResult, "strategyType" | "confidenceBand">> = {
  "price-for-speed": {
    strategyLabel: "Price for Speed",
    headline: "Lead with a competitive list price to generate immediate offer momentum.",
    rationale:
      "Your timeline and priorities suggest that velocity matters more than squeezing every dollar from the sale. Homes priced at or just below market value in the Conejo Valley typically attract more showings in the first week — and first-week activity is the strongest predictor of final sale price. Overpricing early and reducing later tends to net less, not more.",
    keyRisks: [
      "Pricing too aggressively below market may signal distress to buyers.",
      "Accepting the first offer quickly without evaluating competing interest.",
      "Skipping prep work that could meaningfully increase the price even on a fast timeline.",
    ],
    nextSteps: [
      "Request a current comparative market analysis (CMA) to anchor your list price.",
      "Address any deferred maintenance that a buyer inspection would flag.",
      "Set clear criteria for offer evaluation before listing — don't decide under pressure.",
    ],
    practicalMeaning:
      "In practice, 'price for speed' doesn't mean giving the home away. It means entering the market at a number that creates competition, not one that deters buyers. We'll help you find that number using live local comp data.",
    disclaimer:
      "Final pricing decisions should be made in consultation with your agent using current comparable sales, active inventory, and days-on-market data specific to your neighborhood.",
  },

  "price-at-market": {
    strategyLabel: "Price at Market",
    headline: "List at the most defensible market price and let the data do the work.",
    rationale:
      "Your situation calls for a market-aligned approach — neither aggressive nor speculative. Homes priced accurately based on recent comparable sales attract qualified buyers and tend to close cleanly without the renegotiation cycles that often come from overpricing. In the Conejo Valley, well-priced homes are still moving with limited time on market.",
    keyRisks: [
      "Pricing based on outdated comps or emotional attachment to a number.",
      "Missing a pricing adjustment window if the home doesn't attract offers in the first two weeks.",
      "Overlooking condition issues that buyers will use to negotiate concessions.",
    ],
    nextSteps: [
      "Obtain a CMA that pulls closed sales from the past 60–90 days in your specific neighborhood.",
      "Stage and prepare the home to compete with recently sold comparables.",
      "Set a two-week review period to evaluate market response and adjust if needed.",
    ],
    practicalMeaning:
      "Pricing at market means using data, not wishful thinking. It also means being prepared to respond to the market's feedback — whether that's multiple offers or a quiet first week.",
    disclaimer:
      "Final pricing decisions should be made in consultation with your agent using current comparable sales, active inventory, and days-on-market data specific to your neighborhood.",
  },

  "price-to-test": {
    strategyLabel: "Price With Room to Test",
    headline: "You have the flexibility to test a higher price — but with a clear decision framework.",
    rationale:
      "Your home is in strong condition and you're not under pressure to sell immediately. That gives you the opportunity to enter the market at the upper range of defensible values and see how buyers respond. This strategy can work well in the Conejo Valley for well-presented homes in desirable neighborhoods — but it requires discipline: a clear price reduction threshold and timeline if the market doesn't respond within two to three weeks.",
    keyRisks: [
      "Overextending your test price to a number the market clearly won't support.",
      "Waiting too long to reduce and losing the 'new listing' momentum window.",
      "Allowing price reductions to signal desperation rather than strategic adjustment.",
    ],
    nextSteps: [
      "Define upfront what threshold of showing activity or offers would trigger a price adjustment.",
      "Set a hard 14-day review date with your agent before listing.",
      "Ensure your home's presentation matches the premium you're testing — professional photography, staging, and curb appeal are non-negotiable at this price point.",
    ],
    practicalMeaning:
      "Testing a price isn't about gambling — it's about entering a clearly defined range and committing to a response plan. Buyers can sense when sellers are uncertain; confidence in your pricing posture matters.",
    disclaimer:
      "Final pricing decisions should be made in consultation with your agent using current comparable sales, active inventory, and days-on-market data specific to your neighborhood.",
  },

  "prep-first": {
    strategyLabel: "Prepare First, Then Price Strategically",
    headline: "Investing in the right prep work before listing will protect — and likely improve — your final price.",
    rationale:
      "Based on your responses, your home may need some attention before it's ready to compete with well-presented listings in your market. Sellers who list before addressing obvious condition issues tend to attract lower offers, more aggressive inspection requests, and longer time on market. A focused prep strategy — even a modest one — often returns more than its cost in the Conejo Valley market.",
    keyRisks: [
      "Over-improving — spending on upgrades that don't return value in your price range.",
      "Delaying your timeline indefinitely while chasing 'perfect' condition.",
      "Skipping a pre-listing inspection that could surface expensive surprises mid-escrow.",
    ],
    nextSteps: [
      "Order a pre-listing inspection so you know what buyers will find — and can address it on your terms.",
      "Prioritize cosmetic improvements with clear visual impact: paint, landscaping, and cleaning.",
      "Ask your agent which repairs are likely to affect buyer perception most in your neighborhood.",
    ],
    practicalMeaning:
      "Preparing your home before listing is not about perfection. It's about removing the objections that give buyers leverage to negotiate your price down. A well-prepared home commands better offers and cleaner escrows.",
    disclaimer:
      "Final pricing decisions should be made in consultation with your agent using current comparable sales, active inventory, and days-on-market data specific to your neighborhood.",
  },
};

// ─── Build full strategy result ───────────────────────────────────────────────

export function buildStrategyResult(
  strategyType: StrategyType,
  confidenceBand: StrategyResult["confidenceBand"]
): StrategyResult {
  return {
    strategyType,
    confidenceBand,
    ...STRATEGY_PROFILES[strategyType],
  };
}

// ─── Entry point: score full assessment ──────────────────────────────────────

export function scoreAssessment(responses: AssessmentResponse[]): {
  strategyResult: StrategyResult;
  derivedInsights: DerivedInsights;
} {
  const derivedInsights = deriveInsights(responses);
  const { strategyType, confidenceBand } = scoreStrategy(derivedInsights);
  const strategyResult = buildStrategyResult(strategyType, confidenceBand);
  return { strategyResult, derivedInsights };
}
