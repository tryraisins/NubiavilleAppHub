"use client";

import { Download, Share2, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallAvailability = "android" | "ios" | "unavailable";

let deferredInstallPrompt: InstallPrompt | null = null;
let wasInstalled = false;

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isIosDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function getInstallAvailability(): InstallAvailability {
  if (wasInstalled || isStandalone()) return "unavailable";
  if (deferredInstallPrompt) return "android";
  return isIosDevice() ? "ios" : "unavailable";
}

function subscribeToInstallAvailability(onStoreChange: () => void) {
  const handleBeforeInstallPrompt = (event: Event) => {
    event.preventDefault();
    deferredInstallPrompt = event as InstallPrompt;
    onStoreChange();
  };
  const handleAppInstalled = () => {
    wasInstalled = true;
    deferredInstallPrompt = null;
    onStoreChange();
  };

  if ("serviceWorker" in navigator) void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);
  window.addEventListener("nubiaville-install-state-change", onStoreChange);

  return () => {
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.removeEventListener("appinstalled", handleAppInstalled);
    window.removeEventListener("nubiaville-install-state-change", onStoreChange);
  };
}

export function PwaInstallButton() {
  const availability = useSyncExternalStore(subscribeToInstallAvailability, getInstallAvailability, () => "unavailable");
  const [isIosGuideOpen, setIsIosGuideOpen] = useState(false);

  async function install() {
    if (availability === "ios") {
      setIsIosGuideOpen(true);
      return;
    }
    if (!deferredInstallPrompt) return;
    await deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    window.dispatchEvent(new Event("nubiaville-install-state-change"));
  }

  if (availability === "unavailable") return null;

  return (
    <>
      <button
        type="button"
        onClick={install}
        aria-haspopup={availability === "ios" ? "dialog" : undefined}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-bold text-[var(--navy)] transition hover:bg-[var(--control-hover)] focus-visible:outline-none sm:min-h-10 sm:rounded-lg"
      >
        {availability === "ios" ? <Share2 className="size-4" aria-hidden="true" /> : <Download className="size-4" aria-hidden="true" />}
        <span className="hidden sm:inline">Install</span>
      </button>
      {isIosGuideOpen ? (
        <div className="install-sheet-backdrop" role="presentation" onMouseDown={() => setIsIosGuideOpen(false)}>
          <section className="install-sheet" role="dialog" aria-modal="true" aria-labelledby="install-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--orange)]">Install on iPhone or iPad</p>
                <h2 id="install-title" className="font-heading mt-2 text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">Add App Hub to your Home Screen</h2>
              </div>
              <button type="button" onClick={() => setIsIosGuideOpen(false)} className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl text-[var(--navy)] transition hover:bg-[var(--control-hover)] focus-visible:outline-none" aria-label="Close install instructions">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <ol className="mt-6 space-y-4 text-sm leading-6 text-[var(--muted)]">
              <li className="flex gap-3"><span className="install-step">1</span><span>Open this page in <strong className="text-[var(--ink)]">Safari</strong>, then tap the <strong className="inline-flex items-center gap-1 text-[var(--ink)]"><Share2 className="size-4" aria-hidden="true" /> Share</strong> button.</span></li>
              <li className="flex gap-3"><span className="install-step">2</span><span>Scroll down and choose <strong className="text-[var(--ink)]">Add to Home Screen</strong>.</span></li>
              <li className="flex gap-3"><span className="install-step">3</span><span>Tap <strong className="text-[var(--ink)]">Add</strong>. App Hub will then open like a dedicated app.</span></li>
            </ol>
          </section>
        </div>
      ) : null}
    </>
  );
}
