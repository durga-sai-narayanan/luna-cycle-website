import React from "react";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Disclaimer({ className, variant = "default", children }) {
  const text =
    children ||
    "This website is for educational purposes only and does not provide medical diagnoses or replace professional medical advice.";
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border p-4 text-sm",
        variant === "prominent"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
          : "border-border bg-card/60 text-muted-foreground",
        className
      )}
      role="note"
    >
      <ShieldAlert
        className={cn("h-5 w-5 shrink-0", variant === "prominent" ? "text-amber-300" : "text-primary")}
        aria-hidden="true"
      />
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
