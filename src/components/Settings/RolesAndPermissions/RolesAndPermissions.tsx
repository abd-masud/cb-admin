"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumb } from "./Breadcrumb";
import { RolesAndPermissionsForm } from "./RolesAndPermissionsForm";
import { useAccUserRedirect } from "@/hooks/useAccUser";

export const RolesAndPermissionsComponent = () => {
  const { user } = useAuth();
  useAccUserRedirect();
  if (!user) return null;
  return (
    <main className="bg-[#F2F4F7] min-h-screen p-5">
      <Breadcrumb />
      <RolesAndPermissionsForm />
    </main>
  );
};
