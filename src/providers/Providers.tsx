"use client";

import { SessionProvider } from "next-auth/react";

// Wraps the app with authentication session context
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
