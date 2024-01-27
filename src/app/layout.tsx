import './globals.css';

import { Inter } from 'next/font/google';
import Image from 'next/image';

import Navbar from '@/components/navbar';
import { cn } from '@/lib/utils';
import NextAuthProvider from '@/NextAuthProvider';

import type { Metadata } from "next";

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
