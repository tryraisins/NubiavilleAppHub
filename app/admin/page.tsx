import { redirect } from "next/navigation";

import { AdminConsole } from "@/components/admin/admin-console";
import { HubHeader } from "@/components/hub-header";
import { getAuthContext, isAdmin } from "@/lib/authorization";
import { getApplications, getAdmins, hasAdminsStore, hasApplicationsStore } from "@/lib/sharepoint";

export default async function AdminPage() {
  const context = await getAuthContext();
  if (!context) redirect("/login?callbackUrl=/admin");

  const admin = await isAdmin(context);
  if (!admin) redirect("/");

  const [applications, admins] = await Promise.all([
    getApplications(context.accessToken),
    getAdmins(context.accessToken),
  ]);

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <HubHeader admin name={context.name} />
        <section className="pb-8 pt-12 sm:pb-10 sm:pt-16" aria-labelledby="admin-title">
          <p className="text-sm font-bold uppercase tracking-[0.13em] text-[var(--orange)]">Administrator workspace</p>
          <h1 id="admin-title" className="font-heading mt-4 text-4xl font-extrabold tracking-[-0.045em] text-[var(--navy)] sm:text-5xl">
            Manage App Hub
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
            Add applications, choose when they become visible, and control who can manage this hub.
          </p>
        </section>
        <AdminConsole
          initialApplications={applications}
          initialAdmins={admins}
          applicationsConfigured={hasApplicationsStore}
          adminsConfigured={hasAdminsStore}
          currentEmail={context.email}
        />
      </div>
    </main>
  );
}
