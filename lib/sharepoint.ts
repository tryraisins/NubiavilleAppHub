import {
  applicationIconOptions,
  fallbackApplications,
  type ApplicationDraft,
  type ApplicationIconKey,
  type ApplicationStatus,
  type HubApplication,
} from "@/lib/applications";
import { normaliseEmail } from "@/lib/admins";

export type HubAdmin = {
  displayName: string;
  email: string;
  id: string;
  isActive: boolean;
  notes: string;
};

export type AdminDraft = Omit<HubAdmin, "id">;

type SharePointItem = {
  Id: number;
  Title?: unknown;
  [key: string]: unknown;
};

const baseUrl = (process.env.SHAREPOINT_BASE_URL ?? "").trim().replace(/\/+$/, "");
const applicationsList = (process.env.SHAREPOINT_APPLICATIONS_LIST ?? "").trim();
const adminsList = (process.env.SHAREPOINT_ADMINS_LIST ?? "").trim();

export const hasApplicationsStore = Boolean(baseUrl && applicationsList);
export const hasAdminsStore = Boolean(baseUrl && adminsList);

export class SharePointConfigurationError extends Error {}

function listUrl(listTitle: string, suffix = "") {
  if (!baseUrl) throw new SharePointConfigurationError("SHAREPOINT_BASE_URL is not configured.");
  return `${baseUrl}/_api/web/lists/GetByTitle('${listTitle.replace(/'/g, "''")}')${suffix}`;
}

async function request<T>(accessToken: string, url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json;odata=nometadata",
        "Content-Type": "application/json;odata=nometadata",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new Error("SharePoint could not be reached. Check the site URL and Microsoft sign-in permissions.");
  }

  if (!response.ok) {
    const details = (await response.text().catch(() => "")).replace(/<[^>]+>/g, " ").trim();
    throw new Error(`SharePoint request failed (${response.status}).${details ? ` ${details.slice(0, 220)}` : ""}`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text.trim() ? JSON.parse(text) : undefined) as T;
}

function asBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return ["true", "1", "yes"].includes(value.trim().toLowerCase());
  return fallback;
}

function asText(value: unknown) {
  return String(value ?? "").trim();
}

function mapStatus(value: unknown): ApplicationStatus {
  return asText(value).toLowerCase() === "coming soon" ? "comingSoon" : "available";
}

function mapApplication(item: SharePointItem): HubApplication {
  const iconKey = asText(item.IconKey).toLowerCase() as ApplicationIconKey;
  return {
    id: String(item.Id),
    name: asText(item.Title),
    description: asText(item.Description),
    url: asText(item.ApplicationUrl),
    iconKey: applicationIconOptions.includes(iconKey) ? iconKey : "grid",
    status: mapStatus(item.Status),
    isActive: asBoolean(item.IsActive, true),
    sortOrder: Number(item.SortOrder ?? 0),
  };
}

function mapAdmin(item: SharePointItem): HubAdmin {
  return {
    id: String(item.Id),
    email: normaliseEmail(asText(item.Title)),
    displayName: asText(item.DisplayName),
    isActive: asBoolean(item.IsActive, true),
    notes: asText(item.Notes),
  };
}

function cleanApplicationDraft(draft: ApplicationDraft) {
  return {
    Title: draft.name.trim(),
    Description: draft.description.trim(),
    ApplicationUrl: draft.url.trim(),
    IconKey: draft.iconKey,
    Status: draft.status === "comingSoon" ? "Coming soon" : "Available",
    IsActive: Boolean(draft.isActive),
    SortOrder: Number(draft.sortOrder),
  };
}

function cleanAdminDraft(draft: AdminDraft) {
  return {
    Title: normaliseEmail(draft.email),
    DisplayName: draft.displayName.trim(),
    IsActive: Boolean(draft.isActive),
    Notes: draft.notes.trim(),
  };
}

export async function getApplications(accessToken: string): Promise<HubApplication[]> {
  if (!hasApplicationsStore) return fallbackApplications;
  const payload = await request<{ value?: SharePointItem[] }>(
    accessToken,
    listUrl(applicationsList, "/items?$select=Id,Title,Description,ApplicationUrl,IconKey,Status,IsActive,SortOrder&$top=5000"),
  );
  return (payload.value ?? []).map(mapApplication).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export async function createApplication(accessToken: string, draft: ApplicationDraft) {
  if (!hasApplicationsStore) throw new SharePointConfigurationError("Configure SHAREPOINT_APPLICATIONS_LIST before adding applications.");
  const item = await request<SharePointItem>(accessToken, listUrl(applicationsList, "/items"), {
    method: "POST",
    body: JSON.stringify(cleanApplicationDraft(draft)),
  });
  return mapApplication(item);
}

export async function updateApplication(accessToken: string, id: string, draft: ApplicationDraft) {
  if (!hasApplicationsStore) throw new SharePointConfigurationError("Configure SHAREPOINT_APPLICATIONS_LIST before changing applications.");
  await request<void>(accessToken, listUrl(applicationsList, `/items(${Number(id)})`), {
    method: "POST",
    headers: { "IF-MATCH": "*", "X-HTTP-Method": "MERGE" },
    body: JSON.stringify(cleanApplicationDraft(draft)),
  });
}

export async function deleteApplication(accessToken: string, id: string) {
  if (!hasApplicationsStore) throw new SharePointConfigurationError("Configure SHAREPOINT_APPLICATIONS_LIST before removing applications.");
  await request<void>(accessToken, listUrl(applicationsList, `/items(${Number(id)})`), {
    method: "POST",
    headers: { "IF-MATCH": "*", "X-HTTP-Method": "DELETE" },
  });
}

export async function getAdmins(accessToken: string): Promise<HubAdmin[]> {
  if (!hasAdminsStore) return [];
  const payload = await request<{ value?: SharePointItem[] }>(
    accessToken,
    listUrl(adminsList, "/items?$select=Id,Title,DisplayName,IsActive,Notes&$top=5000"),
  );
  return (payload.value ?? []).map(mapAdmin).filter((admin) => Boolean(admin.email)).sort((a, b) => a.email.localeCompare(b.email));
}

export async function createAdmin(accessToken: string, draft: AdminDraft) {
  if (!hasAdminsStore) throw new SharePointConfigurationError("Configure SHAREPOINT_ADMINS_LIST before adding administrators.");
  const item = await request<SharePointItem>(accessToken, listUrl(adminsList, "/items"), {
    method: "POST",
    body: JSON.stringify(cleanAdminDraft(draft)),
  });
  return mapAdmin(item);
}

export async function updateAdmin(accessToken: string, id: string, draft: AdminDraft) {
  if (!hasAdminsStore) throw new SharePointConfigurationError("Configure SHAREPOINT_ADMINS_LIST before changing administrators.");
  await request<void>(accessToken, listUrl(adminsList, `/items(${Number(id)})`), {
    method: "POST",
    headers: { "IF-MATCH": "*", "X-HTTP-Method": "MERGE" },
    body: JSON.stringify(cleanAdminDraft(draft)),
  });
}

export async function deleteAdmin(accessToken: string, id: string) {
  if (!hasAdminsStore) throw new SharePointConfigurationError("Configure SHAREPOINT_ADMINS_LIST before removing administrators.");
  await request<void>(accessToken, listUrl(adminsList, `/items(${Number(id)})`), {
    method: "POST",
    headers: { "IF-MATCH": "*", "X-HTTP-Method": "DELETE" },
  });
}
