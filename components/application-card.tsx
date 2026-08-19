import { ArrowUpRight } from "lucide-react";

import { ApplicationIcon } from "@/components/application-icon";
import type { Application } from "@/lib/applications";

export function ApplicationCard({ application, index }: { application: Application; index: number }) {
  return (
    <a
      href={application.url}
      target={application.newTab ? "_blank" : undefined}
      rel={application.newTab ? "noreferrer" : undefined}
      aria-label={application.newTab ? `Open ${application.name} in a new tab` : `Open ${application.name}`}
      data-tone={application.tone}
      className="app-card group relative flex min-h-[21rem] cursor-pointer flex-col overflow-hidden rounded-[1.65rem] border p-5 shadow-[var(--card-shadow)] transition duration-300 hover:-translate-y-1 focus-visible:outline-none sm:p-6"
    >
      <div className="app-card-art" aria-hidden="true">
        <span className="app-card-orbit app-card-orbit-one" />
        <span className="app-card-orbit app-card-orbit-two" />
        <span className="app-card-line" />
      </div>
      <div className="relative flex items-start justify-between gap-4">
        <span className="app-card-icon grid size-12 shrink-0 place-items-center rounded-2xl" aria-hidden="true">
          <ApplicationIcon iconKey={application.iconKey} className="size-5" strokeWidth={2} />
        </span>
        <span className="app-card-index font-heading text-xs font-bold tracking-[0.14em]">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="relative mt-auto pt-12">
        <h2 className="font-heading text-2xl font-bold tracking-[-0.035em] text-[var(--ink)]">{application.name}</h2>
        <p className="mt-3 max-w-[31rem] text-sm leading-6 text-[var(--muted)]">{application.description}</p>
      </div>
      <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-[var(--card-rule)] pt-4">
        <span className="text-sm font-bold text-[var(--ink)]">Open workspace</span>
        <span className="app-card-launch grid size-11 shrink-0 place-items-center rounded-full sm:size-10" aria-hidden="true">
          <ArrowUpRight className="size-4" strokeWidth={2.4} />
        </span>
      </div>
    </a>
  );
}
