import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AssistantProvider } from "@/components/assistant/AssistantContext";
import { AssistantWidget } from "@/components/assistant/AssistantWidget";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <AssistantProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AssistantWidget />
        </AssistantProvider>
      </body>
    </html>
  );
}
