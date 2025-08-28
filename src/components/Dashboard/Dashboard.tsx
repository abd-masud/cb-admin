"use client";

import { Company } from "./Company";
import { MetricsCards } from "./MetricsCards";
import { QuickActions } from "./QuickActions";
import { useAuth } from "@/contexts/AuthContext";
import { useAccUserRedirect } from "@/hooks/useAccUser";
import { Overviews } from "./Overviews";

export const DashboardComponent = () => {
  const { user } = useAuth();

  useAccUserRedirect();
  if (!user) return null;

  return (
    <main className="bg-gray-50 min-h-screen p-6">
      <Company />
      <MetricsCards />
      {user.role?.toLocaleLowerCase() == "admin" && <QuickActions />}
      <Overviews />
    </main>
  );
};
