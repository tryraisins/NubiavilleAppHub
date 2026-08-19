import { NextResponse } from "next/server";

import { getAuthContext, isAdmin } from "@/lib/authorization";

export async function requireAdmin() {
  const context = await getAuthContext();
  if (!context) return { error: NextResponse.json({ error: "Sign in with Microsoft to continue." }, { status: 401 }) };
  try {
    if (!(await isAdmin(context))) return { error: NextResponse.json({ error: "Administrator access is required." }, { status: 403 }) };
  } catch {
    return { error: NextResponse.json({ error: "Administrator access could not be verified against SharePoint." }, { status: 503 }) };
  }
  return { context };
}

export function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "The request could not be completed.";
  return NextResponse.json({ error: message }, { status: 400 });
}
