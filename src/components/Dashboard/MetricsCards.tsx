"use client";

import { useAuth } from "@/contexts/AuthContext";
import { CustomerApiResponse, Customers } from "@/types/customers";
import { InvoiceApiResponse, InvoiceData } from "@/types/invoices";
import { ProductApiResponse, Products } from "@/types/products";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FiFileText, FiTrendingUp, FiUsers, FiPackage } from "react-icons/fi";

export const MetricsCards = () => {
  const { user } = useAuth();
  const [invoicesData, setInvoicesData] = useState<InvoiceData[]>([]);
  const [productsData, setProductsData] = useState<Products[]>([]);
  const [customersData, setCustomersData] = useState<Customers[]>([]);
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInvoices = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/invoices?user_id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json: InvoiceApiResponse = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch invoices");
      }
      setInvoicesData(json.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  }, [user?.id]);

  const fetchProducts = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/products?user_id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json: ProductApiResponse = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch products");
      }
      setProductsData(json.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [user?.id]);

  const fetchCustomers = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/customers?user_id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json: CustomerApiResponse = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch customers");
      }
      setCustomersData(json.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }, [user?.id]);

  const fetchCurrency = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/currencies?user_id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (response.status == 404 || !json.success) {
        setCurrencyCode("USD");
        return;
      }

      if (json.data && json.data.length > 0) {
        setCurrencyCode(json.data[0].currency || "USD");
      } else {
        setCurrencyCode("USD");
      }
    } catch (error) {
      console.error("Error fetching currency:", error);
      setCurrencyCode("USD");
    }
  }, [user?.id]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchInvoices(),
        fetchProducts(),
        fetchCustomers(),
        fetchCurrency(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchInvoices, fetchProducts, fetchCustomers, fetchCurrency]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [fetchAllData, user]);

  const calculateMetrics = () => {
    const totalRevenue = invoicesData.reduce((sum, invoice) => {
      return sum + Number(invoice.paid_amount);
    }, 0);

    const totalDue = invoicesData.reduce((sum, invoice) => {
      return sum + Number(invoice.due_amount);
    }, 0);

    const totalProducts = new Set(
      productsData.map((product) => product.product_id)
    ).size;
    const totalCustomers = customersData.length;

    return [
      {
        title: "Total Revenue",
        value: `${totalRevenue.toLocaleString()} ${currencyCode}`,
        change: <span className="text-green-600">On Target</span>,
        icon: <FiTrendingUp className="text-green-500" size={24} />,
        link: "/invoices/closed-invoices-list",
      },
      {
        title: "Receivables",
        value: `${totalDue.toLocaleString()} ${currencyCode}`,
        change: <span className="text-red-600">Action Needed</span>,
        icon: <FiFileText className="text-yellow-500" size={24} />,
        link: "/invoices/open-invoices-list",
      },
      {
        title: "Products",
        value: `${totalProducts.toString()} Items`,
        change: <span className="text-green-600">In Stock</span>,
        icon: <FiPackage className="text-blue-500" size={24} />,
        link: "/products/products-list",
      },
      {
        title: "Customers",
        value: `${totalCustomers.toString()}`,
        change: <span className="text-green-600">Active</span>,
        icon: <FiUsers className="text-purple-500" size={24} />,
        link: "/customers/customers-list",
      },
    ];
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mt-4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const isAdmin = user?.role?.toLowerCase() == "admin";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {metrics.map((metric, index) => {
        const cardContent = (
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                {metric.title}
              </p>
              <p className="text-2xl font-bold mt-2 text-gray-800">
                {metric.value}
              </p>
              <p className="text-sm mt-1">{metric.change}</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 border">
              {metric.icon}
            </div>
          </div>
        );

        return isAdmin ? (
          <Link
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border hover:border-blue-400 transition duration-300"
            href={metric.link}
          >
            {cardContent}
          </Link>
        ) : (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
            {cardContent}
          </div>
        );
      })}
    </div>
  );
};
