import { NextResponse } from "next/server";

import { errorResponse, requireAdmin } from "@/lib/api";
import { deleteApplication, updateApplication } from "@/lib/sharepoint";
import { applicationDraftFrom, numericId } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;
  try {
    const { id } = await params;
    await updateApplication(result.context.accessToken, numericId(id), applicationDraftFrom(await request.json()));
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
    await deleteApplication(result.context.accessToken, numericId(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
