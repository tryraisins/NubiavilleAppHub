import { NextResponse } from "next/server";

import { errorResponse, requireAdmin } from "@/lib/api";
import { createAdmin, getAdmins } from "@/lib/sharepoint";
import { adminDraftFrom } from "@/lib/validation";

export async function POST(request: Request) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;
  try {
    const draft = adminDraftFrom(await request.json());
    const admins = await getAdmins(result.context.accessToken);
    if (admins.some((admin) => admin.email === draft.email)) return errorResponse(new Error("That administrator already exists."));
    const admin = await createAdmin(result.context.accessToken, draft);
    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
