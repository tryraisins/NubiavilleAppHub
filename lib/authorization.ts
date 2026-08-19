import { auth } from "@/auth";
import { isBootstrapAdmin } from "@/lib/admins";
import { getAdmins, hasAdminsStore } from "@/lib/sharepoint";

export type AuthContext = { accessToken: string; email: string; name: string };

export async function getAuthContext(): Promise<AuthContext | null> {
  const session = await auth();
  if (!session) return null;
  const email = session.user?.email?.trim().toLowerCase();
  if (!email || !session.accessToken || session.authError) return null;
  return { email, accessToken: session.accessToken, name: session.user?.name?.trim() || email };
}

export async function isAdmin(context: AuthContext) {
  if (!hasAdminsStore) return isBootstrapAdmin(context.email);
  const admins = await getAdmins(context.accessToken);
  // The initial four named administrators can complete first-time list setup.
  // Once the list has entries, it becomes the source of truth for access.
  if (!admins.length) return isBootstrapAdmin(context.email);
  return admins.some((admin) => admin.isActive && admin.email === context.email);
}
