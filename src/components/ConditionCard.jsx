import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const accentMap = {
  violet: "from-violet-500/15 to-violet-500/5 text-violet-300 border-violet-500/30",
  sky: "from-sky-500/15 to-sky-500/5 text-sky-300 border-sky-500/30",
  emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-300 border-emerald-500/30",
  amber: "from-amber-500/15 to-amber-500/5 text-amber-300 border-amber-500/30",
  rose: "from-rose-500/15 to-rose-500/5 text-rose-300 border-rose-500/30",
};

export default function ConditionCard({ condition, to, actionLabel = "Learn More", footer }) {
  const accent = accentMap[condition.accent] || accentMap.violet;
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_-12px_hsl(263_70%_76%/0.35)]">
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-70", accent)} />
      <span className={cn("inline-flex w-fit items-center rounded-full border bg-gradient-to-b px-2.5 py-1 text-xs font-medium", accent)}>
        {condition.name}
      </span>
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{condition.tagline}</p>
      <p className="mt-3 text-sm text-foreground/80 leading-relaxed line-clamp-3">{condition.overview}</p>
      <div className="mt-auto pt-5">
        {footer || (
          <Link
            to={to || `/conditions/${condition.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
