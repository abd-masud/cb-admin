"use client";

import { useAuth } from "@/contexts/AuthContext";
import { EmployeeApiResponse, Employees } from "@/types/employees";
import { useCallback, useEffect, useState } from "react";
import { Spin, Table, TableColumnsType } from "antd";
import { FaXmark } from "react-icons/fa6";
import {
  ModulePermission,
  PermissionResponse,
  Permissions,
} from "@/types/permission";
import Link from "next/link";
import styled from "styled-components";

const SIDEBAR_MODULES = [
  "suppliers",
  "users",
  "products",
  "quotes",
  "invoices",
  "stock-master",
  "sales-report",
  "employees",
  "settings",
];

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[calc(100vh-170px)]">
    <div className="text-center space-y-4">
      <Spin size="large" />
      <p className="text-gray-600">Loading permissions data...</p>
    </div>
  </div>
);

export const RolesAndPermissionsForm = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Permissions[]>([]);
  const [roleModules, setRoleModules] = useState<
    Record<string, ModulePermission[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [employeesData, setEmployeesData] = useState<Employees[]>([]);
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const StyledTable = styled(Table)`
    .ant-table-thead > tr:nth-child(1) > th {
      background-color: #478cf3;
      color: white;
    }
    .ant-table-thead > tr:nth-child(2) > th {
      background-color: #6aa2f5;
      color: white;
    }
  `;

  useEffect(() => {
    const fetchRolesAndModules = async () => {
      if (!user?.id) return;
      setLoading(true);

      try {
        const rolesRes = await fetch(`/api/generals?user_id=${user.id}`);
        const rolesData = await rolesRes.json();
        const roleString: string = rolesData.data[0].role || "";
        const cleanedRoleString = roleString.replace(/[\[\]"]/g, "").trim();
        const allRoles: string[] = cleanedRoleString
          .split(",")
          .map((role) => role.trim())
          .filter((role) => role !== "");

        const permissionsRes = await fetch(
          `/api/permissions?user_id=${user.id}`
        );
        const permissionsData = await permissionsRes.json();

        const permissionsList = Array.isArray(permissionsData.data)
          ? permissionsData.data
          : [];

        const modulesByRole: Record<string, ModulePermission[]> = {};

        allRoles.forEach((roleName) => {
          const roleAccess = permissionsList.find(
            (p: PermissionResponse) => p.role == roleName
          ) || {
            role: roleName,
            allowedModules: [],
          };

          modulesByRole[roleName] = SIDEBAR_MODULES.map((module, idx) => ({
            id: idx.toString(),
            name: module,
            canView: roleAccess.allowedModules.includes(module),
          }));
        });

        setRoleModules(modulesByRole);

        setRoles(
          allRoles.map((name, id) => ({
            id: id.toString(),
            name,
          }))
        );
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    fetchRolesAndModules();
  }, [user?.id]);

  const fetchEmployees = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/employees?user_id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json: EmployeeApiResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch employees");
      }

      setEmployeesData(json.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const toggleModule = (roleName: string, moduleId: string) => {
    setRoleModules((prev) => {
      const updated = { ...prev };
      updated[roleName] = updated[roleName].map((mod) =>
        mod.id == moduleId ? { ...mod, canView: !mod.canView } : mod
      );
      return updated;
    });
  };

  const toggleAllModules = (roleName: string, checked: boolean) => {
    setRoleModules((prev) => {
      const updated = { ...prev };
      updated[roleName] = updated[roleName].map((mod) => ({
        ...mod,
        canView: checked,
      }));
      return updated;
    });
  };

  const saveAllPermissions = async () => {
    if (!initialLoadComplete) return;

    const payload = Object.keys(roleModules).map((roleName) => ({
      role: roleName,
      allowedModules: roleModules[roleName]
        .filter((mod) => mod.canView)
        .map((mod) => mod.name),
    }));

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (user?.id) {
        headers["user_id"] = user.id.toString();
      }

      const res = await fetch(`/api/permissions`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setUserMessage("Permission settings saved");
      } else {
      }
    } catch (err) {
      console.error("Error saving permissions", err);
    } finally {
      setTimeout(() => setUserMessage(null), 5000);
    }
  };

  const filteredRoles =
    selectedRoleFilter == "all"
      ? roles
      : roles.filter((role) => role.name == selectedRoleFilter);

  const getEmployeesByRole = (roleName: string) => {
    return employeesData.filter((employee) => employee.role == roleName);
  };

  const employeeColumns: TableColumnsType<Employees> = [
    {
      title: "#",
      width: "40px",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email Address",
      dataIndex: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contact",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const handleCloseMessage = () => {
    setUserMessage(null);
  };

  if (!initialLoadComplete) {
    return <LoadingSpinner />;
  }

  if (roles.length == 0) {
    return (
      <div className="min-h-[calc(100vh-170px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto text-gray-400">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Roles Found
            </h2>
            <p className="text-gray-500 text-base mb-10">
              There are currently no roles available. You can create a new role
              to get started.
            </p>
            <Link
              className="text-[14px] font-[500] py-2 px-3 rounded cursor-pointer transition-all duration-300 text-white bg-[#307EF3] hover:bg-[#478cf3] focus:bg-[#307EF3]"
              href={"/employees/employee-settings"}
            >
              Create Role
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-100 min-h-[calc(100vh-190px)] mt-4">
      {userMessage && (
        <div className="left-1/2 top-10 transform -translate-x-1/2 fixed z-50">
          <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800 text-green-600 border-2 border-green-600 mx-auto">
            <div className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {userMessage}
            </div>
            <button
              onClick={handleCloseMessage}
              className="ml-3 focus:outline-none hover:text-green-600"
            >
              <FaXmark className="text-[14px]" />
            </button>
          </div>
        </div>
      )}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="filter-all"
              name="role-filter"
              value="all"
              checked={selectedRoleFilter == "all"}
              onChange={() => setSelectedRoleFilter("all")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="filter-all" className="ml-2 text-sm text-gray-700">
              Show All
            </label>
          </div>

          {roles.map((role) => (
            <div key={role.id} className="flex items-center">
              <input
                type="radio"
                id={`filter-${role.name}`}
                name="role-filter"
                value={role.name}
                checked={selectedRoleFilter == role.name}
                onChange={() => setSelectedRoleFilter(role.name)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`filter-${role.name}`}
                className="ml-2 capitalize text-sm text-gray-700"
              >
                {role.name.replace(/[\[\]"]/g, "")}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        {filteredRoles.map((role) => {
          const allChecked = roleModules[role.name]?.every(
            (mod) => mod.canView
          );
          return (
            <div
              key={role.id}
              className="bg-white rounded-lg shadow-md px-6 py-3 divide-y"
            >
              <h3 className="text-lg font-semibold mb-2">{role.name}</h3>
              <div className="pt-3 grid 2xl:grid-cols-10 lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) =>
                      toggleAllModules(role.name, e.target.checked)
                    }
                    id={`permit-all-${role.name}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`permit-all-${role.name}`}
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Permit All
                  </label>
                </div>

                {roleModules[role.name]?.map((mod) => (
                  <div key={mod.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={mod.canView}
                      onChange={() => toggleModule(role.name, mod.id)}
                      id={`mod-${role.name}-${mod.id}`}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`mod-${role.name}-${mod.id}`}
                      className="ml-2 capitalize text-sm font-medium text-gray-700"
                    >
                      {mod.name.replace(/-/g, " ")}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedRoleFilter !== "all" && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <StyledTable<any>
            scroll={{ x: "max-content" }}
            columns={employeeColumns}
            dataSource={getEmployeesByRole(selectedRoleFilter)}
            rowKey="id"
            pagination={false}
            bordered
          />
        </div>
      )}

      {roles.length > 0 && (
        <div className="flex justify-end">
          <div className="text-center">
            <button
              onClick={saveAllPermissions}
              disabled={loading}
              className="text-[14px] font-[500] py-2 px-3 rounded cursor-pointer transition-all duration-300 text-white bg-[#307EF3] hover:bg-[#478cf3] focus:bg-[#307EF3]"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
