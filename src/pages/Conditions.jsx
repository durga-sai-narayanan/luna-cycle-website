import React, { useState, useMemo } from "react";
import { BookOpen, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ConditionCard from "@/components/ConditionCard";
import Disclaimer from "@/components/Disclaimer";
import { conditions } from "@/data/conditions";

export default function Conditions() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      conditions.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.tagline.toLowerCase().includes(query.toLowerCase()) ||
          c.overview.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Library"
        icon={BookOpen}
        accent="amber"
        title="Condition Explorer"
        description="Browse clear, evidence-based explanations of menstrual and reproductive health conditions. Each page explores what a condition is, how it may overlap with others, and what researchers are still learning."
      />

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conditions…"
          className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-3 text-sm"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <ConditionCard key={c.slug} condition={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No conditions match your search.</p>
      )}

      <div className="mt-10">
        <Disclaimer />
      </div>
    </div>
  );
}
