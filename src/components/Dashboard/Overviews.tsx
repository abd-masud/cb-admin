"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProductData } from "@/types/chart";
import { InvoiceApiResponse, InvoiceData } from "@/types/invoices";
import { useCallback, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const CHART_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#A4DE6C",
  "#D0ED57",
  "#83a6ed",
  "#8dd1e1",
  "#82ca9d",
  "#ffc658",
  "#ff6e7f",
];

export const Overviews = () => {
  const { user } = useAuth();
  const [invoicesData, setInvoicesData] = useState<InvoiceData[]>([]);
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInvoices = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

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
      processProductData(json.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const processProductData = (invoices: InvoiceData[]) => {
    const productMap: Record<string, number> = {};

    invoices.forEach((invoice) => {
      const items = Array.isArray(invoice.items)
        ? invoice.items
        : typeof invoice.items === "string"
        ? JSON.parse(invoice.items)
        : [];

      items.forEach((item: any) => {
        const key = `${item.product}_${item.product_id}`;
        productMap[key] = (productMap[key] || 0) + Number(item.quantity);
      });
    });

    const processedData = Object.entries(productMap).map(([key, value]) => {
      const [name, productId] = key.split("_");
      return { name, value, productId };
    });

    setProductData(processedData);
  };

  useEffect(() => {
    if (!user?.id) return;
    const fetchCurrencies = async () => {
      try {
        const currencyRes = await fetch(`/api/currencies?user_id=${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const currencyJson = await currencyRes.json();

        if (currencyRes.status == 404 || !currencyJson.success) {
          setCurrencyCode("USD");
        } else if (currencyJson.data?.[0]?.currency) {
          setCurrencyCode(currencyJson.data[0].currency);
        }
      } catch (error) {
        console.error("Failed to fetch currency:", error);
        setCurrencyCode("USD");
      }
    };

    fetchCurrencies();
    fetchInvoices();
  }, [user?.id, fetchInvoices]);

  const processFinancialData = () => {
    if (!invoicesData.length) return [];

    const now = new Date();
    const twelveMonthsAgo = new Date(now);
    twelveMonthsAgo.setMonth(now.getMonth() - 11);

    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now);
      date.setMonth(now.getMonth() - (11 - i));
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const amount = invoicesData.reduce((sum, invoice) => {
        if (!invoice.date || !invoice.paid_amount) return sum;
        const invoiceDate = new Date(invoice.date);
        return invoiceDate.getFullYear() == year &&
          invoiceDate.getMonth() + 1 == month
          ? sum + Number(invoice.paid_amount)
          : sum;
      }, 0);

      return {
        name: date.toLocaleString("default", { month: "short" }),
        amount,
      };
    });
  };

  const financialData = processFinancialData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Product Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Products Overview
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : productData.length == 0 ? (
          <div className="flex justify-center items-center h-64">
            <p>No product data available</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {productData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} units`,
                    `${name} (${props.payload.productId})`,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Financial Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Financial Overview (Last 12 Months)
        </h2>
        <div className="bg-gray-50 rounded-lg h-64 flex items-center justify-center">
          {loading ? (
            <p className="text-gray-500">Loading data...</p>
          ) : financialData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `${value} ${currencyCode}`,
                    "Paid Amount",
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {financialData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No invoice data available</p>
          )}
        </div>
      </div>
    </div>
  );
};
