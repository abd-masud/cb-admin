"use client";
import { useEffect } from "react";

export default function Window({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (
        window.location.hostname == "www.copaac.19872000.xyz" ||
        window.location.protocol !== "https:"
      ) {
        window.location.href =
          "https://copaac.19872000.xyz" +
          window.location.pathname +
          window.location.search;
      }
    }
  }, []);

  return <>{children}</>;
}
