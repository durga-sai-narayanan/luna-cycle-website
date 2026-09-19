import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, ArrowRight, ArrowLeft, Check, Info } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Disclaimer from "@/components/Disclaimer";
import { symptomOptions, conditionSymptoms } from "@/data/symptoms";
import { conditions, getCondition } from "@/data/conditions";
import { cn } from "@/lib/utils";

const accentText = {
  violet: "text-violet-300",
  sky: "text-sky-300",
  emerald: "text-emerald-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
};
const accentBar = {
  violet: "bg-violet-400",
  sky: "bg-sky-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
  rose: "bg-rose-400",
};

export default function SymptomChecker() {
  const [step, setStep] = useState(0); // 0 intro, 1 select, 2 results
  const [selected, setSelected] = useState([]);

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const results = conditions
    .map((c) => {
      const cSymptoms = conditionSymptoms[c.slug] || [];
      const overlap = cSymptoms.filter((s) => selected.includes(s));
      const score = cSymptoms.length ? overlap.length / cSymptoms.length : 0;
      return { condition: c, overlap, total: cSymptoms.length, score };
    })
    .filter((r) => r.overlap.length > 0)
    .sort((a, b) => b.score - a.score || b.overlap.length - a.overlap.length);

  const reset = () => {
    setSelected([]);
    setStep(0);
  };

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Tool"
        icon={ClipboardList}
        title="Symptom Checker"
        description="Map what you're experiencing and see which conditions share overlapping symptoms. This is an educational tool to help you prepare questions — not a diagnosis."
      />

      {/* Stepper */}
      <div className="mb-8 flex items-center gap-2 text-xs">
        {["Introduction", "Your symptoms", "Overlap"].map((label, i) => (
          <React.Fragment key={label}>
            <span
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 font-medium",
                step >= i ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground"
              )}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[10px]">
                {step > i ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {label}
            </span>
            {i < 2 && <span className="h-px w-6 bg-border" />}
          </React.Fragment>
        ))}
      </div>

      {step === 0 && (
        <div className="animate-fade-in-up rounded-2xl border border-border bg-card p-8">
          <h2 className="font-heading text-xl font-semibold">Before you begin</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Select any symptoms you've experienced. You can choose as many or as few as you like. Based on your selections, we'll show conditions that share overlapping symptoms — not because you have them, but because several conditions can look similar.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex gap-2.5"><Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" /> This tool does not diagnose any condition.</li>
            <li className="flex gap-2.5"><Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" /> Your answers stay in your browser — nothing is stored or sent anywhere.</li>
            <li className="flex gap-2.5"><Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" /> If symptoms are severe or disrupting your life, please speak with a healthcare professional.</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
            >
              Begin
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in-up">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">
              Select your symptoms
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {selected.length} selected
              </span>
            </h2>
            {selected.length > 0 && (
              <button onClick={() => setSelected([])} className="text-sm text-muted-foreground hover:text-foreground">
                Clear all
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {symptomOptions.map((s) => {
              const active = selected.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                    active
                      ? "border-primary/50 bg-primary/10 shadow-[0_0_24px_-10px_hsl(263_70%_76%/0.5)]"
                      : "border-border bg-card hover:border-primary/30 hover:bg-secondary"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    )}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{s.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{s.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              onClick={() => setStep(0)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={selected.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              See overlap
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in-up space-y-6">
          <Disclaimer variant="prominent">
            These results are not a diagnosis. Several conditions can cause similar symptoms. This tool is designed to help you understand possible symptom patterns and prepare questions for a healthcare professional.
          </Disclaimer>

          <div>
            <h2 className="font-heading text-2xl font-semibold">Conditions with overlapping symptoms</h2>
            <p className="mt-2 text-muted-foreground">
              Based on the {selected.length} symptom{selected.length !== 1 && "s"} you selected, these conditions share some of the same symptoms. Higher overlap means more of your selected symptoms appear in that condition's common pattern.
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              No conditions matched your selections. Try selecting more symptoms, or explore the{" "}
              <Link to="/conditions" className="text-primary hover:underline">Condition Explorer</Link> directly.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map(({ condition, overlap, total, score }) => {
                const pct = Math.round(score * 100);
                return (
                  <div key={condition.slug} className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className={cn("font-heading text-lg font-semibold", accentText[condition.accent])}>
                          {condition.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{condition.tagline}</p>
                      </div>
                      <Link
                        to={`/conditions/${condition.slug}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary"
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Symptom overlap</span>
                        <span className="font-medium text-foreground">
                          {overlap.length} of your {selected.length} selected · {pct}% of this condition's pattern
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={cn("h-full rounded-full transition-all", accentBar[condition.accent])}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {overlap.map((sid) => {
                        const sym = symptomOptions.find((o) => o.id === sid);
                        return (
                          <span key={sid} className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground/80">
                            {sym?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" /> Adjust selections
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
