import { ApplicationCard } from "@/components/application-card";
import { HubHeader } from "@/components/hub-header";
import { applications } from "@/lib/applications";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <HubHeader />
        <section className="pb-10 pt-14 sm:pb-14 sm:pt-20" aria-labelledby="page-title">
          <p className="text-sm font-bold uppercase tracking-[0.13em] text-[var(--orange)]">Workplace applications</p>
          <h1 id="page-title" className="font-heading mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.045em] text-[var(--navy)] sm:text-5xl lg:text-6xl">App Hub</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">One place to open the Nubiaville tools you use every day.</p>
        </section>
        <section aria-labelledby="applications">
          <div className="flex items-end justify-between gap-4">
            <div><h2 id="applications" className="font-heading text-2xl font-bold text-[var(--ink)]">Applications</h2><p className="mt-1 text-sm text-[var(--muted)]">Select an application to continue without leaving App Hub.</p></div>
            <p className="hidden text-sm font-semibold text-[var(--muted)] sm:block">{applications.length} applications</p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">{applications.map((application) => <ApplicationCard key={application.url} application={application} />)}</div>
        </section>
      </div>
    </main>
  );
}
