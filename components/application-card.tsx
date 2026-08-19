import { ArrowUpRight, LockKeyhole } from "lucide-react";

import type { Application } from "@/lib/applications";

const statusStyles = {
  available: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-amber-200 bg-amber-50 text-amber-900",
  "coming-soon": "border-slate-200 bg-slate-100 text-slate-600",
} as const;

export function ApplicationCard({ application }: { application: Application }) {
  const Icon = application.icon;
  const isAvailable = Boolean(application.href);

  return (
    <article
      className={`group flex min-h-[17rem] flex-col rounded-2xl border p-6 shadow-[0_14px_32px_rgba(21,35,61,0.06)] transition-colors sm:p-7 ${
        isAvailable
          ? "border-[var(--border)] bg-[var(--surface)] hover:border-[#aebbd0]"
          : "border-[#e1e7ef] bg-[#fafbfd]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-xl border ${
            isAvailable
              ? "border-[#c7d4e7] bg-[#eef3fb] text-[var(--navy)]"
              : "border-[#dce3ed] bg-white text-[#718097]"
          }`}
          aria-hidden="true"
        >
          <Icon className="size-6" strokeWidth={1.8} />
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold leading-none ${statusStyles[application.status]}`}
        >
          {application.statusLabel}
        </span>
      </div>

      <div className="mt-7">
        <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-[var(--ink)]">
          {application.name}
        </h2>
        <p className="mt-3 max-w-[33rem] text-sm leading-6 text-[var(--muted)]">
          {application.description}
        </p>
      </div>

      <div className="mt-auto pt-7">
        {application.href ? (
          <a
            href={application.href}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--orange)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#db5105] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--orange)]"
          >
            Open application
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        ) : (
          <span className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d9e1eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#6f7d92]">
            <LockKeyhole className="size-4" aria-hidden="true" />
            Not available yet
          </span>
        )}
      </div>
    </article>
  );
}
