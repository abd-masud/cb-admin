"use client";

import { usePathname } from "next/navigation";

const CanonicalURL = () => {
  const pathname = usePathname();
  const host =
    typeof window !== "undefined"
      ? window.location.host
      : "copaac.19872000.xyz";
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "https:";
  const canonicalUrl = `${protocol}//${host}${pathname}`;

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
    </>
  );
};

export default CanonicalURL;
