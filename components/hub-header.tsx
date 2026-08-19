import Image from "next/image";
import Link from "next/link";

import { PwaInstallButton } from "@/components/pwa-install-button";
import { ThemeToggle } from "@/components/theme-toggle";

export function HubHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--header-shadow)] backdrop-blur-sm sm:px-6">
      <Link href="/" className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none">
        <Image src="/nubiaville-logo.png" alt="Nubiaville" width={1600} height={260} priority className="block h-auto w-32 shrink-0 object-contain object-left dark:hidden sm:w-40" />
        <Image src="/nubiaville-logo-dark.svg" alt="" width={1600} height={260} priority className="hidden h-auto w-32 shrink-0 object-contain object-left dark:block sm:w-40" />
        <span className="hidden h-6 w-px bg-[var(--border)] sm:block" aria-hidden="true" />
        <span className="hidden font-heading text-sm font-bold tracking-[0.01em] text-[var(--navy)] sm:inline">App Hub</span>
      </Link>
      <nav className="flex shrink-0 items-center gap-1.5" aria-label="App Hub controls"><ThemeToggle /><PwaInstallButton /></nav>
    </header>
  );
}
