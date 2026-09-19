import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { CalendarRange, Plus, TrendingUp, Droplet, Activity, Lightbulb, X } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import Disclaimer from "@/components/Disclaimer";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "lumina-tracker-entries";

const seedEntries = [
  { id: "s1", date: "2026-07-05", bleeding: 3, pain: 4, painLocation: "Lower abdomen", fatigue: 2, headaches: 1, nausea: 0, digestive: 2, back: 3, impact: "Missed one class" },
  { id: "s2", date: "2026-07-06", bleeding: 4, pain: 3, painLocation: "Lower abdomen", fatigue: 3, headaches: 1, nausea: 1, digestive: 1, back: 2, impact: "" },
  { id: "s3", date: "2026-07-07", bleeding: 2, pain: 2, painLocation: "Lower back", fatigue: 2, headaches: 0, nausea: 0, digestive: 0, back: 2, impact: "" },
  { id: "s4", date: "2026-08-02", bleeding: 3, pain: 5, painLocation: "Lower abdomen", fatigue: 3, headaches: 2, nausea: 1, digestive: 2, back: 3, impact: "Took a day off work" },
  { id: "s5", date: "2026-08-03", bleeding: 4, pain: 4, painLocation: "Lower abdomen", fatigue: 4, headaches: 1, nausea: 1, digestive: 1, back: 2, impact: "Poor sleep" },
  { id: "s6", date: "2026-08-04", bleeding: 2, pain: 2, painLocation: "Lower back", fatigue: 2, headaches: 0, nausea: 0, digestive: 0, back: 1, impact: "" },
];

const levelLabels = ["None", "Mild", "Moderate", "Heavy", "Severe"];
const bleedingLabels = ["None", "Light", "Moderate", "Heavy", "Very heavy"];

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  bleeding: 2,
  pain: 2,
  painLocation: "Lower abdomen",
  fatigue: 1,
  headaches: 0,
  nausea: 0,
  digestive: 1,
  back: 1,
  impact: "",
};

function fmtDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function HealthTracker() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
      else setEntries(seedEntries);
    } catch {
      setEntries(seedEntries);
    }
  }, []);

  useEffect(() => {
    if (entries.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    const entry = { ...form, id: crypto.randomUUID() };
    setEntries((prev) => [...prev, entry].sort((a, b) => a.date.localeCompare(b.date)));
    setForm(emptyForm);
    setShowForm(false);
  };

  const removeEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  // Charts data
  const sorted = useMemo(() => [...entries].sort((a, b) => a.date.localeCompare(b.date)), [entries]);
  const painData = sorted.map((e) => ({ date: fmtDate(e.date), pain: e.pain, fatigue: e.fatigue }));
  const bleedingData = sorted.map((e) => ({ date: fmtDate(e.date), bleeding: e.bleeding }));

  // Patterns
  const highPainCycles = sorted.filter((e) => e.pain >= 4).length;
  const impactEntries = sorted.filter((e) => e.impact && e.impact.trim().length > 0);
  const patterns = [];
  if (highPainCycles >= 2)
    patterns.push(`You reported significant pain (level 4 or higher) across ${highPainCycles} recorded day${highPainCycles !== 1 ? "s" : ""}.`);
  if (impactEntries.length >= 1)
    patterns.push(`You noted that symptoms affected daily activities on ${impactEntries.length} day${impactEntries.length !== 1 ? "s" : ""} (e.g. "${impactEntries[0].impact}").`);
  if (sorted.length >= 3) {
    const avgBleeding = sorted.reduce((s, e) => s + e.bleeding, 0) / sorted.length;
    if (avgBleeding >= 3)
      patterns.push("Your average bleeding level trends toward heavy across recorded days.");
  }
  if (patterns.length === 0)
    patterns.push("Not enough data yet to identify patterns. Keep logging — even a few cycles can reveal useful trends.");

  // Calendar
  const monthName = viewMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const entryByDate = {};
  entries.forEach((e) => {
    const ed = new Date(e.date + "T00:00:00");
    if (ed.getFullYear() === viewMonth.getFullYear() && ed.getMonth() === viewMonth.getMonth())
      entryByDate[ed.getDate()] = e;
  });

  const bleedingColor = (lvl) => {
    const map = ["bg-transparent", "bg-sky-500/40", "bg-sky-500/60", "bg-sky-400/80", "bg-violet-400/90"];
    return map[lvl] || "bg-transparent";
  };

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Personal dashboard"
        icon={CalendarRange}
        accent="sky"
        title="Health Tracker"
        description="Log symptoms over time and visualize patterns in your own data. Everything stays in your browser on this device — nothing is uploaded."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {entries.length} day{entries.length !== 1 && "s"} logged
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Log a day
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={() => setShowForm(false)}>
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-card p-6 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">Log a day</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-secondary" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Field label="Date">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
              <SliderField label="Bleeding level" value={form.bleeding} labels={bleedingLabels} onChange={(v) => setForm({ ...form, bleeding: v })} />
              <SliderField label="Pain severity" value={form.pain} labels={levelLabels} onChange={(v) => setForm({ ...form, pain: v })} />
              <Field label="Pain location">
                <select
                  value={form.painLocation}
                  onChange={(e) => setForm({ ...form, painLocation: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  {["Lower abdomen", "Lower back", "Pelvic", "None"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <SliderField label="Fatigue" value={form.fatigue} labels={levelLabels} onChange={(v) => setForm({ ...form, fatigue: v })} />
                <SliderField label="Headaches" value={form.headaches} labels={levelLabels} onChange={(v) => setForm({ ...form, headaches: v })} />
                <SliderField label="Nausea" value={form.nausea} labels={levelLabels} onChange={(v) => setForm({ ...form, nausea: v })} />
                <SliderField label="Digestive symptoms" value={form.digestive} labels={levelLabels} onChange={(v) => setForm({ ...form, digestive: v })} />
                <SliderField label="Back pain" value={form.back} labels={levelLabels} onChange={(v) => setForm({ ...form, back: v })} />
              </div>
              <Field label="Did symptoms affect school, work, sleep, exercise, or daily activities? (optional)">
                <textarea
                  value={form.impact}
                  onChange={(e) => setForm({ ...form, impact: e.target.value })}
                  rows={2}
                  placeholder="e.g. Missed a morning class, poor sleep"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary">Cancel</button>
                <button onClick={addEntry} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">Save entry</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard icon={Activity} accent="violet" title="Pain over time">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={painData} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="pain" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 3 }} name="Pain" />
              <Line type="monotone" dataKey="fatigue" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Fatigue" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard icon={Droplet} accent="sky" title="Bleeding patterns">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bleedingData} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="bleeding" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Bleeding" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Patterns */}
      <section className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
            <Lightbulb className="h-5 w-5" />
          </span>
          <h2 className="font-heading text-lg font-semibold">Patterns you may want to discuss</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          These are observations from your logged data — not a diagnosis. Recurring patterns are worth raising with a healthcare professional.
        </p>
        <ul className="mt-4 space-y-2.5">
          {patterns.map((p, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-foreground/90">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* Calendar + Timeline */}
      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Calendar</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} className="rounded-lg border border-border px-2.5 py-1 text-sm hover:bg-secondary">‹</button>
              <span className="text-sm font-medium w-36 text-center">{monthName}</span>
              <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} className="rounded-lg border border-border px-2.5 py-1 text-sm hover:bg-secondary">›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="py-1">{d}</div>)}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5">
            {cells.map((d, i) => {
              const entry = d ? entryByDate[d] : null;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg text-sm",
                    d ? "border border-border" : "",
                    entry ? cn("font-medium text-foreground", bleedingColor(entry.bleeding)) : "text-muted-foreground"
                  )}
                >
                  {d || ""}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-sky-500/40" /> Light</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-sky-400/80" /> Heavy</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-violet-400/90" /> Very heavy</span>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Timeline</h2>
          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
            {[...sorted].reverse().map((e) => (
              <div key={e.id} className="group rounded-xl border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{fmtDate(e.date)}</span>
                  <button onClick={() => removeEntry(e.id)} className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100" aria-label="Remove">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                  <Tag label={`Bleeding ${bleedingLabels[e.bleeding]}`} color="sky" />
                  <Tag label={`Pain ${levelLabels[e.pain]}`} color="violet" />
                  {e.fatigue > 0 && <Tag label={`Fatigue ${levelLabels[e.fatigue]}`} color="amber" />}
                  {e.impact && <Tag label="Daily impact" color="rose" />}
                </div>
              </div>
            ))}
            {entries.length === 0 && <p className="text-sm text-muted-foreground">No entries yet. Log a day to start your timeline.</p>}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Disclaimer>
          The Health Tracker helps you observe your own patterns. It does not analyze or diagnose any condition. If symptoms are severe or disrupting your life, please speak with a healthcare professional.
        </Disclaimer>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function SliderField({ label, value, labels, onChange }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{labels[value]}</span>
      </div>
      <input
        type="range"
        min={0}
        max={4}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[hsl(var(--primary))]"
      />
    </div>
  );
}

function ChartCard({ icon: Icon, title, accent, children }) {
  const ring = {
    violet: "text-violet-300 bg-violet-500/10 ring-violet-500/30",
    sky: "text-sky-300 bg-sky-500/10 ring-sky-500/30",
  }[accent];
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl ring-1", ring)}>
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Tag({ label, color }) {
  const map = {
    sky: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  };
  return <span className={cn("rounded-md border px-1.5 py-0.5", map[color])}>{label}</span>;
}
