import type { LucideIcon } from "lucide-react";
import { CalendarCheck2, ClipboardList, LayoutGrid, ShoppingBag, Wrench } from "lucide-react";

export const applicationIconMap = {
  calendar: CalendarCheck2,
  clipboard: ClipboardList,
  grid: LayoutGrid,
  shopping: ShoppingBag,
  tools: Wrench,
} as const satisfies Record<string, LucideIcon>;

export type ApplicationIconKey = keyof typeof applicationIconMap;
export type ApplicationStatus = "available" | "comingSoon";

export type HubApplication = {
  description: string;
  iconKey: ApplicationIconKey;
  id: string;
  isActive: boolean;
  name: string;
  sortOrder: number;
  status: ApplicationStatus;
  url: string;
};

export type ApplicationDraft = Omit<HubApplication, "id">;

export const applicationIconOptions = Object.keys(applicationIconMap) as ApplicationIconKey[];

export const fallbackApplications: HubApplication[] = [
  {
    id: "leave",
    name: "Leave Management",
    description: "Manage leave requests, approvals, balances, history, and related employee leave activities.",
    url: "/leave",
    iconKey: "calendar",
    status: "available",
    isActive: true,
    sortOrder: 10,
  },
  {
    id: "tgif",
    name: "TGIF Ordering Portal",
    description: "View food campaigns, place orders, manage budgets, and review order history.",
    url: "/tgif",
    iconKey: "shopping",
    status: "available",
    isActive: true,
    sortOrder: 20,
  },
];

export function iconFor(key: string): LucideIcon {
  return applicationIconMap[key as ApplicationIconKey] ?? applicationIconMap.grid;
}

export function statusLabel(status: ApplicationStatus) {
  return status === "comingSoon" ? "Coming soon" : "Available";
}
