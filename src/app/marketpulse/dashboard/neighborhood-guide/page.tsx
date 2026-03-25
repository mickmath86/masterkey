"use client";

import { useState, useEffect } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { getNeighborhoods } from "@/lib/queries";
import type { Neighborhood } from "@/lib/types";

export default function NeighborhoodGuidePage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNeighborhoods()
      .then(setNeighborhoods)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900">
            Neighborhood Guide
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore top neighborhoods across Ventura County with real-time
            market data and lifestyle insights.
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-[#1A4D4D]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Neighborhood Guide
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore top neighborhoods across Ventura County with real-time market
          data and lifestyle insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {neighborhoods.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-mk-mint flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-mk-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {n.name}
                  </h3>
                  <p className="text-xs text-gray-400">{n.city}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-mk-green flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {n.change_pct}
              </span>
            </div>
            {n.description && (
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                {n.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
                <span className="font-medium text-gray-900">
                  {n.median_price}
                </span>{" "}
                median
              </span>
              {n.schools_rating && (
                <span>
                  Schools:{" "}
                  <span className="font-medium text-gray-900">
                    {n.schools_rating}
                  </span>
                </span>
              )}
              {n.walk_score !== null && (
                <span>
                  Walk Score:{" "}
                  <span className="font-medium text-gray-900">
                    {n.walk_score}
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
