import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artist Name",
  description: "Freelance Illustrator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-black">
        <nav className="h-14 flex justify-between items-center px-8 border-b border-gray-200">
          <Link href="/" className="font-semibold tracking-widest text-sm uppercase">
            Artist Name
          </Link>
          <div className="flex gap-8 text-sm">
            <Link href="/" className="hover:text-gray-500 transition-colors">Portfolio</Link>
            <Link href="/commission" className="hover:text-gray-500 transition-colors">Commission</Link>
            <Link href="/store" className="hover:text-gray-500 transition-colors">Store</Link>
            <Link href="/contact" className="hover:text-gray-500 transition-colors">Contact</Link>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="text-center text-xs text-gray-400 py-8 border-t border-gray-100">
          © 2025 Artist Name — All rights reserved
        </footer>
      </body>
    </html>
  );
}
