import React from "react";
import { Info, BookOpen, ShieldCheck, FileText, HeartPulse } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Disclaimer from "@/components/Disclaimer";

export default function About() {
  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="About"
        icon={Info}
        title="About Lumina"
        description="Why this project exists, what it is — and what it is not."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <Card icon={HeartPulse} accent="violet" title="Why menstrual health education matters">
            <p>
              Menstrual health is often under-discussed, and many people experience symptoms for years before receiving clear information or support. Severe pain, heavy bleeding, and disruptive symptoms are frequently normalized — even when they may be worth investigating.
            </p>
            <p className="mt-3">
              Better education helps people recognize patterns in their own bodies, understand the range of what is possible, and have more informed, specific conversations with healthcare professionals.
            </p>
          </Card>

          <Card icon={BookOpen} accent="sky" title="Our educational purpose">
            <p>
              Lumina is an interactive space for learning about menstrual health, recognizing symptom patterns, and exploring the science behind menstrual products and conditions. It is designed to help you ask better questions — not to answer them on your behalf.
            </p>
          </Card>

          <Card icon={ShieldCheck} accent="amber" title="What this project is not">
            <ul className="space-y-2">
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" /> Lumina is not a diagnostic tool and does not diagnose any condition.</li>
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" /> It does not provide medical advice, treatment recommendations, or prescriptions.</li>
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" /> It is not a replacement for evaluation by a qualified healthcare professional.</li>
            </ul>
          </Card>

          <Card icon={FileText} accent="emerald" title="Our commitment to credible sources">
            <p>
              We are committed to building this platform on credible scientific and medical sources. As content is researched and reviewed, citations and references will be added transparently. We will not invent citations or present uncertain evidence as settled fact.
            </p>
          </Card>
        </div>

        <div id="sources" className="space-y-5 scroll-mt-24">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-semibold">Sources</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              This section is a placeholder for a curated list of scientific papers, medical organizations, and other credible sources. Sources will be added here as content is reviewed.
            </p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Peer-reviewed research", note: "To be added with citations" },
                { label: "Medical & public health organizations", note: "To be added" },
                { label: "Regulatory & manufacturer disclosures", note: "To be added" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-dashed border-border bg-background/40 p-3">
                  <p className="text-sm font-medium text-foreground/80">{s.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.note}</p>
                </div>
              ))}
            </div>
          </div>

          <Disclaimer variant="prominent" />
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, accent, title, children }) {
  const ring = {
    violet: "text-violet-300 bg-violet-500/10 ring-violet-500/30",
    sky: "text-sky-300 bg-sky-500/10 ring-sky-500/30",
    emerald: "text-emerald-300 bg-emerald-500/10 ring-emerald-500/30",
    amber: "text-amber-300 bg-amber-500/10 ring-amber-500/30",
  }[accent];
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${ring}`}>
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
      </div>
      <div className="mt-4 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
