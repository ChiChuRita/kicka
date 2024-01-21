import Link from "next/link";

import { Inter } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";
import NextAuthProvider from "@/NextAuthProvider";
import { cva } from "class-variance-authority";
import Navbar from "@/components/ui/navbar";

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
        <NextAuthProvider>
          <div className="flex flex-col max-w-2xl container bg-slate-50 h-screen">
            <main className="flex grow max-w-full">{children}</main>
            <Navbar />
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
