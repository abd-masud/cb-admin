"use client";

import { useAuth } from "@/contexts/AuthContext";
import { SMTPSettings } from "@/types/smtp";
import { Spin } from "antd";
import React, { useState, useEffect, useCallback } from "react";
import { FaXmark } from "react-icons/fa6";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[calc(100vh-170px)]">
    <div className="text-center space-y-4">
      <Spin size="large" />
      <p className="text-gray-600">Loading SMTP Settings data...</p>
    </div>
  </div>
);

export const SMTPSettingsForm = () => {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<SMTPSettings>({
    host: "",
    port: 587,
    username: "",
    password: "",
    encryption: "none",
    email: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name == "port" ? Number(value) : value,
    }));
  };

  const fetchSMTPSettings = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/smtp?user_id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success && result.data.length > 0) {
        const smtp = result.data[0];
        setFormData({
          host: smtp.host || "",
          port: smtp.port || 587,
          username: smtp.username || "",
          password: smtp.password || "",
          encryption: smtp.encryption || "none",
          email: smtp.email || "",
          company: smtp.company || "",
        });
      } else {
        console.log(result.message || "No SMTP settings found");
      }
    } catch (error) {
      console.error("Failed to fetch SMTP settings:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSMTPSettings();
  }, [fetchSMTPSettings]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user_id = user?.id;
      const response = await fetch("/api/smtp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id }),
      });

      const result = await response.json();

      if (response.ok) {
        setUserMessage("SMTP settings Saved");
      } else {
        console.log(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error saving SMTP settings:", error);
    } finally {
      setTimeout(() => setUserMessage(null), 5000);
    }
  };

  const handleCloseMessage = () => {
    setUserMessage(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="bg-white p-5 mt-6 rounded-lg border shadow-md">
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
      <div className="flex items-center mb-4">
        <div className="h-2 w-2 bg-[#307EF3] rounded-full mr-2"></div>
        <h2 className="text-[13px] font-[500]">SMTP Settings</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[14px]" htmlFor="host">
              SMTP Host
            </label>
            <input
              type="text"
              name="host"
              id="host"
              value={formData.host}
              onChange={handleChange}
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              placeholder="Enter SMTP host"
              required
            />
          </div>

          <div>
            <label className="text-[14px]" htmlFor="port">
              Port
            </label>
            <input
              type="number"
              name="port"
              id="port"
              value={formData.port}
              onChange={handleChange}
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              placeholder="Enter port"
              required
            />
          </div>

          <div>
            <label className="text-[14px]" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="text-[14px]" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              placeholder="Enter password"
              required
            />
          </div>

          <div>
            <label className="text-[14px]" htmlFor="encryption">
              Encryption
            </label>
            <select
              name="encryption"
              id="encryption"
              value={formData.encryption}
              onChange={handleChange}
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              required
            >
              <option value="none">None</option>
              <option value="ssl">SSL</option>
              <option value="tls">TLS</option>
            </select>
          </div>

          <div>
            <label className="text-[14px]" htmlFor="email">
              From Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email || user?.email}
              onChange={handleChange}
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              placeholder="Enter from email"
              required
            />
          </div>

          <div>
            <label className="text-[14px]" htmlFor="company">
              From Name
            </label>
            <input
              type="text"
              name="company"
              id="company"
              value={formData.company || user?.company}
              onChange={handleChange}
              className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="flex justify-end items-end">
            <button
              type="submit"
              className="text-[14px] font-[500] py-2 w-40 rounded cursor-pointer transition-all duration-300 mt-4 text-white bg-[#307EF3] hover:bg-[#478cf3] focus:bg-[#307EF3] disabled:opacity-50"
            >
              Save Settings
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
