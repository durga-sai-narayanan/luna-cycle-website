import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, CircleDot, ListChecks, Activity, GitMerge, Stethoscope, AlertCircle, Microscope, HelpCircle, ChevronRight } from "lucide-react";
import { getCondition, conditions } from "@/data/conditions";
import ConditionCard from "@/components/ConditionCard";
import Disclaimer from "@/components/Disclaimer";
import { cn } from "@/lib/utils";

const accentText = {
  violet: "text-violet-300",
  sky: "text-sky-300",
  emerald: "text-emerald-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
};
const accentRing = {
  violet: "text-violet-300 bg-violet-500/10 ring-violet-500/30",
  sky: "text-sky-300 bg-sky-500/10 ring-sky-500/30",
  emerald: "text-emerald-300 bg-emerald-500/10 ring-emerald-500/30",
  amber: "text-amber-300 bg-amber-500/10 ring-amber-500/30",
  rose: "text-rose-300 bg-rose-500/10 ring-rose-500/30",
};

export default function ConditionDetail() {
  const { slug } = useParams();
  const condition = getCondition(slug);
  if (!condition) return <Navigate to="/conditions" replace />;

  const related = condition.related.map((s) => getCondition(s)).filter(Boolean);

  const sections = [
    { icon: CircleDot, title: "What is it?", body: condition.sections.whatIsIt },
    { icon: ListChecks, title: "Common symptoms", list: condition.sections.commonSymptoms },
    { icon: Activity, title: "How symptoms may affect daily life", body: condition.sections.dailyLife },
    { icon: GitMerge, title: "How it may overlap with other conditions", body: condition.sections.overlaps },
    { icon: Stethoscope, title: "How healthcare professionals may investigate it", body: condition.sections.investigation },
    { icon: AlertCircle, title: "Common misconceptions", list: condition.sections.misconceptions },
    { icon: Microscope, title: "What researchers are still learning", body: condition.sections.stillLearning },
    { icon: HelpCircle, title: "Questions you could ask a healthcare professional", list: condition.sections.questions },
  ];

  return (
    <div className="pb-12">
      <div className="pt-12">
        <Link to="/conditions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All conditions
        </Link>
      </div>

      <header className="mt-6 rounded-2xl border border-border bg-card p-8">
        <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1", accentRing[condition.accent])}>
          {condition.name}
        </span>
        <h1 className={cn("mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl", accentText[condition.accent])}>
          {condition.name}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">{condition.tagline}</p>
        <p className="mt-4 max-w-3xl text-foreground/85 leading-relaxed">{condition.overview}</p>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <section
              key={i}
              className={cn(
                "rounded-2xl border border-border bg-card p-6",
                i === 0 && "lg:col-span-2"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl ring-1", accentRing[condition.accent])}>
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-heading text-lg font-semibold">{s.title}</h2>
              </div>
              {s.body && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{s.body}</p>}
              {s.list && (
                <ul className="mt-4 space-y-2.5">
                  {s.list.map((item, j) => (
                    <li key={j} className="flex gap-2.5 text-sm text-foreground/90">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Related conditions */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-xl font-semibold">Related conditions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            These conditions share symptoms or themes. Exploring connections can build context — it does not imply that one condition causes another.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <ConditionCard key={c.slug} condition={c} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Disclaimer variant="prominent">
          This page is educational and does not provide a diagnosis or replace professional medical advice. If your symptoms are severe or affecting your daily life, please speak with a healthcare professional.
        </Disclaimer>
      </div>
    </div>
  );
}
