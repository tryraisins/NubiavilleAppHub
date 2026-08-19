import Image from "next/image";
import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";

import { signOut } from "@/auth";
import { PwaInstallButton } from "@/components/pwa-install-button";

export function HubHeader({ admin, name }: { admin: boolean; name: string }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white/95 px-4 py-3 shadow-[0_12px_32px_rgba(21,35,61,0.05)] backdrop-blur-sm sm:px-6">
      <Link href="/" className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none">
        <Image
          src="/nubiaville-logo.svg"
          alt="Nubiaville"
          width={1584}
          height={265}
          className="block h-auto w-32 shrink-0 object-contain object-left sm:w-40"
        />
        <span className="hidden h-6 w-px bg-[var(--border)] sm:block" aria-hidden="true" />
        <span className="hidden font-heading text-sm font-bold tracking-[0.01em] text-[var(--navy)] sm:inline">App Hub</span>
      </Link>

      <nav className="flex shrink-0 items-center gap-1.5" aria-label="Account">
        <PwaInstallButton />
        {admin ? (
          <Link
            href="/admin"
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-bold text-[var(--navy)] transition hover:bg-[#edf2fb] focus-visible:outline-none"
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Manage</span>
          </Link>
        ) : null}
        <span className="hidden max-w-36 truncate px-2 text-xs font-medium text-[var(--muted)] lg:block" title={name}>{name}</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="grid size-10 cursor-pointer place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[#f1f4f9] hover:text-[var(--navy)] focus-visible:outline-none"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </form>
      </nav>
    </header>
  );
}
