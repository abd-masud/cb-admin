"use client";

import { Popover } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dummy from "../../../public/images/dummy.webp";
import { useAuth } from "@/contexts/AuthContext";
import { FaCalculator, FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { FaRightFromBracket } from "react-icons/fa6";
import { VscThreeBars } from "react-icons/vsc";
import { SiConvertio } from "react-icons/si";
import { useState } from "react";
import { MdFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import { useAccAdminRedirect } from "@/hooks/useAccAdmin";
import { CalculatorModal } from "./Calculator";
import { ConverterModal } from "./Converter";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header = ({ toggleSidebar }: HeaderProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
  const [isConverterVisible, setIsConverterVisible] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  useAccAdminRedirect();
  if (!user?.id) return;

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const showCalculator = () => {
    setIsCalculatorVisible(true);
  };

  const handleCalculatorCancel = () => {
    setIsCalculatorVisible(false);
  };

  const showConverter = () => {
    setIsConverterVisible(true);
  };

  const handleConverterCancel = () => {
    setIsConverterVisible(false);
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("cb_admin");
      localStorage.removeItem("userEmail");
      router.push("/auth/login");
    } catch {}
  };

  const popoverContent = (
    <div className="w-52">
      <div className="flex border-b mt-1 pl-3">
        <div className="mb-4">
          <p className="font-[500] text-black text-[14px]">{user?.name}</p>
          <p className="text-[13px] text-[#797c8b] capitalize">{user?.role}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 my-3 border-b">
        <Link
          className="flex items-center bg-white text-black hover:bg-[#EDF2F6] hover:text-[#00A3FF] transition-all duration-300  px-3 py-2 rounded text-[14px]"
          href={"/profile"}
        >
          <FaUser className="text-[12px] mr-3" />
          <span>My Profile</span>
        </Link>
        <Link
          className="flex items-center bg-white text-black hover:bg-[#EDF2F6] hover:text-[#00A3FF] transition-all duration-300  px-3 py-2 rounded text-[14px] mb-3"
          href={"/auth/change-password"}
        >
          <FaKey className="text-[12px] mr-3" />
          <span>Change Password</span>
        </Link>
      </div>
      <button
        className="flex items-center bg-red-500 text-white hover:bg-red-600 cursor-pointer transition-all duration-300  py-2 px-5 rounded-md ml-3 font-[500] my-2"
        onClick={handleSignOut}
      >
        <FaRightFromBracket className="mr-2" />
        <span>Log out</span>
      </button>
    </div>
  );

  return (
    <>
      <main className="flex justify-between items-center h-[70px] p-5 shadow-md w-full bg-white border-b border-[#dddddd]">
        <div className="flex items-center">
          <button
            className="text-[#6E6F78] px-3 py-1 border rounded-md"
            onClick={toggleSidebar}
          >
            <VscThreeBars className="fill-black" />
          </button>
          <div className="ml-4 sm:block hidden">
            {user.logo ? (
              <Image
                className="h-10 w-auto"
                priority
                src={user.logo}
                height={500}
                width={500}
                alt="Copa Business Logo"
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            className="text-[12px] font-bold border rounded px-2 py-[2px]"
            href={"/create-invoices"}
          >
            POS
          </Link>
          <button onClick={showConverter}>
            <SiConvertio className="h-5 w-5 fill-black" />
          </button>
          <button onClick={showCalculator}>
            <FaCalculator className="h-5 w-5 fill-black" />
          </button>
          <button onClick={toggleFullScreen}>
            {isFullScreen ? (
              <MdOutlineFullscreenExit className="h-8 w-8 fill-black" />
            ) : (
              <MdFullscreen className="h-8 w-8 fill-black" />
            )}
          </button>
          <Popover
            content={popoverContent}
            trigger="click"
            placement="bottomRight"
          >
            <button className="flex items-center border-2 border-[#307DF1] rounded-full overflow-hidden">
              <Image
                className="h-10 w-10"
                src={user?.image || dummy}
                height={225}
                width={225}
                alt={"User"}
              />
            </button>
          </Popover>
        </div>
      </main>
      <CalculatorModal
        visible={isCalculatorVisible}
        onCancel={handleCalculatorCancel}
      />
      <ConverterModal
        visible={isConverterVisible}
        onCancel={handleConverterCancel}
      />
    </>
  );
};
