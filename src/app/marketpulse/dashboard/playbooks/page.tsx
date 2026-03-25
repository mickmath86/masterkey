"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus } from "lucide-react";
import { getPlaybooks } from "@/lib/queries";
import type { Playbook } from "@/lib/types";

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlaybooks()
      .then(setPlaybooks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Playbooks</h1>
            <p className="text-sm text-gray-500 mt-1">
              Strategic guides and frameworks for every type of real estate
              transaction.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-[#1A4D4D]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Playbooks</h1>
          <p className="text-sm text-gray-500 mt-1">
            Strategic guides and frameworks for every type of real estate
            transaction.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-mk-teal rounded-lg hover:bg-mk-teal/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Playbook
        </button>
      </div>

      <div className="grid gap-4">
        {playbooks.map((pb) => (
          <div
            key={pb.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-mk-mint transition-colors">
                <BookOpen className="w-5 h-5 text-mk-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {pb.title}
                  </h3>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      pb.tag_color ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {pb.tag}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {pb.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
