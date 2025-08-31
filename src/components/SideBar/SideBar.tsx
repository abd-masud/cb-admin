"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo.webp";
// import { useState } from "react";
import { usePathname } from "next/navigation";
import { AiFillDashboard } from "react-icons/ai";
import { FaUsers } from "react-icons/fa6";
import { RiExchangeDollarFill, RiMailSettingsFill } from "react-icons/ri";
import { IoNewspaperSharp } from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { useAccAdminRedirect } from "@/hooks/useAccAdmin";
import { MdPrivacyTip } from "react-icons/md";

interface SideBarProps {
  closeSidebar?: () => void;
}

export const SideBar = ({ closeSidebar }: SideBarProps) => {
  const { user } = useAuth();
  const pathname = usePathname();
  // const [openSection, setOpenSection] = useState<string | null>(null);
  useAccAdminRedirect();
  if (!user) return null;

  // const toggleSection = (section: string) => {
  //   setOpenSection(openSection == section ? null : section);
  // };

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && closeSidebar) {
      closeSidebar();
    }
  };

  const linkClass = (route: string) =>
    `text-[13px] text-white font-[500] flex items-center transition duration-300 group h-11 border-t border-[#252D37] ${
      pathname == route ? "text-white bg-[#1E2639]" : ""
    }`;

  // const subLinkClass = (route: string) =>
  //   `text-[13px] text-gray-400 hover:text-white font-[500] flex items-center transition duration-300 group h-11 ${
  //     pathname == route ? "text-white" : ""
  //   }`;

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

      <Link
        href={"/users"}
        className={linkClass("/users")}
        onClick={handleLinkClick}
      >
        <div className={linkBar("/users")}></div>
        <FaUsers className="ml-[21px] text-[16px] mr-3 w-5" />
        Users
      </Link>

      <Link
        href={"/terms-and-conditions"}
        className={linkClass("/terms-and-conditions")}
        onClick={handleLinkClick}
      >
        <div className={linkBar("/terms-and-conditions")}></div>
        <IoNewspaperSharp className="ml-[21px] text-[16px] mr-3 w-5" />
        Terms & Conditions
      </Link>

      <Link
        href={"/privacy-policy"}
        className={linkClass("/privacy-policy")}
        onClick={handleLinkClick}
      >
        <div className={linkBar("/privacy-policy")}></div>
        <MdPrivacyTip className="ml-[21px] text-[16px] mr-3 w-5" />
        Privacy Policy
      </Link>

      <Link
        href={"/smtp-settings"}
        className={linkClass("/smtp-settings")}
        onClick={handleLinkClick}
      >
        <div className={linkBar("/smtp-settings")}></div>
        <RiMailSettingsFill className="ml-[21px] text-[16px] mr-3 w-5" />
        SMTP Settings
      </Link>

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

      <div className="text-white font-bold flex items-center text-[30px] px-6 py-[19.5px]">
        <span className="text-white text-[14px] font-bold text-center px-5 py-3 border border-[#307DF1] rounded-lg">
          Business is in your hand...
        </span>
      </div>
    </main>
  );
};
