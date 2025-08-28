"use client";

import { useEffect, useMemo, useState } from "react";
import { Table, Switch, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CurrencyType } from "@/types/currency";
import { useAuth } from "@/contexts/AuthContext";
import styled from "styled-components";
import { currencyToCountryMap } from "./CountryFlag";
import Image from "next/image";

export const CurrencySettingsTable = () => {
  const { user } = useAuth();
  const [data, setData] = useState<CurrencyType[]>([]);
  const [searchText, setSearchText] = useState("");
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
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const jsonRes = await fetch("/data/currency.json");
        const json = await jsonRes.json();

        const currencyList: CurrencyType[] = Object.entries(json).map(
          ([code, currency]: any, index) => ({
            key: code,
            si: index + 1,
            currencyName: currency.name,
            code: currency.code,
            isDefault: false,
            countryCode: currencyToCountryMap[code] || "un",
          })
        );

        let activeCurrency = null;

        const dbRes = await fetch(`/api/currencies?user_id=${user.id}`);
        if (dbRes.status == 404) {
          activeCurrency = "USD";
        } else {
          const dbJson = await dbRes.json();
          activeCurrency = dbJson?.data?.[0]?.currency;
        }

        const updated = currencyList.map((item) => ({
          ...item,
          isDefault: item.code == activeCurrency,
        }));

        setData(updated);
      } catch (err) {
        console.error("Failed to fetch currency data:", err);
      }
    };

    fetchData();
  }, [user?.id]);

  const filteredCurrency = useMemo(() => {
    if (!searchText) return data;
    return data.filter((currency) =>
      Object.values(currency).some((value) =>
        value?.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [data, searchText]);

  const handleDefaultChange = async (key: string) => {
    if (!user?.id) return;

    const selectedCurrency = data.find((item) => item.key == key);
    if (!selectedCurrency) return;

    const payload = {
      user_id: user.id,
      currency: selectedCurrency.code,
    };

    try {
      const response = await fetch("/api/currencies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        const updatedData = data.map((item) => ({
          ...item,
          isDefault: item.key == key,
        }));
        setData(updatedData);
      }
    } catch (error) {
      console.error("Currency update failed:", error);
    }
  };

  const columns: ColumnsType<CurrencyType> = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Country",
      dataIndex: "countryCode",
      key: "flag",
      render: (countryCode: string) => (
        <Image
          src={`https://flagcdn.com/w40/${countryCode}.png`}
          width="40"
          height="30"
          alt={`Flag of ${countryCode.toUpperCase()}`}
          style={{ border: "1px solid #FAFAFA" }}
        />
      ),
    },
    {
      title: "Currency Name",
      dataIndex: "currencyName",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Default",
      dataIndex: "isDefault",
      key: "isDefault",
      render: (_, record) => (
        <Switch
          checked={record.isDefault}
          onChange={() => handleDefaultChange(record.key)}
        />
      ),
    },
  ];

  return (
    <main className="bg-white p-5 mt-6 rounded-lg border shadow-md">
      <div className="flex sm:justify-between justify-end items-center mb-5">
        <div className="sm:flex items-center hidden">
          <div className="h-2 w-2 bg-[#307EF3] rounded-full mr-2"></div>
          <h2 className="text-[13px] font-[500]">Currency Settings</h2>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Input
            type="text"
            placeholder="Search..."
            className="border text-[14px] sm:w-40 w-32 py-1 px-[10px] bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <StyledTable<any>
        columns={columns}
        dataSource={filteredCurrency}
        scroll={{ x: "max-content" }}
        pagination={false}
        bordered
      />
    </main>
  );
};
