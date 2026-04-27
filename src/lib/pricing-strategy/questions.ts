import type { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "timeline",
    label: "How soon are you hoping to have your home sold?",
    options: [
      { value: "30-days",  label: "Within the next 30 days" },
      { value: "90-days",  label: "Within 60–90 days" },
      { value: "6-months", label: "3–6 months from now" },
      { value: "flexible", label: "I'm flexible — no hard deadline" },
    ],
  },
  {
    id: "condition",
    label: "How would you describe your home's current condition?",
    options: [
      { value: "move-in-ready", label: "Move-in ready — updated and well-maintained" },
      { value: "minor-updates", label: "Good shape, but a few cosmetic things to address" },
      { value: "needs-work",    label: "Needs some repairs or updating" },
      { value: "as-is",        label: "We plan to sell as-is, without making changes" },
    ],
  },
  {
    id: "priority",
    label: "When it comes to your sale, what matters most to you?",
    options: [
      { value: "highest-price", label: "Getting the highest possible price" },
      { value: "fastest-sale",  label: "Selling quickly with minimal hassle" },
      { value: "balance",       label: "A good balance of speed and price" },
      { value: "certainty",     label: "Certainty — I need a reliable outcome, not a gamble" },
    ],
  },
  {
    id: "value-confidence",
    label: "How confident are you in your estimate of your home's market value?",
    options: [
      { value: "very-confident",    label: "Very confident — I've done my research" },
      { value: "somewhat-confident", label: "Somewhat confident — I have a general idea" },
      { value: "uncertain",         label: "Not sure — I'd like guidance" },
      { value: "no-idea",           label: "I have no idea and need help figuring it out" },
    ],
  },
  {
    id: "next-move",
    label: "What are your plans after selling?",
    options: [
      { value: "buying-local",     label: "Buying another home in the area" },
      { value: "buying-elsewhere", label: "Relocating and buying somewhere else" },
      { value: "downsizing",       label: "Downsizing or moving to a rental" },
      { value: "not-sure",         label: "Haven't decided yet" },
    ],
  },
  {
    id: "repairs-flexibility",
    label: "If a buyer asked for repairs or concessions during escrow, how would you feel?",
    options: [
      { value: "open",         label: "Open to it — I'd rather keep the deal moving" },
      { value: "case-by-case", label: "Depends on the request — I'd evaluate each one" },
      { value: "reluctant",    label: "I'd prefer to avoid this if possible" },
      { value: "firm",         label: "I plan to sell as-is and would not negotiate repairs" },
    ],
  },
  {
    id: "occupancy",
    label: "Is the home currently occupied?",
    options: [
      { value: "owner-occupied",   label: "Yes — I live there" },
      { value: "tenant-occupied",  label: "Yes — a tenant is living there" },
      { value: "vacant",           label: "No — it's vacant" },
      { value: "part-time",        label: "Part-time / seasonal use" },
    ],
  },
  {
    id: "city-zip",
    label: "What city or ZIP code is the property in?",
    options: [
      { value: "thousand-oaks",    label: "Thousand Oaks" },
      { value: "westlake-village", label: "Westlake Village" },
      { value: "newbury-park",     label: "Newbury Park" },
      { value: "camarillo",        label: "Camarillo" },
      { value: "ventura",          label: "Ventura" },
      { value: "oxnard",           label: "Oxnard" },
      { value: "other",            label: "Other / I'll share when we connect" },
    ],
    optional: true,
  },
];
