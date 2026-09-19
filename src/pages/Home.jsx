import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HeartPulse, ClipboardList, CalendarRange, FlaskConical, BookOpen, Sparkles } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

const features = [
  {
    to: "/symptoms",
    icon: ClipboardList,
    title: "Symptom Checker",
    description: "Explore symptom patterns and learn which conditions may share similar symptoms.",
    accent: "violet",
  },
  {
    to: "/tracker",
    icon: CalendarRange,
    title: "Health Tracker",
    description: "Track symptoms over time and discover patterns that may be worth discussing with a healthcare professional.",
    accent: "sky",
  },
  {
    to: "/products",
    icon: FlaskConical,
    title: "Product Science",
    description: "Explore the materials, ingredients, and research behind menstrual products.",
    accent: "emerald",
  },
  {
    to: "/conditions",
    icon: BookOpen,
    title: "Condition Explorer",
    description: "Understand menstrual and reproductive health conditions through clear, evidence-based explanations.",
    accent: "amber",
  },
];

const accentClasses = {
  violet: "text-violet-300 ring-violet-500/30 bg-violet-500/10",
  sky: "text-sky-300 ring-sky-500/30 bg-sky-500/10",
  emerald: "text-emerald-300 ring-emerald-500/30 bg-emerald-500/10",
  amber: "text-amber-300 ring-amber-500/30 bg-amber-500/10",
};

export default function Home() {
  return (
    <div className="pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)] opacity-40" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-10 top-32 h-40 w-40 animate-float-slow rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Educational · Evidence-aware · Not a diagnosis
          </span>
          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Understand Your Health.{" "}
            <span className="bg-gradient-to-r from-primary via-violet-300 to-sky-300 bg-clip-text text-transparent">
              Ask Better Questions.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed text-balance">
            An interactive space for learning about menstrual health, recognizing symptom patterns, and exploring the science behind the products and conditions that affect millions of people.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/symptoms"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_-6px_hsl(263_70%_76%/0.6)] hover:brightness-110"
            >
              Explore Your Symptoms
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/conditions"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
            >
              Learn About Conditions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="pt-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="group animate-fade-in-up rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_40px_-12px_hsl(263_70%_76%/0.35)]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${accentClasses[f.accent]}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Educational section */}
      <section className="mt-20 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            <HeartPulse className="h-3.5 w-3.5" />
            Why this matters
          </span>
          <h2 className="mt-4 font-heading text-2xl font-semibold text-balance">
            Menstrual symptoms vary widely — and severe symptoms deserve attention.
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Experiences of menstruation differ enormously from person to person. Some discomfort is common, but severe or disruptive symptoms — pain that interrupts school, work, or sleep, very heavy bleeding, or symptoms that worsen over time — should not simply be dismissed as "normal."
            </p>
            <p>
              Many conditions share overlapping symptoms, which is why self-diagnosis can be misleading. Understanding patterns in your own body can help you have more informed, specific conversations with a healthcare professional.
            </p>
            <p>
              Lumina is here to help you ask better questions — not to answer them on your behalf.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-gradient-to-b from-primary/10 to-card p-8">
          <h3 className="font-heading text-lg font-semibold text-primary">How to use this site</h3>
          <ol className="mt-4 space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">1</span>
              <span>Use the Symptom Checker to map what you're experiencing.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">2</span>
              <span>Track patterns over time in the Health Tracker.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">3</span>
              <span>Explore conditions and product science to build context.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">4</span>
              <span>Bring your questions to a healthcare professional.</span>
            </li>
          </ol>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-12">
        <Disclaimer variant="prominent" />
      </section>
    </div>
  );
}
