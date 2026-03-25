"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { getNewsArticles } from "@/lib/queries";
import type { NewsArticle } from "@/lib/types";

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsArticles(12)
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900">News</h1>
          <p className="text-sm text-gray-500 mt-1">
            Latest real estate news and market updates relevant to Ventura
            County.
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
        <h1 className="text-lg font-semibold text-gray-900">News</h1>
        <p className="text-sm text-gray-500 mt-1">
          Latest real estate news and market updates relevant to Ventura County.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((item) => (
          <a
            key={item.id}
            href={item.article_url}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                  {item.category}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-mk-teal transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{item.source}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.published_date}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
