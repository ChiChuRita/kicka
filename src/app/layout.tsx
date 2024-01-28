import "./globals.css";

import Image from "next/image";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@kicka/components/navbar";
import NextAuthProvider from "@kicka/NextAuthProvider";
import { cn } from "@kicka/lib/utils";

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
          "flex min-h-screen justify-center bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <NextAuthProvider>
          <main className="container flex max-w-2xl grow flex-col gap-5 p-5">
            {children}
          </main>
          <Navbar />
        </NextAuthProvider>
      </body>
    </html>
  );
}
