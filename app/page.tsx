import { redirect } from "next/navigation";

import { ApplicationCard } from "@/components/application-card";
import { HubHeader } from "@/components/hub-header";
import { getAuthContext, isAdmin } from "@/lib/authorization";
import { getApplications } from "@/lib/sharepoint";

export default async function Home() {
  const context = await getAuthContext();
  if (!context) redirect("/login");
  const [applications, admin] = await Promise.all([getApplications(context.accessToken), isAdmin(context)]);
  const activeApplications = applications.filter((application) => application.isActive && application.status === "available");
  const upcomingApplications = applications.filter((application) => application.isActive && application.status === "comingSoon");

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <HubHeader admin={admin} name={context.name} />

        <section className="pb-10 pt-14 sm:pb-14 sm:pt-20" aria-labelledby="page-title">
          <p className="text-sm font-bold uppercase tracking-[0.13em] text-[var(--orange)]">
            Workplace applications
          </p>
          <h1
            id="page-title"
            className="font-heading mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.045em] text-[var(--navy)] sm:text-5xl lg:text-6xl"
          >
            App Hub
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            One place to securely open the Nubiaville tools you use every day.
          </p>
        </section>

        <section aria-labelledby="available-applications">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="available-applications" className="font-heading text-2xl font-bold text-[var(--ink)]">
                Applications
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Select an application to open it in a new tab.
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
          {!activeApplications.length ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-white/70 px-6 py-10 text-center text-sm leading-6 text-[var(--muted)]">
              No applications are available yet. An administrator can add the first one from Manage.
            </div>
          ) : null}
        </section>

        {upcomingApplications.length ? (
          <section className="border-t border-[var(--border)] pb-8 pt-12 sm:pb-12" aria-labelledby="upcoming-applications">
            <h2 id="upcoming-applications" className="font-heading text-2xl font-bold text-[var(--ink)]">Coming soon</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Applications that are being prepared for launch.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {upcomingApplications.map((application) => <ApplicationCard key={application.id} application={application} />)}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
