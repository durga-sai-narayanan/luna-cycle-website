import React, { useState } from "react";
import { FlaskConical, Search, Info, Beaker, Waves } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EvidenceBadge, { EvidenceLegend } from "@/components/EvidenceBadge";
import Disclaimer from "@/components/Disclaimer";
import { products, productCategories, productFieldLabels } from "@/data/products";
import { cn } from "@/lib/utils";

export default function ProductScience() {
  const [activeCat, setActiveCat] = useState("pads");
  const [query, setQuery] = useState("");

  const filtered = products.filter(
    (p) =>
      p.category === activeCat &&
      (query.trim() === "" || p.name.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Evidence-based"
        icon={FlaskConical}
        accent="emerald"
        title="Product Science"
        description="Explore the materials, ingredients, and research behind menstrual products. We distinguish what scientists know, what researchers are investigating, what is uncertain, and what manufacturers disclose."
      />

      {/* Evidence legend */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Evidence status key</h2>
        <EvidenceLegend />
      </section>

      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {productCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
              activeCat === c.id
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mb-5 flex items-center gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-3 text-sm"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {productCategories.find((c) => c.id === activeCat)?.description}
        </p>
      </div>

      {/* Product cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-lg font-semibold">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
            <dl className="mt-5 space-y-3">
              {Object.entries(p.fields).map(([key, field]) => (
                <div key={key} className="grid grid-cols-1 gap-1 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-3">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {productFieldLabels[key]}
                    </dt>
                    <dd className="mt-1 text-sm text-foreground/90">{field.value}</dd>
                  </div>
                  <EvidenceBadge status={field.evidence} />
                </div>
              ))}
            </dl>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No products match your search yet. This database is a starting structure — more products and research will be added over time.
          </div>
        )}
      </div>

      {/* PFAS + Microplastics */}
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <ExplainerCard
          icon={Beaker}
          accent="amber"
          title="PFAS, in plain language"
          body="PFAS (per- and polyfluoroalkyl substances) are a large group of human-made chemicals used to make things resistant to heat, stains, and water. They are sometimes called 'forever chemicals' because they break down very slowly. Some independent studies have detected fluorinated compounds in certain menstrual products, while others have not. Research is still developing, and not every product has been tested. The presence of a compound is not the same as harm — but transparency matters."
        />
        <ExplainerCard
          icon={Waves}
          accent="sky"
          title="Microplastics, in plain language"
          body="Microplastics are tiny plastic particles that can shed from products made with synthetic materials. Many menstrual products contain plastics — in backing layers, applicators, wrappers, and absorbent cores. Researchers are actively studying whether and how much these products shed microplastics, and what that might mean. Direct evidence is still limited, which is why we label much of this area as 'developing' or 'unknown' rather than making claims."
        />
      </div>

      <div className="mt-8">
        <Disclaimer variant="prominent">
          We do not claim that any product is 'toxic' or unsafe. Evidence statuses describe the state of research and disclosure — not a safety verdict. Always consult a healthcare professional for personal guidance.
        </Disclaimer>
      </div>

      <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-sm text-sky-100/90">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
        <p>This section is built as a searchable structure. Product entries, third-party test results, and citations will be added as they are reviewed.</p>
      </div>
    </div>
  );
}

function ExplainerCard({ icon: Icon, accent, title, body }) {
  const ring = {
    amber: "text-amber-300 bg-amber-500/10 ring-amber-500/30",
    sky: "text-sky-300 bg-sky-500/10 ring-sky-500/30",
  }[accent];
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2.5">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1", ring)}>
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
      </div>
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
