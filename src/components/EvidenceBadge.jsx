import React from "react";
import { CheckCircle2, FlaskConical, Sparkles, HelpCircle } from "lucide-react";
import { evidenceStatuses } from "@/data/products";
import { cn } from "@/lib/utils";

const icons = {
  green: CheckCircle2,
  blue: FlaskConical,
  yellow: Sparkles,
  gray: HelpCircle,
};

const colorClasses = {
  emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  sky: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  zinc: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
};

export default function EvidenceBadge({ status, size = "md", showLabel = true }) {
  const s = evidenceStatuses[status];
  if (!s) return null;
  const Icon = icons[status];
  const colors = colorClasses[s.color];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
        colors,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      )}
      title={s.description}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden="true" />
      {showLabel && s.short}
    </span>
  );
}

export function EvidenceLegend() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Object.values(evidenceStatuses).map((s) => {
        const Icon = icons[s.key];
        const colors = colorClasses[s.color];
        return (
          <div key={s.key} className={cn("rounded-xl border p-4", colors)}>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="font-semibold">{s.label}</span>
            </div>
            <p className="mt-1.5 text-xs opacity-80">{s.description}</p>
          </div>
        );
      })}
    </div>
  );
}
