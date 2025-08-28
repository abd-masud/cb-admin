"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { SideBar } from "@/components/SideBar/SideBar";
import { Header } from "@/components/Header/Header";
import { AnimatePresence, motion } from "framer-motion";
import CompanyCheck from "./CompanyCheck";

const HIDDEN_PAGES = [
  "/",
  "/terms-and-conditions",
  "/privacy-policy",
  "/auth/login",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/auth/new-password",
  "/auth/employee-login",
  "/admin",
] as const;

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);
  const closeSidebar = () => isSidebarVisible && setSidebarVisible(false);

  const isHiddenPage = HIDDEN_PAGES.includes(
    pathname as (typeof HIDDEN_PAGES)[number]
  );

  return (
    <CompanyCheck>
      {!isHiddenPage && (
        <>
          <div
            className={`fixed w-[250px] z-50 transition-transform duration-100 ${
              isSidebarVisible ? "translate-x-0" : "-translate-x-full"
            }`}
            aria-hidden={!isSidebarVisible}
          >
            <SideBar closeSidebar={closeSidebar} />
          </div>
          {isSidebarVisible && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition duration-100"
              onClick={closeSidebar}
              role="presentation"
            />
          )}
        </>
      )}
      <main
        className={`flex-1 transition-all duration-100 ${
          !isHiddenPage && isSidebarVisible ? "md:ml-[250px] ml-0" : "ml-0"
        }`}
      >
        {!isHiddenPage && (
          <div className="sticky top-0 z-20 bg-white">
            <Header toggleSidebar={toggleSidebar} />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </CompanyCheck>
  );
}
