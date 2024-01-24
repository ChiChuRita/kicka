import { Inter } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";
import NextAuthProvider from "@/NextAuthProvider";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <NextAuthProvider>
          <main className="container flex max-w-full grow flex-col gap-5 p-6">
            {children}
          </main>
          <Navbar />
        </NextAuthProvider>
      </body>
    </html>
  );
}
