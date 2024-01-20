import Link from "next/link";

import { Inter } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HPI Kicka",
  description: "HPI Kicka",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
        <nav>
          <Link href="/scoreboard">Scoreboard</Link>
          <Link href="/">Home</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </body>
    </html>
  );
}
