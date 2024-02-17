import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@kicka/components/navbar";
import Providers from "@kicka/providers/providers";
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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={cn(
          "flex min-h-screen justify-center bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <Providers>
          <main className="container mb-20 flex max-w-2xl grow flex-col gap-5 p-5">
            {children}
          </main>
          <Navbar />
        </Providers>
      </body>
    </html>
  );
}
