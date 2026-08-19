export type ApplicationIconKey = "calendar" | "clipboard" | "grid" | "shopping" | "tools";

export type Application = {
  description: string;
  iconKey: ApplicationIconKey;
  name: string;
  url: `/${string}`;
};

// Add every App Hub application here. Routes must stay on this origin so they
// continue inside the installed PWA window.
export const applications: Application[] = [
  {
    name: "Leave Management",
    description: "Manage leave requests, approvals, balances, history, and related employee leave activities.",
    url: "/leave",
    iconKey: "calendar",
  },
  {
    name: "TGIF Ordering Portal",
    description: "View food campaigns, place orders, manage budgets, and review order history.",
    url: "/tgif",
    iconKey: "shopping",
  },
];
