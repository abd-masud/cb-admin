"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumb } from "./Breadcrumb";
import { RolesAndPermissionsForm } from "./RolesAndPermissionsForm";
import { useAccAdminRedirect } from "@/hooks/useAccAdmin";

export const RolesAndPermissionsComponent = () => {
  const { user } = useAuth();
  useAccAdminRedirect();
  if (!user) return null;
  return (
    <main className="bg-[#F2F4F7] min-h-screen p-5">
      <Breadcrumb />
      <RolesAndPermissionsForm />
    </main>
  );
};
