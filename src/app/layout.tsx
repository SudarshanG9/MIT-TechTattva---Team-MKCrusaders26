import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SWIM — Water Resilience Digital Twin",
  description:
    "A cascading failure simulator for rural water infrastructure. Model borewells, pumps, overhead tanks, and distribution zones as an interdependent network under JJM.",
  themeColor: "#070b12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen" style={{ background: "#070b12", color: "#e2e8f0" }}>
        {children}
      </body>
    </html>
  );
}
