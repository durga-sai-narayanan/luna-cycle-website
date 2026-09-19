import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <HeartPulse className="h-5 w-5" />
              </span>
              <span className="font-heading text-lg font-semibold">Lumina</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              An educational space for understanding menstrual health, recognizing patterns, and exploring the science behind the products and conditions that affect millions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explore</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/symptoms" className="text-foreground/80 hover:text-primary">Symptom Checker</Link></li>
                <li><Link to="/tracker" className="text-foreground/80 hover:text-primary">Health Tracker</Link></li>
                <li><Link to="/products" className="text-foreground/80 hover:text-primary">Product Science</Link></li>
                <li><Link to="/conditions" className="text-foreground/80 hover:text-primary">Conditions</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/about" className="text-foreground/80 hover:text-primary">Our purpose</Link></li>
                <li><Link to="/about#sources" className="text-foreground/80 hover:text-primary">Sources</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Lumina. For educational purposes only — not a medical device, diagnostic tool, or substitute for professional care.</p>
        </div>
      </div>
    </footer>
  );
}
