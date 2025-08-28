"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export const useAccUserRedirect = () => {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        const accUser = localStorage.getItem("cb_user");
        if (!accUser && pathname !== "/auth/employee-login") {
            router.push("/");
        }
    }, [router, pathname]);
};
