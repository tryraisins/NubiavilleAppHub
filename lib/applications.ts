import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck2,
  ClipboardCheck,
  FileWarning,
  KeyRound,
  ShoppingBag,
} from "lucide-react";

export type ApplicationStatus = "available" | "pending" | "coming-soon";

export type Application = {
  description: string;
  href?: string;
  icon: LucideIcon;
  id: string;
  name: string;
  status: ApplicationStatus;
  statusLabel: string;
};

export const applications: readonly Application[] = [
  {
    id: "leave",
    name: "Leave Management",
    description:
      "Manage leave requests, approvals, balances, history, and related employee leave activities.",
    href: "/leave",
    icon: CalendarCheck2,
    status: "available",
    statusLabel: "Available",
  },
  {
    id: "tgif",
    name: "TGIF Ordering Portal",
    description:
      "View food campaigns, place orders, manage budgets, and review order history.",
    href: "/tgif",
    icon: ShoppingBag,
    status: "pending",
    statusLabel: "Available once /tgif is deployed",
  },
  {
    id: "work-permit",
    name: "Work Permit",
    description: "Manage work-permit requests, supporting documents, and review milestones.",
    icon: ClipboardCheck,
    status: "coming-soon",
    statusLabel: "Coming soon",
  },
  {
    id: "attestation",
    name: "Attestation",
    description: "Prepare, request, and track employee attestations in one place.",
    icon: FileWarning,
    status: "coming-soon",
    statusLabel: "Coming soon",
  },
  {
    id: "access-management",
    name: "Access Management",
    description: "Request and manage access to the tools and resources you need.",
    icon: KeyRound,
    status: "coming-soon",
    statusLabel: "Coming soon",
  },
  {
    id: "incident-reporting",
    name: "Incident Reporting",
    description: "Report, follow up on, and document workplace incidents responsibly.",
    icon: FileWarning,
    status: "coming-soon",
    statusLabel: "Coming soon",
  },
];
