import React from "react";
import { cn } from "@/lib/utils";

export default function PageHeader({ eyebrow, title, description, icon: Icon, accent = "violet" }) {
  const accentRing = {
    violet: "text-violet-300 ring-violet-500/30 bg-violet-500/10",
    sky: "text-sky-300 ring-sky-500/30 bg-sky-500/10",
    emerald: "text-emerald-300 ring-emerald-500/30 bg-emerald-500/10",
    amber: "text-amber-300 ring-amber-500/30 bg-amber-500/10",
    rose: "text-rose-300 ring-rose-500/30 bg-rose-500/10",
  }[accent];
  return (
    <div className="pt-12 pb-8 sm:pt-16">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">{eyebrow}</p>
      )}
      <div className="mt-3 flex items-start gap-4">
        {Icon && (
          <span className={cn("mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1", accentRing)}>
            <Icon className="h-6 w-6" />
          </span>
        )}
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-base text-muted-foreground leading-relaxed text-balance">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
