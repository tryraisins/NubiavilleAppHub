import { ArrowUpRight } from "lucide-react";

import { ApplicationIcon } from "@/components/application-icon";
import type { Application } from "@/lib/applications";

export function ApplicationCard({ application }: { application: Application }) {
  return (
    <a
      href={application.url}
      target={application.newTab ? "_blank" : undefined}
      rel={application.newTab ? "noreferrer" : undefined}
      className="group flex min-h-[17rem] cursor-pointer flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--card-hover-border)] hover:shadow-[var(--card-hover-shadow)] focus-visible:outline-none sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-[var(--icon-border)] bg-[var(--icon-surface)] text-[var(--navy)]" aria-hidden="true">
          <ApplicationIcon iconKey={application.iconKey} className="size-6" />
        </span>
      </div>
      <div className="mt-7">
        <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-[var(--ink)]">{application.name}</h2>
        <p className="mt-3 max-w-[33rem] text-sm leading-6 text-[var(--muted)]">{application.description}</p>
      </div>
      <div className="mt-auto pt-7">
        <span className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--orange)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors group-hover:bg-[var(--orange-hover)]">
          Open application
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
