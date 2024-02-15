"use client";

import QueryProvider from "./query-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
