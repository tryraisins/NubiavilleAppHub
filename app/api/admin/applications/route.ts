import { NextResponse } from "next/server";

import { errorResponse, requireAdmin } from "@/lib/api";
import { createApplication } from "@/lib/sharepoint";
import { applicationDraftFrom } from "@/lib/validation";

export async function POST(request: Request) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;
  try {
    const application = await createApplication(result.context.accessToken, applicationDraftFrom(await request.json()));
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
