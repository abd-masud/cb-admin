"use client";

import { Company } from "./Company";
import { useAuth } from "@/contexts/AuthContext";
import { useAccAdminRedirect } from "@/hooks/useAccAdmin";

export const DashboardComponent = () => {
  const { user } = useAuth();

  useAccAdminRedirect();
  if (!user) return null;

  return (
    <main className="bg-gray-50 min-h-screen p-6">
      <Company />
    </main>
  );
};
