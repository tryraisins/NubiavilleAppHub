"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { CheckCircle2, CircleAlert, LayoutGrid, Pencil, Plus, Save, ShieldCheck, Trash2, UsersRound, X } from "lucide-react";

import { ApplicationIcon } from "@/components/application-icon";
import { applicationIconOptions, type ApplicationDraft, type HubApplication } from "@/lib/applications";
import type { AdminDraft, HubAdmin } from "@/lib/sharepoint";

type Section = "applications" | "administrators";

const emptyApplication: ApplicationDraft = {
  name: "",
  description: "",
  url: "",
  iconKey: "grid",
  status: "available",
  isActive: true,
  sortOrder: 100,
};

const emptyAdmin: AdminDraft = { email: "", displayName: "", isActive: true, notes: "" };

function Notice({ children, kind = "info" }: { children: ReactNode; kind?: "info" | "error" | "success" }) {
  const classes = kind === "error"
    ? "border-[#f4c9c5] bg-[#fff6f5] text-[#9d2e24]"
    : kind === "success"
      ? "border-[#bfe4d0] bg-[#f3fbf6] text-[#17683b]"
      : "border-[#cbd8ed] bg-[#f5f8fe] text-[#273d70]";
  return <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm leading-6 ${classes}`}><CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{children}</div>;
}

function TextInput({ label, value, onChange, type = "text", placeholder, required, disabled = false }: {
  label: string; value: string | number; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean; disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-[var(--ink)]">{label}{required ? <span className="text-[var(--orange)]"> *</span> : null}</span>
      <input type={type} value={value} required={required} disabled={disabled} onChange={(event) => onChange(event.target.value)} placeholder={placeholder}
        className="min-h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-[var(--ink)] placeholder:text-[#97a4b8] disabled:cursor-not-allowed disabled:bg-[#f2f5f9]" />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, required, disabled = false }: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-[var(--ink)]">{label}{required ? <span className="text-[var(--orange)]"> *</span> : null}</span>
      <textarea value={value} required={required} disabled={disabled} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3}
        className="w-full resize-y rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm leading-6 text-[var(--ink)] placeholder:text-[#97a4b8] disabled:cursor-not-allowed disabled:bg-[#f2f5f9]" />
    </label>
  );
}

export function AdminConsole({ initialApplications, initialAdmins, applicationsConfigured, adminsConfigured, currentEmail }: {
  initialApplications: HubApplication[];
  initialAdmins: HubAdmin[];
  applicationsConfigured: boolean;
  adminsConfigured: boolean;
  currentEmail: string;
}) {
  const [section, setSection] = useState<Section>("applications");
  const [applications, setApplications] = useState(initialApplications);
  const [admins, setAdmins] = useState(initialAdmins);
  const [applicationForm, setApplicationForm] = useState<ApplicationDraft>(emptyApplication);
  const [adminForm, setAdminForm] = useState<AdminDraft>(emptyAdmin);
  const [editingApplication, setEditingApplication] = useState<string | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const configured = section === "applications" ? applicationsConfigured : adminsConfigured;
  const updateApplication = <Key extends keyof ApplicationDraft>(key: Key, value: ApplicationDraft[Key]) => setApplicationForm((form) => ({ ...form, [key]: value }));
  const updateAdmin = <Key extends keyof AdminDraft>(key: Key, value: AdminDraft[Key]) => setAdminForm((form) => ({ ...form, [key]: value }));

  async function api<T>(url: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) {
    const response = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
    const payload = await response.json().catch(() => ({})) as T & { error?: string };
    if (!response.ok) throw new Error(payload.error || "The change could not be saved.");
    return payload;
  }

  function resetApplicationForm() { setApplicationForm(emptyApplication); setEditingApplication(null); }
  function resetAdminForm() { setAdminForm(emptyAdmin); setEditingAdmin(null); }

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(null);
    try {
      if (editingApplication) {
        await api(`/api/admin/applications/${editingApplication}`, "PATCH", applicationForm);
        setApplications((items) => items.map((item) => item.id === editingApplication ? { ...applicationForm, id: item.id } : item));
        setMessage({ kind: "success", text: "Application updated." });
      } else {
        const created = await api<HubApplication>("/api/admin/applications", "POST", applicationForm);
        setApplications((items) => [...items, created].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)));
        setMessage({ kind: "success", text: "Application added to the hub." });
      }
      resetApplicationForm();
    } catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "The application could not be saved." }); }
    finally { setBusy(false); }
  }

  async function submitAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(null);
    try {
      if (editingAdmin) {
        await api(`/api/admin/users/${editingAdmin}`, "PATCH", adminForm);
        setAdmins((items) => items.map((item) => item.id === editingAdmin ? { ...adminForm, id: item.id } : item));
        setMessage({ kind: "success", text: "Administrator updated." });
      } else {
        const created = await api<HubAdmin>("/api/admin/users", "POST", adminForm);
        setAdmins((items) => [...items, created].sort((a, b) => a.email.localeCompare(b.email)));
        setMessage({ kind: "success", text: "Administrator added." });
      }
      resetAdminForm();
    } catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "The administrator could not be saved." }); }
    finally { setBusy(false); }
  }

  async function removeApplication(application: HubApplication) {
    if (!window.confirm(`Remove ${application.name} from App Hub? This does not delete the application itself.`)) return;
    setBusy(true); setMessage(null);
    try {
      await api(`/api/admin/applications/${application.id}`, "DELETE");
      setApplications((items) => items.filter((item) => item.id !== application.id));
      if (editingApplication === application.id) resetApplicationForm();
      setMessage({ kind: "success", text: "Application removed from the hub." });
    } catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "The application could not be removed." }); }
    finally { setBusy(false); }
  }

  async function removeAdmin(admin: HubAdmin) {
    if (!window.confirm(`Remove ${admin.email} as an administrator?`)) return;
    setBusy(true); setMessage(null);
    try {
      await api(`/api/admin/users/${admin.id}`, "DELETE");
      setAdmins((items) => items.filter((item) => item.id !== admin.id));
      if (editingAdmin === admin.id) resetAdminForm();
      setMessage({ kind: "success", text: "Administrator removed." });
    } catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "The administrator could not be removed." }); }
    finally { setBusy(false); }
  }

  return (
    <section aria-label="Administration controls" className="pb-10 sm:pb-14">
      <div className="inline-flex rounded-xl border border-[var(--border)] bg-white p-1 shadow-sm" role="tablist" aria-label="Management area">
        <button type="button" role="tab" aria-selected={section === "applications"} onClick={() => { setSection("applications"); setMessage(null); }} className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-bold ${section === "applications" ? "bg-[var(--navy)] text-white" : "text-[var(--muted)] hover:bg-[#f1f4f9]"}`}><LayoutGrid className="size-4" aria-hidden="true" />Applications</button>
        <button type="button" role="tab" aria-selected={section === "administrators"} onClick={() => { setSection("administrators"); setMessage(null); }} className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-bold ${section === "administrators" ? "bg-[var(--navy)] text-white" : "text-[var(--muted)] hover:bg-[#f1f4f9]"}`}><UsersRound className="size-4" aria-hidden="true" />Admins</button>
      </div>

      {!configured ? <div className="mt-5"><Notice><span><strong>SharePoint setup is required before changes can be saved.</strong> Add the list environment variables, then redeploy. The page stays read-only until its list is connected.</span></Notice></div> : null}
      {message ? <div className="mt-5"><Notice kind={message.kind}><span>{message.text}</span></Notice></div> : null}

      {section === "applications" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="rounded-2xl border border-[var(--border)] bg-white shadow-[0_12px_32px_rgba(21,35,61,0.04)]">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-5 sm:px-6">
              <div><h2 className="font-heading text-xl font-bold text-[var(--ink)]">Applications</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">Available applications open in a new tab. Coming-soon entries stay hidden until you add one.</p></div>
              <span className="rounded-full bg-[#edf2fb] px-2.5 py-1 text-xs font-bold text-[var(--navy)]">{applications.length}</span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {applications.map((application) => {
                return <div key={application.id} className="flex gap-3 px-5 py-4 sm:px-6"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#fff1e9] text-[var(--orange)]"><ApplicationIcon iconKey={application.iconKey} className="size-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[var(--ink)]">{application.name}</h3><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${application.status === "available" ? "bg-[#e9f8ef] text-[#17683b]" : "bg-[#fff1e9] text-[#a54509]"}`}>{application.status === "available" ? "Available" : "Coming soon"}</span>{!application.isActive ? <span className="rounded-full bg-[#f1f3f6] px-2 py-0.5 text-[11px] font-bold text-[var(--muted)]">Hidden</span> : null}</div><p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{application.description}</p><p className="mt-1.5 truncate text-xs font-medium text-[#6d7b91]">{application.url}</p></div><div className="flex shrink-0 gap-1"><button type="button" disabled={!applicationsConfigured || busy} onClick={() => { setEditingApplication(application.id); setApplicationForm({ name: application.name, description: application.description, url: application.url, iconKey: application.iconKey, status: application.status, isActive: application.isActive, sortOrder: application.sortOrder }); setMessage(null); }} className="grid size-9 cursor-pointer place-items-center rounded-lg text-[var(--navy)] hover:bg-[#edf2fb] disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Edit ${application.name}`} title="Edit"><Pencil className="size-4" /></button><button type="button" disabled={!applicationsConfigured || busy} onClick={() => removeApplication(application)} className="grid size-9 cursor-pointer place-items-center rounded-lg text-[#aa3a31] hover:bg-[#fff0ef] disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Remove ${application.name}`} title="Remove"><Trash2 className="size-4" /></button></div></div>;
              })}
              {!applications.length ? <div className="px-6 py-10 text-center text-sm text-[var(--muted)]">No applications have been added yet.</div> : null}
            </div>
          </div>
          <form onSubmit={submitApplication} className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_12px_32px_rgba(21,35,61,0.04)] sm:p-6">
            <div className="flex items-start justify-between gap-3"><div><h2 className="font-heading text-xl font-bold text-[var(--ink)]">{editingApplication ? "Edit application" : "Add application"}</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">All fields marked with * are required.</p></div>{editingApplication ? <button type="button" onClick={resetApplicationForm} className="grid size-9 cursor-pointer place-items-center rounded-lg text-[var(--muted)] hover:bg-[#f1f4f9]" aria-label="Cancel edit"><X className="size-4" /></button> : <Plus className="mt-1 size-5 text-[var(--orange)]" aria-hidden="true" />}</div>
            <div className="mt-5 space-y-4">
              <TextInput label="Application name" value={applicationForm.name} onChange={(value) => updateApplication("name", value)} placeholder="e.g. HR Portal" required disabled={!applicationsConfigured || busy} />
              <TextArea label="Description" value={applicationForm.description} onChange={(value) => updateApplication("description", value)} placeholder="Explain what people can do in this application." required disabled={!applicationsConfigured || busy} />
              <TextInput label="Launch URL" value={applicationForm.url} onChange={(value) => updateApplication("url", value)} placeholder="https://… or /app-path" required disabled={!applicationsConfigured || busy} />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><label className="block"><span className="mb-1.5 block text-sm font-bold text-[var(--ink)]">Icon</span><select value={applicationForm.iconKey} disabled={!applicationsConfigured || busy} onChange={(event) => updateApplication("iconKey", event.target.value as ApplicationDraft["iconKey"])} className="min-h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm disabled:cursor-not-allowed disabled:bg-[#f2f5f9]">{applicationIconOptions.map((icon) => <option key={icon} value={icon}>{icon[0].toUpperCase() + icon.slice(1)}</option>)}</select></label><TextInput label="Display order" value={applicationForm.sortOrder} onChange={(value) => updateApplication("sortOrder", Number(value))} type="number" placeholder="100" required disabled={!applicationsConfigured || busy} /></div>
              <label className="block"><span className="mb-1.5 block text-sm font-bold text-[var(--ink)]">Visibility</span><select value={applicationForm.status} disabled={!applicationsConfigured || busy} onChange={(event) => updateApplication("status", event.target.value as ApplicationDraft["status"])} className="min-h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm disabled:cursor-not-allowed disabled:bg-[#f2f5f9]"><option value="available">Available now</option><option value="comingSoon">Coming soon</option></select></label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border)] px-3 py-3 text-sm text-[var(--ink)]"><input type="checkbox" checked={applicationForm.isActive} disabled={!applicationsConfigured || busy} onChange={(event) => updateApplication("isActive", event.target.checked)} className="mt-1 size-4 accent-[var(--navy)]" /><span><strong className="block">Show on App Hub</strong><span className="mt-0.5 block leading-5 text-[var(--muted)]">Turn this off to keep the entry saved but hidden.</span></span></label>
              <button type="submit" disabled={!applicationsConfigured || busy} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--navy)] px-4 text-sm font-bold text-white hover:bg-[#15128d] disabled:cursor-not-allowed disabled:opacity-45"><Save className="size-4" aria-hidden="true" />{busy ? "Saving…" : editingApplication ? "Save changes" : "Add application"}</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="rounded-2xl border border-[var(--border)] bg-white shadow-[0_12px_32px_rgba(21,35,61,0.04)]"><div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-5 sm:px-6"><div><h2 className="font-heading text-xl font-bold text-[var(--ink)]">Administrators</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">Only active administrators can add applications and manage access.</p></div><span className="rounded-full bg-[#edf2fb] px-2.5 py-1 text-xs font-bold text-[var(--navy)]">{admins.filter((admin) => admin.isActive).length} active</span></div><div className="divide-y divide-[var(--border)]">{admins.map((admin) => <div key={admin.id} className="flex gap-3 px-5 py-4 sm:px-6"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#edf2fb] text-[var(--navy)]"><ShieldCheck className="size-5" aria-hidden="true" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-bold text-[var(--ink)]">{admin.displayName || admin.email}</h3>{admin.email === currentEmail ? <span className="rounded-full bg-[#fff1e9] px-2 py-0.5 text-[11px] font-bold text-[#a54509]">You</span> : null}{!admin.isActive ? <span className="rounded-full bg-[#f1f3f6] px-2 py-0.5 text-[11px] font-bold text-[var(--muted)]">Inactive</span> : null}</div><p className="mt-1 truncate text-sm text-[var(--muted)]">{admin.email}</p>{admin.notes ? <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#6d7b91]">{admin.notes}</p> : null}</div><div className="flex shrink-0 gap-1"><button type="button" disabled={!adminsConfigured || busy} onClick={() => { setEditingAdmin(admin.id); setAdminForm({ email: admin.email, displayName: admin.displayName, isActive: admin.isActive, notes: admin.notes }); setMessage(null); }} className="grid size-9 cursor-pointer place-items-center rounded-lg text-[var(--navy)] hover:bg-[#edf2fb] disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Edit ${admin.email}`} title="Edit"><Pencil className="size-4" /></button><button type="button" disabled={!adminsConfigured || busy || admin.email === currentEmail} onClick={() => removeAdmin(admin)} className="grid size-9 cursor-pointer place-items-center rounded-lg text-[#aa3a31] hover:bg-[#fff0ef] disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Remove ${admin.email}`} title={admin.email === currentEmail ? "You cannot remove yourself" : "Remove"}><Trash2 className="size-4" /></button></div></div>)}{!admins.length ? <div className="px-6 py-10 text-center text-sm text-[var(--muted)]">No administrators are stored in SharePoint yet.</div> : null}</div></div>
          <form onSubmit={submitAdmin} className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_12px_32px_rgba(21,35,61,0.04)] sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 className="font-heading text-xl font-bold text-[var(--ink)]">{editingAdmin ? "Edit administrator" : "Add administrator"}</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">Use their Microsoft Entra work email.</p></div>{editingAdmin ? <button type="button" onClick={resetAdminForm} className="grid size-9 cursor-pointer place-items-center rounded-lg text-[var(--muted)] hover:bg-[#f1f4f9]" aria-label="Cancel edit"><X className="size-4" /></button> : <UsersRound className="mt-1 size-5 text-[var(--orange)]" aria-hidden="true" />}</div><div className="mt-5 space-y-4"><TextInput label="Work email" value={adminForm.email} onChange={(value) => updateAdmin("email", value)} type="email" placeholder="name@nubiaville.onmicrosoft.com" required disabled={!adminsConfigured || busy} /><TextInput label="Display name" value={adminForm.displayName} onChange={(value) => updateAdmin("displayName", value)} placeholder="Optional" disabled={!adminsConfigured || busy} /><TextArea label="Notes" value={adminForm.notes} onChange={(value) => updateAdmin("notes", value)} placeholder="Optional context for other administrators" disabled={!adminsConfigured || busy} /><label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border)] px-3 py-3 text-sm text-[var(--ink)]"><input type="checkbox" checked={adminForm.isActive} disabled={!adminsConfigured || busy} onChange={(event) => updateAdmin("isActive", event.target.checked)} className="mt-1 size-4 accent-[var(--navy)]" /><span><strong className="block">Administrator is active</strong><span className="mt-0.5 block leading-5 text-[var(--muted)]">Inactive people remain listed but cannot access this workspace.</span></span></label><button type="submit" disabled={!adminsConfigured || busy} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--navy)] px-4 text-sm font-bold text-white hover:bg-[#15128d] disabled:cursor-not-allowed disabled:opacity-45"><Save className="size-4" aria-hidden="true" />{busy ? "Saving…" : editingAdmin ? "Save changes" : "Add administrator"}</button></div></form>
        </div>
      )}
      <p className="mt-5 flex items-center gap-2 text-xs leading-5 text-[var(--muted)]"><CheckCircle2 className="size-4 shrink-0 text-[#17683b]" aria-hidden="true" />Launch URLs are opened in a separate browser tab from the App Hub.</p>
    </section>
  );
}
