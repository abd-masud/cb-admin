"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo.webp";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AiFillDashboard, AiFillProduct } from "react-icons/ai";
import {
  FaCubesStacked,
  FaGear,
  // FaHandHoldingDollar,
  FaMoneyBillTrendUp,
  FaUsers,
} from "react-icons/fa6";
import {
  // FaBoxes,
  FaChevronDown,
  FaUserTie,
} from "react-icons/fa";
// import { IoNewspaper } from "react-icons/io5";
import { GiBuyCard, GiNotebook } from "react-icons/gi";
// import { BiSolidShoppingBags } from "react-icons/bi";
import { TbBlockquote } from "react-icons/tb";
import { RiExchangeDollarFill } from "react-icons/ri";
import { useAuth } from "@/contexts/AuthContext";
import { useAccUserRedirect } from "@/hooks/useAccUser";
import { ModulePermission, PermissionResponse } from "@/types/permission";

const SIDEBAR_MODULES = [
  "customers",
  "invoices",
  "quotes",
  "products",
  "stores",
  "employees",
  "sales-report",
  "stock-master",
  // "accounting",
  // "expenses",
  // "income",
  "suppliers",
  // "others",
  "settings",
  "subscription-plan",
];

interface SideBarProps {
  closeSidebar?: () => void;
}

export const SideBar = ({ closeSidebar }: SideBarProps) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [roleModules, setRoleModules] = useState<
    Record<string, ModulePermission[]>
  >({});
  useAccUserRedirect();

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user?.id || !user?.role) return;

      try {
        const permissionsRes = await fetch(
          `/api/permissions?user_id=${user.id}`
        );
        const permissionsData = await permissionsRes.json();
        const permissionsList: PermissionResponse[] = Array.isArray(
          permissionsData.data
        )
          ? permissionsData.data
          : [];

        let allowedModules: string[] = [];

        if (user.role.toLowerCase() == "admin") {
          allowedModules = SIDEBAR_MODULES;
        } else {
          const matchedRole = permissionsList.find((p) => p.role == user.role);
          allowedModules = matchedRole?.allowedModules || [];
        }

        const modules = SIDEBAR_MODULES.map((module, idx) => ({
          id: idx.toString(),
          name: module,
          canView: allowedModules.includes(module),
        }));

        setRoleModules({
          [user.role]: modules,
        });
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchPermissions();
  }, [user?.id, user?.role]);
  if (!user) return null;
  const canAccessModule = (module: string) => {
    const userRole = user?.role;
    const modules = roleModules[userRole] || [];
    return modules.find((m) => m.name == module && m.canView);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection == section ? null : section);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && closeSidebar) {
      closeSidebar();
    }
  };

  const linkClass = (route: string) =>
    `text-[13px] text-white font-[500] flex items-center transition duration-300 group h-11 border-t border-[#252D37] ${
      pathname == route ? "text-white bg-[#1E2639]" : ""
    }`;

  const subLinkClass = (route: string) =>
    `text-[13px] text-gray-400 hover:text-white font-[500] flex items-center transition duration-300 group h-11 ${
      pathname == route ? "text-white" : ""
    }`;

  const linkBar = (route: string) =>
    `bg-[#307DF1] h-[23px] w-[3px] group-hover:opacity-100 opacity-0 transition duration-300 ${
      pathname == route ? "opacity-100" : ""
    }`;

  return (
    <main className="bg-[#131226] h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
      <Link
        className="text-white font-bold flex items-center text-[30px] px-8 py-[19.5px]"
        href={"/"}
        onClick={handleLinkClick}
      >
        <Image height={30} src={logo} alt={"Logo"} priority />
        <span className="text-white text-[18px] font-bold ml-2">
          Copa Business
        </span>
      </Link>
      <Link
        href={"/dashboard"}
        className={linkClass("/dashboard")}
        onClick={handleLinkClick}
      >
        <div className={linkBar("/dashboard")}></div>
        <AiFillDashboard className="ml-[21px] text-[16px] mr-3 w-5" />
        Dashboard
      </Link>

      {canAccessModule("suppliers") && (
        <>
          <button
            onClick={() => toggleSection("suppliers")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/suppliers") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/suppliers")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <GiBuyCard className="ml-[21px] text-[16px] mr-3 w-5" />
              Suppliers
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "suppliers"
                ? "max-h-[90px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/suppliers/add-suppliers")}
                href="/suppliers/add-suppliers"
                onClick={handleLinkClick}
              >
                Add Suppliers
              </Link>

              <Link
                className={subLinkClass("/suppliers/suppliers-list")}
                href="/suppliers/suppliers-list"
                onClick={handleLinkClick}
              >
                Suppliers List
              </Link>
            </div>
          </div>
        </>
      )}

      {canAccessModule("customers") && (
        <>
          <button
            onClick={() => toggleSection("customers")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/customers") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/customers")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <FaUsers className="ml-[21px] text-[16px] mr-3 w-5" />
              Customers
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "customers"
                ? "max-h-[90px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/customers/add-customers")}
                href="/customers/add-customers"
                onClick={handleLinkClick}
              >
                Add Customers
              </Link>

              <Link
                className={subLinkClass("/customers/customers-list")}
                href="/customers/customers-list"
                onClick={handleLinkClick}
              >
                Customers List
              </Link>
            </div>
          </div>
        </>
      )}

      {canAccessModule("products") && (
        <>
          <button
            onClick={() => toggleSection("products")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/products") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/products")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <AiFillProduct className="ml-[21px] text-[16px] mr-3 w-5" />
              Products
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "products"
                ? "max-h-[135px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/products/add-products")}
                href="/products/add-products"
                onClick={handleLinkClick}
              >
                Add Products
              </Link>

              <Link
                className={subLinkClass("/products/products-list")}
                href="/products/products-list"
                onClick={handleLinkClick}
              >
                Products List
              </Link>

              <Link
                className={subLinkClass("/products/product-settings")}
                href="/products/product-settings"
                onClick={handleLinkClick}
              >
                Product Settings
              </Link>
            </div>
          </div>
        </>
      )}

      {canAccessModule("quotes") && (
        <>
          <button
            onClick={() => toggleSection("quotes")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/quotes") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/quotes")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <TbBlockquote className="ml-[21px] text-[16px] mr-3 w-5" />
              Quotes
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "quotes"
                ? "max-h-[90px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/quotes/create-quotes")}
                href="/quotes/create-quotes"
                onClick={handleLinkClick}
              >
                Create Quotes
              </Link>

              <Link
                className={subLinkClass("/quotes/quotes-list")}
                href="/quotes/quotes-list"
                onClick={handleLinkClick}
              >
                Quotes List
              </Link>
            </div>
          </div>
        </>
      )}

      {canAccessModule("invoices") && (
        <>
          <button
            onClick={() => toggleSection("invoices")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/invoices") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/invoices")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <FaMoneyBillTrendUp className="ml-[21px] text-[16px] mr-3 w-5" />
              Invoices
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "invoices"
                ? "max-h-[180px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/invoices/create-invoices")}
                href="/invoices/create-invoices"
                onClick={handleLinkClick}
              >
                Create Invoices
              </Link>

              <Link
                className={subLinkClass("/invoices/invoices-list")}
                href="/invoices/invoices-list"
                onClick={handleLinkClick}
              >
                Invoices List
              </Link>

              <Link
                className={subLinkClass("/invoices/open-invoices-list")}
                href="/invoices/open-invoices-list"
                onClick={handleLinkClick}
              >
                Open Invoices
              </Link>

              <Link
                className={subLinkClass("/invoices/closed-invoices-list")}
                href="/invoices/closed-invoices-list"
                onClick={handleLinkClick}
              >
                Closed Invoices
              </Link>
            </div>
          </div>
        </>
      )}

      {canAccessModule("stock-master") && (
        <>
          <button
            onClick={() => toggleSection("stock-master")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/stock-master")
                ? "text-white bg-[#1E2639]"
                : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/stock-master")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <FaCubesStacked className="ml-[21px] text-[16px] mr-3 w-5" />
              Stock Master
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "stock-master"
                ? "max-h-[180px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/stock-master/warehouse")}
                href="/stock-master/warehouse"
                onClick={handleLinkClick}
              >
                Warehouse
              </Link>
              <Link
                className={subLinkClass("/stock-master/in-house-product")}
                href="/stock-master/in-house-product"
                onClick={handleLinkClick}
              >
                In-house Product
              </Link>
              <Link
                className={subLinkClass("/stock-master/transfer-products")}
                href="/stock-master/transfer-products"
                onClick={handleLinkClick}
              >
                Transfer Products
              </Link>
              <Link
                className={subLinkClass("/stock-master/stock-settings")}
                href="/stock-master/stock-settings"
                onClick={handleLinkClick}
              >
                Stock Settings
              </Link>
            </div>
          </div>
        </>
      )}

      {canAccessModule("sales-report") && (
        <>
          <button
            onClick={() => toggleSection("sales-report")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/sales-report")
                ? "text-white bg-[#1E2639]"
                : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/sales-report")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <GiNotebook className="ml-[21px] text-[16px] mr-3 w-5" />
              Sales Report
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "sales-report"
                ? "max-h-[90px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/sales-report/all-sales-report")}
                href="/sales-report/all-sales-report"
                onClick={handleLinkClick}
              >
                All Sales Report
              </Link>
              <Link
                className={subLinkClass("/sales-report/customer-ledger")}
                href="/sales-report/customer-ledger"
                onClick={handleLinkClick}
              >
                Customer Ledger
              </Link>
            </div>
          </div>
        </>
      )}

      {/* {canAccessModule("accounting") && (
        <>
          <button
            onClick={() => toggleSection("accounting")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/accounting") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/accounting")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <IoNewspaper className="ml-[21px] text-[16px] mr-3 w-5" />
              Accounting
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "accounting"
                ? "max-h-[90px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/sales-report/all-sales-report")}
                href="/sales-report/all-sales-report"
                onClick={handleLinkClick}
              >
                All Sales Report
              </Link>
              <Link
                className={subLinkClass("/sales-report/customer-ledger")}
                href="/sales-report/customer-ledger"
                onClick={handleLinkClick}
              >
                Customer Ledger
              </Link>
            </div>
          </div>
        </>
      )} */}

      {/* {canAccessModule("expenses") && (
        <>
          <button
            onClick={() => toggleSection("expenses")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/expenses") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/expenses")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <BiSolidShoppingBags className="ml-[21px] text-[16px] mr-3 w-5" />
              Expenses
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "expenses"
                ? "max-h-[90px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/sales-report/all-sales-report")}
                href="/sales-report/all-sales-report"
                onClick={handleLinkClick}
              >
                All Sales Report
              </Link>
              <Link
                className={subLinkClass("/sales-report/customer-ledger")}
                href="/sales-report/customer-ledger"
                onClick={handleLinkClick}
              >
                Customer Ledger
              </Link>
            </div>
          </div>
        </>
      )} */}

      {/* {canAccessModule("income") && (
        <>
          <button
            onClick={() => toggleSection("income")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/income") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/income")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <FaHandHoldingDollar className="ml-[21px] text-[14px] mr-3 w-5" />
              Income
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "income"
                ? "max-h-[90px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/sales-report/all-sales-report")}
                href="/sales-report/all-sales-report"
                onClick={handleLinkClick}
              >
                All Sales Report
              </Link>
              <Link
                className={subLinkClass("/sales-report/customer-ledger")}
                href="/sales-report/customer-ledger"
                onClick={handleLinkClick}
              >
                Customer Ledger
              </Link>
            </div>
          </div>
        </>
      )} */}

      {canAccessModule("employees") && (
        <>
          <button
            onClick={() => toggleSection("employees")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/employees") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/employees")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <FaUserTie className="ml-[21px] text-[16px] mr-3 w-5" />
              Employees
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "employees"
                ? "max-h-[135px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/employees/add-employees")}
                href="/employees/add-employees"
                onClick={handleLinkClick}
              >
                Add Employees
              </Link>

              <Link
                className={subLinkClass("/employees/employees-list")}
                href="/employees/employees-list"
                onClick={handleLinkClick}
              >
                Employees List
              </Link>

              <Link
                className={subLinkClass("/employees/employee-settings")}
                href="/employees/employee-settings"
                onClick={handleLinkClick}
              >
                Employee Settings
              </Link>
            </div>
          </div>
        </>
      )}

      {/* {canAccessModule("others") && (
        <>
          <button
            onClick={() => toggleSection("others")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/others") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/others")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <FaBoxes className="ml-[21px] text-[14px] mr-3 w-5" />
              Others
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "others"
                ? "max-h-[135px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/employees/add-employees")}
                href="/employees/add-employees"
                onClick={handleLinkClick}
              >
                Add Employees
              </Link>

              <Link
                className={subLinkClass("/employees/employees-list")}
                href="/employees/employees-list"
                onClick={handleLinkClick}
              >
                Employees List
              </Link>

              <Link
                className={subLinkClass("/employees/employee-settings")}
                href="/employees/employee-settings"
                onClick={handleLinkClick}
              >
                Employee Settings
              </Link>
            </div>
          </div>
        </>
      )} */}

      {canAccessModule("settings") && (
        <>
          <button
            onClick={() => toggleSection("settings")}
            className={`text-[13px] text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
              pathname.includes("/settings") ? "text-white bg-[#1E2639]" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                  pathname.includes("/settings")
                    ? "bg-[#307DF1]"
                    : "bg-transparent"
                }`}
              ></div>
              <FaGear className="ml-[21px] text-[16px] mr-3 w-5" />
              Settings
            </div>
            <FaChevronDown />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              openSection == "settings"
                ? "max-h-[180px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
              <Link
                className={subLinkClass("/settings/currency-settings")}
                href="/settings/currency-settings"
                onClick={handleLinkClick}
              >
                Currency Settings
              </Link>

              <Link
                className={subLinkClass("/settings/terms-and-conditions")}
                href="/settings/terms-and-conditions"
                onClick={handleLinkClick}
              >
                Terms & Conditions
              </Link>

              <Link
                className={subLinkClass("/settings/smtp-settings")}
                href="/settings/smtp-settings"
                onClick={handleLinkClick}
              >
                SMTP Settings
              </Link>

              <Link
                className={subLinkClass("/settings/roles-and-permissions")}
                href="/settings/roles-and-permissions"
                onClick={handleLinkClick}
              >
                Roles & Permissions
              </Link>
            </div>
          </div>
        </>
      )}

      {canAccessModule("subscription-plan") && (
        <>
          <div className="mt-auto">
            <Link
              href="/subscription-plan"
              className={` border-b ${linkClass(
                "/subscription-plan"
              )} flex items-center justify-between`}
              onClick={handleLinkClick}
            >
              <div className="flex items-center">
                <div className={linkBar("/subscription-plan")}></div>
                <RiExchangeDollarFill className="ml-[21px] text-[18px] mr-3 w-5" />
                Subscription Plan
              </div>
              {/* <div className="bg-[#307DF1] text-white text-xs px-2 py-1 rounded-md mr-3">
            Pro
          </div> */}
            </Link>
          </div>
        </>
      )}

      <div className="text-white font-bold flex items-center text-[30px] px-6 py-[19.5px]">
        <span className="text-white text-[14px] font-bold text-center px-5 py-3 border border-[#307DF1] rounded-lg">
          Business is in your hand...
        </span>
      </div>
    </main>
  );
};
