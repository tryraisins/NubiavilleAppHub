import { ArrowUpRight } from "lucide-react";

import { ApplicationIcon } from "@/components/application-icon";
import type { Application } from "@/lib/applications";

export function ApplicationCard({ application }: { application: Application }) {
  return (
    <a
      href={application.url}
      className="group flex min-h-[17rem] cursor-pointer flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_14px_32px_rgba(21,35,61,0.06)] transition hover:-translate-y-0.5 hover:border-[#aebbd0] hover:shadow-[0_18px_36px_rgba(9,8,111,0.1)] focus-visible:outline-none sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-[#c7d4e7] bg-[#eef3fb] text-[var(--navy)]" aria-hidden="true">
          <ApplicationIcon iconKey={application.iconKey} className="size-6" />
        </span>
      </div>
      <div className="mt-7">
        <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-[var(--ink)]">{application.name}</h2>
        <p className="mt-3 max-w-[33rem] text-sm leading-6 text-[var(--muted)]">{application.description}</p>
      </div>
      <div className="mt-auto pt-7">
        <span className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--orange)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors group-hover:bg-[#db5105]">
          Open application
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
