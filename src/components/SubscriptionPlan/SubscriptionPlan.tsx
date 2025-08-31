"use client";

import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionPlanCard } from "./SubscriptionPlanCard";
import { Breadcrumb } from "./Breadcrumb";
import { useAccAdminRedirect } from "@/hooks/useAccAdmin";

export const SubscriptionPlanComponent = () => {
  const { user } = useAuth();
  useAccAdminRedirect();
  if (!user) return null;
  return (
    <main className="bg-[#F2F4F7] min-h-screen p-5">
      <Breadcrumb />
      <SubscriptionPlanCard />
    </main>
  );
};
