import { NextResponse } from "next/server";

import { errorResponse, requireAdmin } from "@/lib/api";
import { deleteAdmin, getAdmins, updateAdmin } from "@/lib/sharepoint";
import { adminDraftFrom, numericId } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;
  try {
    const { id } = await params;
    const draft = adminDraftFrom(await request.json());
    const admins = await getAdmins(result.context.accessToken);
    const existing = admins.find((admin) => admin.id === id);
    if (!existing) return errorResponse(new Error("Administrator was not found."));
    if (existing.email === result.context.email && !draft.isActive) return errorResponse(new Error("You cannot deactivate your own administrator access."));
    if (existing.isActive && !draft.isActive && admins.filter((admin) => admin.isActive).length <= 1) {
      return errorResponse(new Error("Keep at least one active administrator."));
    }
    await updateAdmin(result.context.accessToken, numericId(id), draft);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;
  try {
    const { id } = await params;
    const admins = await getAdmins(result.context.accessToken);
    const existing = admins.find((admin) => admin.id === id);
    if (!existing) return errorResponse(new Error("Administrator was not found."));
    if (existing.email === result.context.email) return errorResponse(new Error("You cannot remove your own administrator access."));
    if (existing.isActive && admins.filter((admin) => admin.isActive).length <= 1) {
      return errorResponse(new Error("Keep at least one active administrator."));
    }
    await deleteAdmin(result.context.accessToken, numericId(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
