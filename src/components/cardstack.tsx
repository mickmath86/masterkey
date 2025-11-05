"use client";
import { CardStack } from "@/components/ui/card-stack";
import { cn } from "@/lib/utils";
export function Cardstack() {
  return (
    <div className="h-[40rem] flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    name: "Home Valuation",
    designation: "Current Market Value",
    content: (
      <div className="text-center space-y-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mx-auto"></div>
        <div className="text-2xl font-bold text-gray-900">$875,000</div>
        <div className="text-sm font-medium text-green-600">+$48,000 (6%)</div>
        <div className="text-xs text-gray-500 mt-2">Updated just now</div>
      </div>
    ),
  },
  {
    id: 1,
    name: "AI Recommendation",
    designation: "Market Analysis",
    content: (
      <div className="text-center space-y-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mx-auto"></div>
        <div className="text-lg font-semibold text-gray-900">Sell Now</div>
        <div className="text-sm font-medium text-blue-600">Market Trending Up</div>
        <div className="text-xs text-gray-500 mt-2">94% Confidence</div>
      </div>
    ),
  },
  {
    id: 2,
    name: "Market Activity",
    designation: "Local Insights",
    content: (
      <div className="text-center space-y-3">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mx-auto"></div>
        <div className="text-2xl font-bold text-gray-900">28 Days</div>
        <div className="text-sm font-medium text-purple-600">Avg Time on Market</div>
        <div className="text-xs text-gray-500 mt-2">47 new listings</div>
      </div>
    ),
  },
];
