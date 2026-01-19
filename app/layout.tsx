import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import { mono, sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
export const metadata: Metadata = {
  title: "Fishy",
  description: "Phishing simulation and awareness platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(sans.variable, mono.variable, "antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
