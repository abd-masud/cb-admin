"use client";

import Image from "next/image";
import { FiCalendar } from "react-icons/fi";
import logo from "../../../public/images/logo.webp";
import { useAuth } from "@/contexts/AuthContext";

export const Company = () => {
  const { user } = useAuth();

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 mb-4">
      <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0 gap-2">
        <Image
          className="h-10 w-auto sm:hidden block"
          priority
          src={user?.logo || logo}
          height={500}
          width={500}
          alt="Copa Business Logo"
        />
        <h1 className="text-[22px] font-bold text-gray-800 truncate">
          {user?.company || "Copa Business"}
        </h1>
      </div>
      <div className="flex items-center md:justify-end justify-center">
        <div className="flex items-center justify-center bg-white gap-2 px-4 py-2 rounded-lg shadow-sm md:w-auto w-full">
          <FiCalendar className="text-gray-500" />
          <span className="text-gray-700 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
