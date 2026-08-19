import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "App Hub | Nubiaville",
  description: "The central access point for Nubiaville tools.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
