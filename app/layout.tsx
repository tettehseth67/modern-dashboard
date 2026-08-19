import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academy Automation Workspace",
  description:
    "Responsive Next.js 15 full-stack dashboard system container panel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pure, zero-overhead root layout shell frame
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-900 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
