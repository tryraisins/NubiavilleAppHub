import Image from "next/image";

import { SignInButton } from "@/components/auth/sign-in-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-white p-7 shadow-[0_24px_60px_rgba(9,8,111,0.12)] sm:p-10">
        <Image src="/nubiaville-logo.svg" alt="Nubiaville" width={1584} height={265} priority className="h-auto w-44" />
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.14em] text-[var(--orange)]">Employee access</p>
        <h1 className="font-heading mt-3 text-3xl font-bold tracking-[-0.04em] text-[var(--navy)]">App Hub</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Sign in with your Nubiaville Microsoft account to access workplace applications.
        </p>
        {error ? (
          <p className="mt-5 rounded-xl border border-[#f4d0bd] bg-[#fff5ef] px-4 py-3 text-sm text-[#9e3d08]">
            Microsoft could not complete the sign-in. Please try again.
          </p>
        ) : null}
        <div className="mt-7">
          <SignInButton callbackUrl={callbackUrl?.startsWith("/") ? callbackUrl : "/"} />
        </div>
      </section>
    </main>
  );
}
