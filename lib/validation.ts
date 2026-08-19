import { applicationIconOptions, type ApplicationDraft, type ApplicationStatus } from "@/lib/applications";
import { normaliseEmail } from "@/lib/admins";
import type { AdminDraft } from "@/lib/sharepoint";

function text(value: unknown, label: string, maxLength: number, required = true) {
  if (typeof value !== "string") throw new Error(`${label} must be text.`);
  const normalized = value.trim();
  if (required && !normalized) throw new Error(`${label} is required.`);
  if (normalized.length > maxLength) throw new Error(`${label} must be ${maxLength} characters or fewer.`);
  return normalized;
}

export function applicationDraftFrom(input: unknown): ApplicationDraft {
  if (!input || typeof input !== "object") throw new Error("Application details are required.");
  const record = input as Record<string, unknown>;
  const url = text(record.url, "Launch URL", 2048);
  if (!url.startsWith("/") || url.startsWith("//")) {
    throw new Error("Launch URL must be a same-site path such as /leave.");
  }

  const iconKey = String(record.iconKey ?? "");
  if (!applicationIconOptions.includes(iconKey as (typeof applicationIconOptions)[number])) {
    throw new Error("Choose a supported icon.");
  }

  const status = record.status === "comingSoon" ? "comingSoon" : record.status === "available" ? "available" : null;
  if (!status) throw new Error("Choose an availability status.");

  const sortOrder = Number(record.sortOrder);
  if (!Number.isFinite(sortOrder) || sortOrder < 0 || sortOrder > 100_000) {
    throw new Error("Display order must be a number from 0 to 100000.");
  }

  return {
    name: text(record.name, "Application name", 120),
    description: text(record.description, "Description", 600),
    url,
    iconKey: iconKey as ApplicationDraft["iconKey"],
    status: status as ApplicationStatus,
    isActive: Boolean(record.isActive),
    sortOrder,
  };
}

export function adminDraftFrom(input: unknown): AdminDraft {
  if (!input || typeof input !== "object") throw new Error("Administrator details are required.");
  const record = input as Record<string, unknown>;
  const email = normaliseEmail(text(record.email, "Email", 320));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  return {
    email,
    displayName: text(record.displayName, "Display name", 120, false),
    isActive: Boolean(record.isActive),
    notes: text(record.notes, "Notes", 500, false),
  };
}

export function numericId(value: string) {
  if (!/^\d+$/.test(value)) throw new Error("Invalid SharePoint item ID.");
  return value;
}
