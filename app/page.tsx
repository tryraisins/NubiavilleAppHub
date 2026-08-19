import Image from "next/image";

import { ApplicationCard } from "@/components/application-card";
import { applications } from "@/lib/applications";

export default function Home() {
  const activeApplications = applications.filter((application) => application.href);
  const upcomingApplications = applications.filter((application) => !application.href);

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/90 px-5 py-4 shadow-[0_12px_32px_rgba(21,35,61,0.05)] backdrop-blur-sm sm:px-6">
          <Image
            src="/nubiaville-logo.svg"
            alt="Nubiaville"
            width={1492}
            height={265}
            priority
            className="h-auto w-[9.75rem] sm:w-[11.25rem]"
          />
          <span className="h-6 w-px bg-[var(--border)]" aria-hidden="true" />
          <span className="font-heading text-sm font-bold tracking-[0.01em] text-[var(--navy)]">
            App Hub
          </span>
        </header>

        <section className="pb-10 pt-14 sm:pb-14 sm:pt-20" aria-labelledby="page-title">
          <p className="text-sm font-bold uppercase tracking-[0.13em] text-[var(--orange)]">
            Your Nubiaville workspace
          </p>
          <h1
            id="page-title"
            className="font-heading mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.045em] text-[var(--navy)] sm:text-5xl lg:text-6xl"
          >
            Nubiaville App Hub
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Your central access point for Nubiaville tools. Choose an application to continue to
            the service you need.
          </p>
        </section>

        <section aria-labelledby="available-applications">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="available-applications" className="font-heading text-2xl font-bold text-[var(--ink)]">
                Available applications
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Select a tool to open it securely in this portal.
              </p>
            </div>
            <p className="hidden text-sm font-semibold text-[var(--muted)] sm:block">
              {activeApplications.length} applications
            </p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {activeApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--border)] pb-8 pt-12 sm:pb-12" aria-labelledby="upcoming-applications">
          <h2 id="upcoming-applications" className="font-heading text-2xl font-bold text-[var(--ink)]">
            On the way
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            More Nubiaville workplace tools will appear here as they become available.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {upcomingApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
