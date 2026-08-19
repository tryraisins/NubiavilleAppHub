"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => undefined);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  if (!installPrompt) return null;

  return (
    <button
      type="button"
      onClick={install}
      className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-bold text-[var(--navy)] transition hover:bg-[#edf2fb] focus-visible:outline-none"
    >
      <Download className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Install</span>
    </button>
  );
}
