export type ApplicationIconKey = "calendar" | "clipboard" | "grid" | "shopping" | "tools";

export type Application = {
  description: string;
  iconKey: ApplicationIconKey;
  name: string;
  newTab?: boolean;
  url: string;
};

// Add every App Hub application here. External apps open in a new browser tab.
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
  {
    name: "Weekly Report Review",
    description: "Review weekly task reports submitted by staff and keep up with team progress.",
    url: "https://nubiaville.sharepoint.com/sites/workflowdemo/Pages/ViewWeeklyReport.aspx",
    iconKey: "clipboard",
    newTab: true,
  },
];
