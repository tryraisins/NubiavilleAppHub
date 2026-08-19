"use client";

import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function SignInButton({ callbackUrl = "/" }: { callbackUrl?: string }) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        setPending(true);
        void signIn("microsoft-entra-id", { redirectTo: callbackUrl });
      }}
      disabled={pending}
      className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#11108c] disabled:cursor-wait disabled:opacity-70"
    >
      <LogIn className="size-4" aria-hidden="true" />
      {pending ? "Opening Microsoft…" : "Sign in with Microsoft"}
    </button>
  );
}
