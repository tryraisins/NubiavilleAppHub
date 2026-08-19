import { CalendarCheck2, ClipboardList, LayoutGrid, ShoppingBag, Wrench } from "lucide-react";

import type { ApplicationIconKey } from "@/lib/applications";

export function ApplicationIcon({ iconKey, className = "size-5", strokeWidth = 1.8 }: { iconKey: ApplicationIconKey; className?: string; strokeWidth?: number }) {
  if (iconKey === "calendar") return <CalendarCheck2 className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
  if (iconKey === "clipboard") return <ClipboardList className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
  if (iconKey === "shopping") return <ShoppingBag className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
  if (iconKey === "tools") return <Wrench className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
  return <LayoutGrid className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
