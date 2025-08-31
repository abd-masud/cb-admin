"use client";

import { useCallback, useEffect, useState } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { UsersListTable } from "./UsersTable";
import { UserApiResponse, Users } from "@/types/users";
import { useAuth } from "@/contexts/AuthContext";
import { useAccAdminRedirect } from "@/hooks/useAccAdmin";

export const UsersComponent = () => {
  const { user } = useAuth();
  const [usersData, setUsersData] = useState<Users[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useAccAdminRedirect();

  const fetchUsers = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/users?user_id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json: UserApiResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch users");
      }

      setUsersData(json.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <main className="bg-[#F2F4F7] min-h-screen p-5">
      <Breadcrumb />
      <UsersListTable
        users={usersData}
        fetchUsers={fetchUsers}
        loading={loading}
      />
    </main>
  );
};
