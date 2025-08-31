"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export const useAccAdminRedirect = () => {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        const accAdmin = localStorage.getItem("cb_admin");
        if (!accAdmin && pathname !== "/auth/employee-login") {
            router.push("/");
        }
    }, [router, pathname]);
};
