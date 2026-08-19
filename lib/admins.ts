export const DEFAULT_ADMIN_EMAILS = [
  "samuelo@nubiaville.onmicrosoft.com",
  "ibikunle_johnson@nubiaville.onmicrosoft.com",
  "oluwaseun_sowemimo@nubiaville.onmicrosoft.com",
  "hr_executive@nubiaville.onmicrosoft.com",
] as const;

export function normaliseEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isBootstrapAdmin(email: string | null | undefined) {
  return Boolean(email && DEFAULT_ADMIN_EMAILS.includes(normaliseEmail(email) as (typeof DEFAULT_ADMIN_EMAILS)[number]));
}
