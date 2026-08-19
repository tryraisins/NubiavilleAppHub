import { ArrowUpRight, LockKeyhole } from "lucide-react";

import { ApplicationIcon } from "@/components/application-icon";
import { statusLabel, type HubApplication } from "@/lib/applications";

const statusStyles = {
  available: "border-emerald-200 bg-emerald-50 text-emerald-800",
  comingSoon: "border-slate-200 bg-slate-100 text-slate-600",
} as const;

export function ApplicationCard({ application }: { application: HubApplication }) {
  const isAvailable = application.status === "available";

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-xl border ${
            isAvailable
              ? "border-[#c7d4e7] bg-[#eef3fb] text-[var(--navy)]"
              : "border-[#dce3ed] bg-white text-[#718097]"
          }`}
          aria-hidden="true"
        >
          <ApplicationIcon iconKey={application.iconKey} className="size-6" />
        </span>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold leading-none ${statusStyles[application.status]}`}>
          {statusLabel(application.status)}
        </span>
      </div>

      <div className="mt-7">
        <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-[var(--ink)]">{application.name}</h2>
        <p className="mt-3 max-w-[33rem] text-sm leading-6 text-[var(--muted)]">{application.description}</p>
      </div>

      <div className="mt-auto pt-7">
        {isAvailable ? (
          <span className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--orange)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors group-hover:bg-[#db5105]">
            Open in a new tab
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        ) : (
          <span className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d9e1eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#6f7d92]">
            <LockKeyhole className="size-4" aria-hidden="true" />
            Not available yet
          </span>
        )}
      </div>
    </>
  );

  if (isAvailable) {
    return (
      <a
        href={application.url}
        target="_blank"
        rel="noreferrer"
        className="group flex min-h-[17rem] cursor-pointer flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_14px_32px_rgba(21,35,61,0.06)] transition hover:-translate-y-0.5 hover:border-[#aebbd0] hover:shadow-[0_18px_36px_rgba(9,8,111,0.1)] focus-visible:outline-none sm:p-7"
      >
        {content}
      </a>
    );
  }

  return (
    <article className="flex min-h-[17rem] flex-col rounded-2xl border border-[#e1e7ef] bg-[#fafbfd] p-6 shadow-[0_14px_32px_rgba(21,35,61,0.04)] sm:p-7">
      {content}
    </article>
  );
}
