import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nubiaville App Hub",
  description: "The central access point for Nubiaville tools.",
  icons: {
    icon: "/nubiaville-logo.svg",
    shortcut: "/nubiaville-logo.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
