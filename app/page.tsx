import { ApplicationCard } from "@/components/application-card";
import { HubHeader } from "@/components/hub-header";
import { applications } from "@/lib/applications";

export default function Home() {
  return (
    <main className="app-shell min-h-screen px-4 py-4 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <HubHeader />
        <section className="hub-intro pb-11 pt-14 sm:pb-14 sm:pt-20" aria-labelledby="page-title">
          <div>
            <p className="hub-kicker text-xs font-bold uppercase tracking-[0.15em]">Nubiaville workspace</p>
            <h1 id="page-title" className="font-heading mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.055em] text-[var(--navy)] sm:text-5xl lg:text-6xl">Your tools, ready when work is.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">A focused starting point for the Nubiaville applications that keep your teams moving.</p>
          </div>
        </section>
        <section aria-labelledby="applications">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="applications" className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--ink)]">Choose a workspace</h2>
              <p className="mt-1.5 text-sm text-[var(--muted)]">Every tool opens without leaving your App Hub.</p>
            </div>
            <p className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)] sm:block">{applications.length} applications</p>
          </div>
          <div className="mt-7 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">{applications.map((application, index) => <ApplicationCard key={application.url} application={application} index={index} />)}</div>
        </section>
      </div>
    </main>
  );
}
