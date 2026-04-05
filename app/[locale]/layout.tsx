import type { Metadata } from "next";

import { Geist } from "next/font/google";
import "../globals.css";
import { getTranslations } from "next-intl/server";
import NavBar from "../_components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default:  "MontBlanc",
    template: "%s — MontBlanc",
  },
  description: "Freelance illustrator specialising in character design and emotive illustration.",
  openGraph: {
    siteName: "MontBlanc",
    type:     "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tf = await getTranslations({ locale, namespace: "footer" });

  return (
    <html lang={locale} className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NavBar locale={locale} labels={{
          about:      t("about"),
          portfolio:  t("portfolio"),
          commission: t("commission"),
          store:      t("store"),
          contact:    t("contact"),
        }} />
        <main className="flex-1">{children}</main>
        <footer className="text-center text-xs text-white/40 py-8 border-t border-white/10">
          {tf("copyright")}
        </footer>
      </body>
    </html>
  );
}
